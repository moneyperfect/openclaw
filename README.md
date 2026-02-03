# OpenClaw Mini Telegram UI

一个 Telegram 风格的聊天界面，作为 OpenClaw Gateway 的前端客户端。

![Telegram-style UI](https://img.shields.io/badge/style-Telegram-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

## ✨ 特性

- 🎨 **Telegram 风格设计** - 深色主题、消息气泡、流畅动画
- 📱 **响应式布局** - 桌面双栏布局，移动端单栏切换
- 🌙 **主题切换** - 支持深色/浅色模式
- 💾 **本地存储** - 会话和消息自动保存到 localStorage
- 🔌 **适配器模式** - 支持 Mock / HTTP / WebSocket 多种通讯方式
- ⌨️ **快捷键** - Enter 发送，Shift+Enter 换行

## 🚀 快速开始

### 1. 安装依赖

```bash
cd e:\聊天界面创建
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# OpenClaw Gateway 地址
VITE_OPENCLAW_BASE_URL=http://127.0.0.1:18789

# 认证 Token
VITE_OPENCLAW_TOKEN=your_token_here

# 是否使用 Fake 适配器（开发/测试用）
VITE_USE_FAKE_ADAPTER=true

# API 聊天端点（追加到 BASE_URL）
VITE_CHAT_ENDPOINT=/api/chat
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

## 📁 项目结构

```
├── public/
│   └── telegram.svg        # Favicon
├── src/
│   ├── components/
│   │   ├── ChatLayout.tsx      # 主布局（响应式）
│   │   ├── ChatList.tsx        # 会话列表侧栏
│   │   ├── ChatWindow.tsx      # 聊天窗口
│   │   ├── MessageBubble.tsx   # 消息气泡
│   │   ├── InputBar.tsx        # 输入栏
│   │   └── TypingIndicator.tsx # 输入中指示器
│   ├── lib/
│   │   ├── storage.ts          # LocalStorage 工具
│   │   └── gatewayClient.ts    # Gateway 适配器
│   ├── store/
│   │   └── chatStore.ts        # Zustand 状态管理
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 🔧 Gateway 适配器

### FakeAdapter（开发模式）

设置 `VITE_USE_FAKE_ADAPTER=true` 启用模拟模式，无需真实 Gateway。

### HttpAdapter（生产模式）

设置 `VITE_USE_FAKE_ADAPTER=false`，配置真实的 Gateway 地址和 Token。

API 请求格式：
```http
POST /api/chat?token=xxx
Content-Type: application/json
Authorization: Bearer xxx

{
  "session_id": "demo-1",
  "message": "你好"
}
```

预期响应格式（支持多种）：
```json
{
  "message": "你好！有什么可以帮助你的？"
}
// 或
{
  "content": "..."
}
// 或
{
  "response": "..."
}
```

### 自定义 API 端点

如果你的 API 端点不同，修改 `.env` 中的 `VITE_CHAT_ENDPOINT`：

```env
VITE_CHAT_ENDPOINT=/v1/chat/completions
```

## 🎯 待实现（TODO）

- [ ] WebSocket 实时通讯
- [ ] 消息重发功能
- [ ] 附件发送
- [ ] 表情选择器
- [ ] 会话编辑/删除
- [ ] 消息复制

## 📜 许可

MIT License
# openclaw-telegram-ui
