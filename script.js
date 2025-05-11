document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const gradientBg = document.querySelector('.gradient-bg');
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    // 控制元素
    const changeGradientBtn = document.getElementById('changeGradient');
    const randomizeAllBtn = document.getElementById('randomizeAll');
    const particleTypeSelect = document.getElementById('particleType');
    const toggleParticlesBtn = document.getElementById('toggleParticles');
    const particleCountSlider = document.getElementById('particleCount');
    const countValue = document.getElementById('countValue');
    const speedControl = document.getElementById('speedControl');
    const speedValue = document.getElementById('speedValue');
    const opacityControl = document.getElementById('opacityControl');
    const opacityValue = document.getElementById('opacityValue');
    const particleColorPicker = document.getElementById('particleColor');
    const randomColorBtn = document.getElementById('randomColor');
    
    // 状态变量
    let particles = [];
    let particlesActive = true;
    let animationSpeed = 1;
    let globalParticleOpacity = 0.7;
    let globalParticleColor = '#ffffff';
    let currentParticleType = 'bubbles';
    let mouseX = null;
    let mouseY = null;
    
    // 渐变预设
    const gradients = [
        'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        'linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)',
        'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
        'linear-gradient(135deg, #43cbff 0%, #9708cc 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    ];
    
    // 调整画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 粒子类
    class Particle {
        constructor(type) {
            this.type = type || currentParticleType;
            this.reset();
            this.y = Math.random() * canvas.height;
            this.init();
        }
        
        init() {
            // 不同类型粒子的初始属性
            switch(this.type) {
                case 'bubbles':
                    this.size = Math.random() * 4 + 2;
                    this.speed = Math.random() * 0.5 + 0.1;
                    this.angle = Math.random() * Math.PI * 2;
                    this.velocity = (Math.random() - 0.5) * 0.5;
                    break;
                case 'stars':
                    this.size = Math.random() * 3 + 1;
                    this.speed = Math.random() * 0.8 + 0.2;
                    this.angle = Math.random() * Math.PI * 2;
                    this.points = Math.floor(Math.random() * 4) + 5; // 5-8角星
                    this.innerRadius = this.size * 0.4;
                    this.rotation = Math.random() * Math.PI * 2;
                    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                    break;
                case 'lines':
                    this.size = Math.random() * 30 + 10;
                    this.speed = Math.random() * 1 + 0.5;
                    this.angle = Math.random() * Math.PI * 2;
                    this.lineWidth = Math.random() * 2 + 1;
                    break;
                case 'snowflakes':
                    this.size = Math.random() * 8 + 4;
                    this.speed = Math.random() * 0.3 + 0.1;
                    this.angle = Math.random() * Math.PI * 2;
                    this.branches = Math.floor(Math.random() * 4) + 4; // 4-7个分支
                    this.rotation = Math.random() * Math.PI * 2;
                    this.rotationSpeed = (Math.random() - 0.5) * 0.01;
                    break;
                default: // mixed
                    const types = ['bubbles', 'stars', 'lines', 'snowflakes'];
                    this.type = types[Math.floor(Math.random() * types.length)];
                    this.init();
                    return;
            }
            
            this.opacity = Math.random() * globalParticleOpacity * 0.8 + globalParticleOpacity * 0.2;
            this.color = this.adjustColor(globalParticleColor, this.opacity);
        }
        
        adjustColor(color, opacity) {
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20 - Math.random() * 50;
            this.init();
        }
        
        update() {
            // 通用更新逻辑
            this.y += this.speed * animationSpeed;
            
            // 不同类型粒子的更新逻辑
            switch(this.type) {
                case 'bubbles':
                    this.x += Math.sin(this.angle) * 0.5 * animationSpeed;
                    this.angle += this.velocity * animationSpeed;
                    break;
                case 'stars':
                    this.x += Math.sin(this.angle) * 0.8 * animationSpeed;
                    this.angle += this.velocity * animationSpeed;
                    this.rotation += this.rotationSpeed * animationSpeed;
                    break;
                case 'lines':
                    this.x += Math.sin(this.angle) * 1.5 * animationSpeed;
                    this.angle += (Math.random() - 0.5) * 0.05 * animationSpeed;
                    break;
                case 'snowflakes':
                    this.x += Math.sin(this.angle) * 0.3 * animationSpeed;
                    this.angle += (Math.random() - 0.5) * 0.02 * animationSpeed;
                    this.rotation += this.rotationSpeed * animationSpeed;
                    break;
            }
            
            // 鼠标互动
            if (mouseX && mouseY) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (150 - distance) / 50;
                    
                    this.x -= forceDirectionX * force * animationSpeed * 0.5;
                    this.y -= forceDirectionY * force * animationSpeed * 0.5;
                }
            }
            
            // 重置超出边界的粒子
            if (this.y > canvas.height + 20 || 
                this.x < -20 || 
                this.x > canvas.width + 20) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            switch(this.type) {
                case 'bubbles':
                    this.drawBubble();
                    break;
                case 'stars':
                    this.drawStar();
                    break;
                case 'lines':
                    this.drawLine();
                    break;
                case 'snowflakes':
                    this.drawSnowflake();
                    break;
            }
            
            ctx.restore();
        }
        
        drawBubble() {
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // 添加高光效果
            ctx.beginPath();
            ctx.arc(this.size * 0.3, -this.size * 0.3, this.size * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
            ctx.fill();
        }
        
        drawStar() {
            ctx.rotate(this.rotation);
            ctx.beginPath();
            
            const outerRadius = this.size;
            const innerRadius = this.innerRadius;
            
            for (let i = 0; i < this.points * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / this.points;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        drawLine() {
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, this.size);
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
        
        drawSnowflake() {
            ctx.rotate(this.rotation);
            ctx.beginPath();
            
            // 中心点
            ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // 分支
            for (let i = 0; i < this.branches; i++) {
                const angle = (i * Math.PI * 2) / this.branches;
                ctx.save();
                ctx.rotate(angle);
                
                // 主分支
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, this.size);
                ctx.lineWidth = this.size * 0.15;
                ctx.strokeStyle = this.color;
                ctx.stroke();
                
                // 侧分支
                for (let j = 1; j <= 2; j++) {
                    const pos = this.size * (j * 0.3);
                    const length = this.size * 0.4;
                    
                    ctx.beginPath();
                    ctx.moveTo(0, pos);
                    ctx.lineTo(length, pos + length * 0.3);
                    ctx.lineWidth = this.size * 0.1;
                    ctx.strokeStyle = this.color;
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(0, pos);
                    ctx.lineTo(-length, pos + length * 0.3);
                    ctx.lineWidth = this.size * 0.1;
                    ctx.strokeStyle = this.color;
                    ctx.stroke();
                }
                
                ctx.restore();
            }
        }
    }
    
    // 初始化粒子
    function initParticles() {
        particles = [];
        const count = parseInt(particleCountSlider.value);
        
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(currentParticleType === 'mixed' ? null : currentParticleType));
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (particlesActive) {
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
        }
        
        requestAnimationFrame(animate);
    }
    
    // 随机改变渐变背景
    function changeGradient() {
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        gradientBg.style.background = randomGradient;
        
        // 添加动画效果
        gradientBg.style.animation = 'none';
        void gradientBg.offsetWidth; // 触发重绘
        gradientBg.style.animation = `gradientShift ${15 / animationSpeed}s ease infinite`;
    }
    
    // 随机所有设置
    function randomizeAll() {
        // 随机渐变
        changeGradient();
        
        // 随机粒子类型
        const types = ['bubbles', 'stars', 'lines', 'snowflakes', 'mixed'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        particleTypeSelect.value = randomType;
        currentParticleType = randomType;
        
        // 随机粒子数量
        const randomCount = Math.floor(Math.random() * 400) + 100;
        particleCountSlider.value = randomCount;
        countValue.textContent = randomCount;
        
        // 随机速度
        const randomSpeed = (Math.random() * 1.8 + 0.2).toFixed(1);
        speedControl.value = randomSpeed;
        speedValue.textContent = randomSpeed;
        animationSpeed = parseFloat(randomSpeed);
        gradientBg.style.animationDuration = `${15 / animationSpeed}s`;
        
        // 随机透明度
        const randomOpacity = (Math.random() * 0.8 + 0.2).toFixed(1);
        opacityControl.value = randomOpacity;
        opacityValue.textContent = randomOpacity;
        globalParticleOpacity = parseFloat(randomOpacity);
        
        // 随机颜色
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        particleColorPicker.value = randomColor;
        globalParticleColor = randomColor;
        
        // 重新初始化粒子
        initParticles();
    }
    
    // 切换粒子显示
    function toggleParticles() {
        particlesActive = !particlesActive;
        toggleParticlesBtn.textContent = particlesActive ? '隐藏粒子' : '显示粒子';
    }
    
    // 事件监听
    changeGradientBtn.addEventListener('click', changeGradient);
    randomizeAllBtn.addEventListener('click', randomizeAll);
    toggleParticlesBtn.addEventListener('click', toggleParticles);
    
    particleTypeSelect.addEventListener('change', function() {
        currentParticleType = this.value;
        initParticles();
    });
    
    particleCountSlider.addEventListener('input', function() {
        const count = parseInt(this.value);
        countValue.textContent = count;
        
        // 调整粒子数量
        if (count > particles.length) {
            // 增加粒子
            const addCount = count - particles.length;
            for (let i = 0; i < addCount; i++) {
                particles.push(new Particle(currentParticleType === 'mixed' ? null : currentParticleType));
            }
        } else if (count < particles.length) {
            // 减少粒子
            particles = particles.slice(0, count);
        }
    });
    
    speedControl.addEventListener('input', function() {
        animationSpeed = parseFloat(this.value);
        speedValue.textContent = animationSpeed.toFixed(1);
        gradientBg.style.animationDuration = `${15 / animationSpeed}s`;
    });
    
    opacityControl.addEventListener('input', function() {
        globalParticleOpacity = parseFloat(this.value);
        opacityValue.textContent = globalParticleOpacity.toFixed(1);
        
        // 更新所有粒子的透明度
        particles.forEach(particle => {
            particle.opacity = Math.random() * globalParticleOpacity * 0.8 + globalParticleOpacity * 0.2;
            particle.color = particle.adjustColor(globalParticleColor, particle.opacity);
        });
    });
    
    particleColorPicker.addEventListener('input', function() {
        globalParticleColor = this.value;
        
        // 更新所有粒子的颜色
        particles.forEach(particle => {
            particle.color = particle.adjustColor(globalParticleColor, particle.opacity);
        });
    });
    
    randomColorBtn.addEventListener('click', function() {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        particleColorPicker.value = randomColor;
        globalParticleColor = randomColor;
        
        // 更新所有粒子的颜色
        particles.forEach(particle => {
            particle.color = particle.adjustColor(globalParticleColor, particle.opacity);
        });
    });
    
    // 鼠标位置追踪
    canvas.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    canvas.addEventListener('mouseleave', function() {
        mouseX = null;
        mouseY = null;
    });
    
    // 触摸支持
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
    }, { passive: false });
    
    canvas.addEventListener('touchend', function() {
        mouseX = null;
        mouseY = null;
    });
    
    // 初始化
    initParticles();
    animate();
    
    // 每30秒自动变换一次渐变
    setInterval(changeGradient, 30000);
});