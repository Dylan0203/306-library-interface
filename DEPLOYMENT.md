# Kamal 部署指南

本專案已設定使用 Kamal 2.7.0 進行 Docker 容器化部署。

## 前置需求

### 本機環境
- ✅ Ruby 3.2+ (已安裝)
- ✅ Kamal 2.7.0 (已安裝)
- Docker Hub 帳號或其他 Container Registry
- SSH 存取部署伺服器的權限

### 伺服器環境
- Ubuntu/Debian Linux 伺服器
- Docker 已安裝
- SSH 存取權限
- 開放 80/443 port (HTTP/HTTPS)

## 設定步驟

### 1. 設定 Docker Registry 認證

編輯 `.kamal/secrets` 檔案:

```bash
# 設定 Docker Hub 密碼 (使用 access token)
export KAMAL_REGISTRY_PASSWORD="your_docker_access_token"
```

### 2. 更新部署設定

編輯 `config/deploy.yml`:

```yaml
# 更新以下欄位:
image: YOUR_DOCKER_USERNAME/306-library-interface
servers:
  web:
    - YOUR_SERVER_IP
proxy:
  host: YOUR_DOMAIN.com
registry:
  username: YOUR_DOCKER_USERNAME
```

### 3. 設定 SSH 存取

確保您可以 SSH 到部署伺服器:

```bash
ssh root@YOUR_SERVER_IP
```

如果使用非 root 使用者,在 `config/deploy.yml` 中設定:

```yaml
ssh:
  user: deploy
```

## 部署指令

### 首次部署

```bash
# 1. 設定伺服器環境 (安裝 Docker、Traefik proxy 等)
kamal server bootstrap

# 2. 建置並部署
kamal deploy
```

### 後續更新

```bash
# 一鍵部署更新 (零停機時間)
kamal deploy
```

### 其他常用指令

```bash
# 查看應用程式日誌
kamal app logs

# 查看即時日誌
kamal app logs -f

# 查看部署狀態
kamal app details

# 重啟應用程式
kamal app restart

# 進入容器 shell
kamal app exec -i sh

# 查看伺服器資訊
kamal server info

# 回滾到上一版本
kamal rollback

# 停止應用程式
kamal app stop

# 移除所有部署
kamal remove

# 查看 Traefik 代理狀態
kamal proxy details

# 重啟 Traefik 代理
kamal proxy restart
```

## 部署架構

### Kamal 架構說明

```
Internet (443/80)
       ↓
Traefik Proxy (Kamal 內建)
  ├─ SSL/TLS 終止 (Let's Encrypt)
  ├─ 路由管理
  └─ 負載平衡
       ↓
Your App Container (port 3000)
  └─ Bun serve (靜態檔案伺服器)
```

### 為什麼不需要 Nginx?

Kamal 已經內建 **Traefik** 反向代理,自動處理:
- ✅ **SSL/TLS** - Let's Encrypt 自動憑證
- ✅ **HTTP → HTTPS 重新導向**
- ✅ **路由管理** - 根據 domain 轉發
- ✅ **健康檢查**
- ✅ **零停機部署** - 藍綠部署策略
- ✅ **多應用程式支援** - 一台伺服器多個 app

您的應用程式只需要:
- 簡單的 HTTP 伺服器在 port 3000
- 提供靜態檔案

### Docker 多階段建置

1. **Builder Stage** (oven/bun:1)
   - 安裝 Bun 依賴套件
   - 執行 `bun run build` 產生靜態檔案
   - 輸出到 `.output/public/`

2. **Production Stage** (oven/bun:1-slim)
   - 複製靜態檔案
   - 安裝 `serve` CLI (輕量化靜態伺服器)
   - 在 port 3000 提供服務
   - 最終 image 大小: ~150MB

### Traefik 功能

Kamal 的 Traefik proxy 自動提供:
- **自動 SSL** - Let's Encrypt 憑證自動取得與續約
- **HTTP/2** - 現代化協定支援
- **Gzip 壓縮** - 自動壓縮回應
- **健康檢查** - 自動偵測故障容器
- **滾動更新** - 零停機部署
- **存取日誌** - 完整的請求記錄

## 環境變數設定

如需在容器中注入環境變數,編輯 `config/deploy.yml`:

```yaml
env:
  clear:
    NODE_ENV: production
    API_URL: https://n8n.306.team/webhook
  secret:
    - API_KEY
```

然後在 `.kamal/secrets` 中設定密碼:

```bash
export API_KEY="your_secret_key"
```

## 監控與除錯

### 健康檢查

Traefik 會自動檢查您的應用程式:

```bash
# 查看 proxy 狀態
kamal proxy details

# 查看應用程式狀態
kamal app details
```

### 查看容器狀態

```bash
# 應用程式容器
kamal app details

# Traefik 代理
kamal proxy details
```

### 查看即時日誌

```bash
# 應用程式日誌
kamal app logs -f

# Traefik 代理日誌
kamal proxy logs -f
```

### 進入容器檢查

```bash
kamal app exec -i sh
# 在容器內:
ls public/
curl localhost:3000
```

