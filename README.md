# OpenClaw Mini Telegram UI

一个 Telegram 风格的聊天界面，作为 OpenClaw Gateway 的前端客户端。

![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

## ✨ 特性

- 🎨 **Telegram 风格设计** - 深色主题、消息气泡、流畅动画
- 📱 **移动端优先** - 针对手机优化的触控体验
- 📲 **PWA 支持** - 可添加到主屏幕，像 App 一样使用
- 🌙 **主题切换** - 支持深色/浅色模式
- 💾 **本地存储** - 会话和消息自动保存
- 🔌 **WebSocket** - 实时通讯

---

## 🚀 快速开始

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/moneyperfect/openclaw.git
cd openclaw

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

### 配置 Gateway

编辑 `.env` 文件：

```env
# OpenClaw Gateway 地址
VITE_OPENCLAW_BASE_URL=http://127.0.0.1:18789

# 你的 Token
VITE_OPENCLAW_TOKEN=你的token

# 是否使用模拟模式 (开发测试用)
VITE_USE_FAKE_ADAPTER=false

# API 端点
VITE_CHAT_ENDPOINT=/api/chat
```

---

## 🌐 部署到 Vercel

### 方法 1：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/moneyperfect/openclaw)

### 方法 2：手动部署

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量（见下方）
4. 部署

### ⚠️ 重要：Vercel 环境变量

在 Vercel 的 **Settings → Environment Variables** 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_OPENCLAW_BASE_URL` | `https://你的gateway域名` | **必须是公网可访问地址** |
| `VITE_OPENCLAW_TOKEN` | `你的token` | Gateway 认证令牌 |
| `VITE_USE_FAKE_ADAPTER` | `false` | 生产环境设为 false |
| `VITE_CHAT_ENDPOINT` | `/api/chat` | 根据 Gateway API 调整 |

> ⚠️ **注意**：部署到 Vercel 后，应用运行在云端，无法访问你本机的 `127.0.0.1:18789`。
> 你需要将 OpenClaw Gateway 部署到有公网 IP 的服务器，或使用内网穿透工具（如 ngrok、frp）。

---

## 📲 PWA 安装指南

### iOS (iPhone/iPad)
1. 用 Safari 打开网页
2. 点击底部分享按钮 ↑
3. 选择 "添加到主屏幕"

### Android
1. 用 Chrome 打开网页
2. 点击菜单 ⋮ → "添加到主屏幕"
3. 或等待安装提示弹出

### 桌面浏览器
1. Chrome/Edge 地址栏右侧会出现安装图标
2. 点击即可安装为桌面应用

---

## 📁 项目结构

```
├── public/
│   ├── manifest.json       # PWA 配置
│   ├── sw.js              # Service Worker
│   ├── icons/             # 应用图标
│   └── telegram.svg       # Favicon
├── src/
│   ├── components/        # React 组件
│   ├── lib/              # 工具函数
│   ├── store/            # 状态管理
│   └── index.css         # 全局样式
├── chat.html              # 独立 WebSocket 版本
└── .env.example           # 环境变量模板
```

---

## 🔧 单文件版本

如果你只需要一个简单的 WebSocket 聊天页面：

直接在浏览器打开 `chat.html` 即可使用（无需安装任何依赖）。

---

## 📜 许可

MIT License
