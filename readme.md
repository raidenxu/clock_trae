# 翻页数字时钟 (Fnt Clock)

一个基于Canvas实现的精美翻页数字时钟应用，支持Web端、macOS桌面端和Windows桌面端。

## 功能特性

- **真实翻页动画**：模拟物理卡片翻页效果，数字变化时呈现流畅的3D翻转动画
- **多种主题**：内置经典、暗黑、明亮、海洋、日落等多种主题
- **自定义主题**：支持自定义前景色、背景色、数字色和分隔符色
- **响应式设计**：自适应不同屏幕尺寸
- **实时更新**：每秒自动更新时间显示
- **跨平台支持**：Web端、macOS桌面端、Windows桌面端

## 技术实现

- **前端**：HTML5 Canvas + JavaScript + Vite
- **桌面端**：Tauri 2.0 (Rust)
- **跨平台**：一套代码，多端编译

## 项目结构

```bash
fntClock_trae_solo_coder/
├── index.html              # 主HTML文件
├── style.css               # 样式文件
├── vite.config.js          # Vite配置
├── package.json            # 项目配置
├── readme.md              # 本文档
├── src/                   # 前端源代码
│   ├── main.js           # 入口文件
│   ├── animations/       # 动画实现
│   │   ├── fade.js
│   │   ├── flip.js
│   │   ├── rotate.js
│   │   ├── slide.js
│   │   └── zoom.js
│   ├── config/          # 配置文件
│   │   └── themes.js
│   └── modules/         # 核心模块
│       ├── animation.js
│       └── renderer.js
├── src-tauri/            # Tauri Rust后端
│   ├── Cargo.toml       # Rust项目配置
│   ├── tauri.conf.json  # Tauri配置
│   ├── build.rs         # 构建脚本
│   ├── icons/           # 应用图标
│   ├── gen/             # 自动生成的文件
│   └── src/             # Rust源代码
│       ├── lib.rs
│       └── main.rs
├── scripts/              # 工具脚本
│   └── icon-generator.html  # 图标生成器
└── dist/                 # 构建输出（运行build后生成）
```

## 环境要求

### 通用要求
- Node.js >= 16
- pnpm (推荐) 或 npm

### Web端
- 现代浏览器 (Chrome, Firefox, Safari, Edge)

### 桌面端 (macOS)
- macOS 10.13+
- Rust 1.70+
- Xcode 命令行工具
- Cargo

### 桌面端 (Windows)
- Windows 10+
- Rust 1.70+
- Visual Studio Build Tools (包含 "Desktop development with C++")
- WebView2 (Windows 10 及以下版本需要手动安装)

## 安装依赖

```bash
pnpm install
```

### 安装 Rust (桌面端必需)

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Windows:**
1. 下载并安装 [rustup](https://win.rustup.rs/)
2. 安装 Visual Studio Build Tools

## 开发模式

### Web端开发

```bash
pnpm dev
```

访问 http://localhost:5173

### 桌面端开发

```bash
pnpm dev:desktop
```

这会启动Tauri开发窗口，支持热重载。

## 构建生产版本

### Web端构建

```bash
pnpm build:web
```

输出目录: `dist/`

### 桌面端构建

```bash
pnpm build:desktop
```

**构建输出位置:**

| 平台 | 输出位置 |
|------|----------|
| macOS | `src-tauri/target/release/bundle/dmg/` |
| macOS | `src-tauri/target/release/bundle/macos/` (App bundle) |
| Windows | `src-tauri/target/release/bundle/msi/` |
| Windows | `src-tauri/target/release/bundle/nsis/` (安装包) |

## 应用图标

### 生成图标

项目包含图标生成器，可通过浏览器打开：

```bash
open scripts/icon-generator.html
```

或者使用 Tauri CLI 自动生成：

1. 准备一张 124x124 或更大的 PNG 图片
2. 运行：
```bash
pnpm tauri icon /path/to/your/icon.png
```

这会自动生成所有需要的图标格式：
- PNG (各种尺寸)
- .icns (macOS)
- .ico (Windows)

## 核心实现

### 翻页动画原理

翻页动画分为两个阶段：

1. **前半段（0-50%）**：旧数字的上半部分沿中轴线下翻，逐渐消失，同时露出新数字的上半部分
2. **后半段（50-100%）**：新数字的下半部分沿中轴线下翻，逐渐显示，同时遮盖旧数字的下半部分

通过 Canvas 的缩放变换和渐变阴影效果，模拟出真实的 3D 翻页视觉效果。

### Tauri 架构

- **前端**：负责 UI 渲染和用户交互
- **Rust 后端**：负责窗口管理、系统 API 调用
- **通信**：通过 Tauri 提供的 IPC 机制通信

## 许可证

MIT License

## 常见问题

### Q: 为什么 Windows 构建需要 WebView2？
A: Tauri 使用系统 WebView 渲染前端。Windows 11 已内置 WebView2，Windows 10 及以下版本需要手动安装。

### Q: 如何自定义应用窗口大小？
A: 编辑 `src-tauri/tauri.conf.json` 中的 `app.windows` 配置。

### Q: 构建失败怎么办？
A: 
1. 确保 Rust 环境正确安装
2. 运行 `rustup update` 更新 Rust
3. 删除 `src-tauri/target` 目录后重新构建
