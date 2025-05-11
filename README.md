# 🌈 粒子宇宙 - CSS/JS视觉实验

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Animation-blue)](https://developer.mozilla.org/zh-CN/docs/Web/CSS)

一个基于纯前端技术打造的动态粒子交互系统，具有流畅的动画效果和丰富的自定义选项。

## ✨ 项目特点

- **多种粒子形态**：气泡/星星/线条/雪花4种渲染模式
- **实时参数调节**：可动态调整数量、速度、透明度和颜色
- **高级渐变背景**：模仿苹果壁纸风格的平滑色彩过渡
- **完整交互体验**：支持鼠标/触摸互动响应
- **响应式设计**：完美适配各种屏幕尺寸
- **60fps流畅动画**：优化性能的requestAnimationFrame实现

## 🛠️ 技术实现方案

### 核心架构
```javascript
// 粒子基类
class Particle {
  constructor(type) {
    this.type = type
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 3 + 1
    this.speed = Math.random() * 0.5 + 0.1
  }

  update() {
    // 通用更新逻辑
    this.y += this.speed
    if (this.y > canvas.height) this.reset()
  }

  draw() {
    // 由子类实现具体绘制逻辑
  }

  reset() {
    this.y = -20
    this.x = Math.random() * canvas.width
  }
}
````

**思维导图**
```mermaid
graph TD
    A[HTML结构] --> B[CSS样式]
    A --> C[JavaScript逻辑]
    B --> D[渐变背景动画]
    C --> E[粒子系统]
    C --> F[用户交互控制]
    E --> G[粒子渲染]
    E --> H[物理运动模拟]
    F --> I[参数调节]
    F --> J[鼠标互动]
````

### 2. 四种粒子实现方案
**气泡粒子**

```javascript
class BubbleParticle extends Particle {
  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
    ctx.fill()
    
    // 气泡高光
    ctx.beginPath()
    ctx.arc(this.x-this.size*0.3, this.y-this.size*0.3, 
            this.size*0.2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity*0.5})`
    ctx.fill()
  }
}
````

**星形粒子**
```javascript
class StarParticle extends Particle {
  constructor() {
    super()
    this.points = Math.floor(Math.random() * 3) + 5 // 5-8角星
    this.rotation = Math.random() * Math.PI * 2
  }

  draw() {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    
    let outerRadius = this.size
    let innerRadius = this.size * 0.4
    
    ctx.beginPath()
    for (let i = 0; i < this.points * 2; i++) {
      let radius = i % 2 === 0 ? outerRadius : innerRadius
      let angle = (i * Math.PI) / this.points
      ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle))
    }
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
    
    ctx.restore()
  }
}
````

### 3. 动画循环优化方案
```javascript
let lastTime = 0
const fps = 60
const interval = 1000 / fps
function animate(timestamp) {
  if (timestamp - lastTime >= interval) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 使用transform优化性能
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    
    particles.forEach(p => {
      p.update()
      p.draw()
    })
    
    ctx.restore()
    lastTime = timestamp
  }
  requestAnimationFrame(animate)
}
````
### 4. 交互控制实现
```javascript
// 控制面板事件绑定
document.getElementById('particleCount').addEventListener('input', (e) => {
  const count = parseInt(e.target.value)
  if (count > particles.length) {
    // 增加粒子
    const addCount = count - particles.length
    for (let i = 0; i < addCount; i++) {
      particles.push(createParticle())
    }
  } else {
    // 减少粒子
    particles.length = count
  }
})

// 鼠标互动
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
  
  particles.forEach(p => {
    const dx = mouseX - p.x
    const dy = mouseY - p.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < 100) {
      const force = (100 - distance) / 50
      p.x -= (dx / distance) * force
      p.y -= (dy / distance) * force
    }
  })
})
````

### 5. 响应式适配方案
```javascript
function handleResize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  // 重新计算粒子位置
  particles.forEach(p => {
    p.x = Math.random() * canvas.width
    p.y = Math.random() * canvas.height
  })
}

window.addEventListener('resize', debounce(handleResize, 200))

// 防抖函数
function debounce(func, wait) {
  let timeout
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}
````
