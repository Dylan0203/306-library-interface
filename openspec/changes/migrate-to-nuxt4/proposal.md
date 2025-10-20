# Migrate to Nuxt 4

## Why

目前專案使用 Vue 3 CDN 版本作為靜態單頁應用,缺乏現代化的開發工具鏈和最佳實踐:

- 無法使用 TypeScript 進行類型檢查
- 缺少熱模組替換 (HMR) 影響開發效率
- 無法使用 npm 套件管理和版本控制
- 缺乏 SSR/SSG 優化,影響 SEO 和初始載入效能
- 元件以字串模板形式存在,缺少 IDE 支援和語法高亮
- 無法使用 CSS 預處理器或現代化 CSS 工具鏈

遷移到 Nuxt 4 + Bun 可提供:
- 完整的 TypeScript 支援
- Vite 驅動的開發體驗 (快速 HMR)
- Auto-imports 和檔案路由系統
- SSR/SSG/SPA 彈性部署選項
- 優化的生產構建和程式碼分割
- 豐富的生態系統和官方模組
- **Bun 超快速套件安裝和執行** (比 npm/pnpm 快 2-10 倍)

## What Changes

**BREAKING** - 完整重構專案架構:

### 架構層面
- 從靜態 HTML + CDN Vue 遷移到 Nuxt 4 專案結構
- 引入 package.json 和 **Bun 套件管理**
- 添加 nuxt.config.ts 配置檔
- 建立 pages/、components/、composables/ 目錄結構
- 設定 Vite 開發伺服器和構建流程 (由 Bun 執行)

### 程式碼遷移
- 將 `js/pages/available.js` → `pages/index.vue`
- 將 `js/pages/borrowed.js` → `pages/borrowed.vue`
- 將 `js/components/*.js` → `components/*.vue`
- 將 `js/api.js` → `composables/useApi.ts`
- 將 `js/auth.js` → `composables/useAuth.ts`
- 將 `css/styles.css` → `assets/css/` (保持 vanilla CSS)
- 將 `index.html`, `borrowed.html` 移除 (由 Nuxt 自動生成)

### 相依性管理
- 移除 CDN Vue 3 連結
- 添加 nuxt 3.x/4.x 到 package.json
- 移除外部 QR Code 和 Google Identity CDN (改用 npm 套件)
- 設定 @nuxtjs/google-fonts (選用)

### 開發工作流
- **BREAKING** - 開發命令從 `python3 -m http.server` 改為 `bun run dev`
- **BREAKING** - 構建命令改為 `bun run build`
- **BREAKING** - 套件安裝從無改為 `bun install`
- **BREAKING** - 部署從靜態檔案改為 `.output/public/` (SSG) 或 `.output/` (SSR)

### API 整合
- 保持現有 n8n webhook endpoints 不變
- 將 API 呼叫重構為 TypeScript composables
- 添加 Nuxt 環境變數管理 (NUXT_PUBLIC_API_BASE_URL)

### 保持不變
- ✅ 使用者功能完全相同 (瀏覽、借閱、歸還)
- ✅ UI/UX 設計保持一致
- ✅ 響應式設計和無障礙功能
- ✅ Google 登入整合
- ✅ QR Code 功能
- ✅ 手動測試策略 (無自動化測試)

## Impact

### Affected Specs
- `frontend-architecture` (新增)
- `book-browsing` (新增)
- `book-borrowing` (新增)

### Affected Code
- **完全重構** - 所有前端程式碼
- `index.html`, `borrowed.html`, `print.html` - 移除或轉換為 Nuxt pages
- `js/**/*.js` - 轉換為 `.vue` 或 `.ts` 檔案
- `css/styles.css` - 遷移到 `assets/css/`
- 新增檔案:
  - `package.json`
  - `bun.lockb` (Bun lockfile)
  - `nuxt.config.ts`
  - `tsconfig.json`
  - `.gitignore` (更新,添加 `node_modules/`, `bun.lockb`)
  - `app.vue` (根元件)

### Breaking Changes
- **開發環境**: 需要 Bun 1.0+ (包含 Node.js 相容層)
- **套件管理**: 使用 `bun install`、`bun add`、`bun remove`
- **開發命令**: `bun run dev` 取代 `python3 -m http.server`
- **部署流程**: 需要構建步驟 (`bun run build`)
- **部署產物**: 從根目錄檔案改為 `.output/public/` (SSG 模式)

### Migration Path
1. 保留舊版本在 `legacy/` 分支
2. 在新分支進行 Nuxt 4 遷移
3. 完成後進行完整手動測試
4. 更新 README.md 部署說明
5. 合併到主分支

### Timeline Estimate
- Setup Nuxt 4 project: 1-2 hours
- Migrate components: 2-3 hours
- Migrate pages and routing: 1-2 hours
- Migrate API layer: 1-2 hours
- Migrate auth and QR features: 1-2 hours
- Styling and responsive design: 2-3 hours
- Testing and bug fixes: 2-4 hours

**Total: 10-18 hours**
