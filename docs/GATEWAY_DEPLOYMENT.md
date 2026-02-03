# OpenClaw Gateway 公网部署指南

将本地的 OpenClaw Gateway 暴露到公网，有以下几种方式：

---

## 方式一：ngrok（最简单，推荐新手）

**原理**：ngrok 是一个内网穿透服务，它会给你的本地服务生成一个临时公网地址。

### 操作步骤

1. **下载 ngrok**
   - 访问 https://ngrok.com/download
   - 下载 Windows 版本并解压

2. **注册账号**（免费）
   - 访问 https://dashboard.ngrok.com/signup
   - 注册后获取 AuthToken

3. **配置 ngrok**
   ```bash
   ngrok config add-authtoken 你的AuthToken
   ```

4. **启动隧道**
   ```bash
   # 确保 OpenClaw Gateway 正在运行 (端口 18789)
   ngrok http 18789
   ```

5. **获取公网地址**
   - 启动后会显示类似：`https://abc123.ngrok.io`
   - 将此地址填入 Vercel 环境变量 `VITE_OPENCLAW_BASE_URL`

> ⚠️ 免费版每次重启地址会变；付费版可固定域名。

---

## 方式二：Cloudflare Tunnel（免费+稳定）

**原理**：Cloudflare 提供的免费隧道服务，需要有自己的域名。

### 操作步骤

1. **安装 cloudflared**
   ```bash
   # Windows (使用 winget)
   winget install Cloudflare.cloudflared
   ```

2. **登录 Cloudflare**
   ```bash
   cloudflared tunnel login
   ```

3. **创建隧道**
   ```bash
   cloudflared tunnel create openclaw
   ```

4. **配置隧道**
   创建 `~/.cloudflared/config.yml`：
   ```yaml
   tunnel: openclaw
   credentials-file: ~/.cloudflared/你的隧道ID.json
   
   ingress:
     - hostname: chat.你的域名.com
       service: http://localhost:18789
     - service: http_status:404
   ```

5. **配置 DNS**
   ```bash
   cloudflared tunnel route dns openclaw chat.你的域名.com
   ```

6. **运行隧道**
   ```bash
   cloudflared tunnel run openclaw
   ```

---

## 方式三：frp（自建服务器）

**原理**：需要一个有公网 IP 的服务器作为中转。

### 服务器端 (frps)

1. 下载 frp：https://github.com/fatedier/frp/releases
2. 配置 `frps.toml`：
   ```toml
   bindPort = 7000
   vhostHTTPPort = 8080
   ```
3. 运行：`./frps -c frps.toml`

### 本地端 (frpc)

1. 配置 `frpc.toml`：
   ```toml
   serverAddr = "你的服务器IP"
   serverPort = 7000
   
   [[proxies]]
   name = "openclaw"
   type = "http"
   localPort = 18789
   customDomains = ["chat.你的域名.com"]
   ```
2. 运行：`./frpc -c frpc.toml`

---

## 方式四：直接部署 Gateway（最稳定）

将 OpenClaw Gateway 直接部署到云服务器：

1. **购买云服务器**（阿里云/腾讯云/AWS 等）
2. **安装 Gateway** 并配置开放 18789 端口
3. **绑定域名**（可选但推荐）
4. **配置 HTTPS**（Let's Encrypt 免费证书）

---

## OpenClaw 能自动完成吗？

目前 OpenClaw Gateway 本身不包含内网穿透功能。你需要选择上述方式之一。

**建议**：
- 临时测试 → 用 **ngrok**
- 长期使用 → 用 **Cloudflare Tunnel** 或部署到云服务器

---

## 配置 Vercel

完成上述任一步骤后，在 Vercel 中设置：

| 环境变量 | 值 |
|---------|-----|
| `VITE_OPENCLAW_BASE_URL` | `https://你的公网地址` |
| `VITE_OPENCLAW_TOKEN` | 你的 token |
| `VITE_USE_FAKE_ADAPTER` | `false` |