## 故障排除

### 建置失敗

```bash
# 本機測試 Docker 建置
docker build -t test .

# 查看建置日誌
kamal build details
```

### 部署失敗

```bash
# 查看部署日誌
kamal app logs

# 檢查容器狀態
kamal app details

# 檢查 Traefik 代理
kamal proxy details

# SSH 到伺服器手動檢查
ssh YOUR_SERVER_IP
docker ps -a
docker logs 306-library-interface-web
docker logs traefik
```

### SSL 憑證問題

確保:
- DNS A 記錄指向伺服器 IP
- 80/443 port 已開放
- 網域已正確設定在 `config/deploy.yml`
- 等待 DNS 傳播 (最多 24-48 小時)

```bash
# 檢查 DNS
dig YOUR_DOMAIN.com

# 檢查 port 開放
nc -zv YOUR_SERVER_IP 80
nc -zv YOUR_SERVER_IP 443

# 重啟 Traefik
kamal proxy restart
```

### 無法連線到應用程式

```bash
# 1. 檢查應用程式是否執行
kamal app details

# 2. 檢查應用程式日誌
kamal app logs

# 3. 檢查 Traefik 路由
kamal proxy details

# 4. SSH 到伺服器測試
ssh YOUR_SERVER_IP
docker exec 306-library-interface-web curl localhost:3000
```

## 安全性建議

1. **使用 Access Token** - 不要使用 Docker Hub 密碼,使用 access token
2. **SSH Key 認證** - 不要使用密碼登入伺服器
3. **定期更新** - 保持 Docker images 更新
4. **備份設定** - `.kamal/secrets` 不要提交到 Git
5. **防火牆設定** - 只開放必要的 ports (22, 80, 443)
6. **Let's Encrypt** - Kamal 自動處理 SSL 憑證

## 效能最佳化

### Docker Image 大小

- Builder stage: ~1GB (僅建置時)
- Production image: ~150MB (bun-slim + serve + 靜態檔案)

### Traefik 快取 & 壓縮

Traefik 自動提供:
- Gzip 壓縮
- HTTP/2 支援
- Keep-alive connections

### 靜態資源最佳化

Nuxt 已經在建置時最佳化:
- JS/CSS minification
- Tree shaking
- Code splitting
- Asset hashing

## 零停機部署原理

Kamal 使用**藍綠部署**策略:

1. 建置新 Docker image
2. 推送到 Registry
3. 在伺服器上拉取新 image
4. 啟動新容器 (port 3001)
5. 等待健康檢查通過
6. Traefik 切換流量到新容器
7. 停止舊容器
8. 清理舊 image

整個過程使用者**完全無感知**! 🎉

## 回滾機制

如果新版本有問題:

```bash
# 快速回滾到上一版本
kamal rollback
```

Kamal 會:
1. 停止新容器
2. 重新啟動上一版本容器
3. Traefik 切換回舊版本
4. 幾秒內完成回滾

## 多伺服器部署

如需部署到多台伺服器:

```yaml
servers:
  web:
    - 192.168.0.1
    - 192.168.0.2
    - 192.168.0.3

# 滾動部署設定
boot:
  limit: 1  # 一次更新一台
  wait: 10  # 等待 10 秒再更新下一台
```

## 成本估算

### 最小伺服器需求

- **CPU**: 1 vCPU
- **RAM**: 1GB (Traefik + App)
- **儲存**: 20GB
- **頻寬**: 視流量而定

### 推薦供應商

- DigitalOcean Droplet: $6/月 (1GB RAM)
- Linode Nanode: $5/月 (1GB RAM)
- Hetzner Cloud: €4.5/月 (2GB RAM)
- Vultr: $6/月 (1GB RAM)

## 進階功能

### 多應用程式部署

一台伺服器可以運行多個 Kamal 應用程式:

```yaml
# App 1: library.306.team
proxy:
  host: library.306.team

# App 2: admin.306.team (不同專案)
proxy:
  host: admin.306.team
```

Traefik 會根據 domain 自動路由! 🚀

### 自訂健康檢查

```yaml
healthcheck:
  path: /health
  interval: 10s
  timeout: 5s
```

### 定期任務 (Cron)

```yaml
servers:
  job:
    hosts:
      - 192.168.0.1
    cmd: bun run cleanup
```

## 參考資源

- [Kamal 官方文件](https://kamal-deploy.org)
- [Traefik 文件](https://doc.traefik.io/traefik/)
- [Nuxt 部署指南](https://nuxt.com/docs/getting-started/deployment)
- [Docker 多階段建置](https://docs.docker.com/build/building/multi-stage/)
- [Let's Encrypt](https://letsencrypt.org)

## 總結

✅ **Kamal = Docker + Traefik + Let's Encrypt + 零停機部署**

您不需要:
- ❌ 手動設定 Nginx
- ❌ 手動設定 SSL
- ❌ 手動管理 Docker
- ❌ 擔心停機時間

只需要:
- ✅ `kamal deploy` 一鍵部署
- ✅ 自動化的一切
- ✅ 專注於開發產品
