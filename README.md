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
