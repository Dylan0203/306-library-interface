# Migrate CSS to Tailwind Utility Classes

**Change ID:** `migrate-to-tailwind-utilities`  
**Status:** Proposed  
**Created:** 2025-10-20  
**Author:** AI Assistant

## Overview

將 `assets/css/main.css` 中使用 `@apply` 的自訂 CSS 類別遷移到直接在 Vue 元件中使用 Tailwind CSS utility classes。這將減少 CSS 檔案大小、提升可維護性,並完全發揮 Tailwind CSS 的即時性和靈活性。

## Motivation

### Current State
- `main.css` 包含大量使用 `@apply` 定義的自訂類別 (`.book-card`, `.modal-overlay`, `.btn-primary` 等)
- 元件使用這些自訂類別,需要在 CSS 和模板之間來回切換
- 增加了抽象層級,降低了樣式的可見性和可調整性

### Problems
1. **維護成本高**: 修改樣式需要同時查看 CSS 和元件檔案
2. **不符合 Tailwind 最佳實踐**: Tailwind 鼓勵直接使用 utility classes
3. **重複定義**: 部分樣式在不同類別中重複
4. **檔案分離**: 樣式邏輯分散在 CSS 和元件之間

### Benefits
1. **所見即所得**: 在元件模板中直接看到所有樣式
2. **提升開發效率**: 不需要在檔案間切換
3. **減少 CSS 體積**: 移除中間層的自訂類別
4. **更好的可維護性**: 樣式邏輯集中在元件內
5. **符合 Tailwind 哲學**: 充分利用 utility-first CSS 的優勢

## Proposed Changes

### Affected Components
- `components/BookList.vue` - 書籍列表和卡片樣式
- `components/BorrowForm.vue` - 表單和模態框樣式
- `components/QRCodeModal.vue` - QR Code 模態框
- `components/Toast.vue` - 通知提示
- `components/Navigation.vue` - 導航列 (已部分使用 utility classes)
- `pages/*.vue` - 頁面佈局

### CSS Changes
- **完全移除** `main.css` 中所有自訂類別和樣式層
  - 移除 `@layer components` 內的所有自訂類別
  - 移除 `@layer base` 的基礎樣式 (改用 Tailwind 設定)
  - 移除 `@layer utilities` 中的工具類別
  - 移除所有 `@keyframes` 動畫定義 (改用 Tailwind animate 或 CSS-in-JS)
- 使用 Tailwind 設定檔配置全域樣式
- 最終 `main.css` 僅保留 `@import "tailwindcss";`

### Migration Strategy
1. 逐一遷移元件,確保視覺效果一致
2. 使用 Vue 的 `:class` 綁定處理條件樣式
3. **建立 TypeScript 常數**儲存重複的樣式組合,提升可維護性
4. 將 `@keyframes` 動畫轉換為 Tailwind 的 `animate-*` utilities 或 Transition 元件
5. 將全域基礎樣式移至 Tailwind 設定檔或使用 Tailwind 的預設值
6. 保持響應式設計和暗色模式支援

## Scope

### In Scope
- 遷移所有元件模板中的 CSS 類別到 Tailwind utilities
- **完全清空** `main.css`,僅保留 Tailwind import
- 為重複樣式組合建立 TypeScript 常數
- 將動畫轉換為 Tailwind animations 或 Vue Transition
- 將全域樣式移至 Tailwind 設定檔或 `app.vue`
- 確保所有功能和視覺效果不受影響
- 維持響應式設計 (mobile-first)
- 維持暗色模式支援

### Out of Scope
- 重新設計 UI (保持現有設計不變)
- 更改元件邏輯或功能
- 引入新的 UI 框架或元件庫
- 修改 `checkbox.css` (獨立的樣式檔案)

## Dependencies

### Blocked By
- None

### Blocks
- None

### Related Changes
- 可為未來的 UI 組件庫整合 (如完全採用 Nuxt UI) 鋪路
- 為響應式設計調整提供更大靈活性

## Risks and Mitigations

### Risks
1. **樣式不一致**: 遷移過程中可能出現視覺差異
   - **緩解**: 逐元件遷移,每次遷移後進行視覺測試
   
2. **類別名稱過長**: Tailwind utility classes 可能導致 HTML 冗長
   - **緩解**: 使用 Vue 的 `:class` 綁定和適當的換行格式化
   
3. **重複代碼**: 相似樣式在多處重複
   - **緩解**: 提取可重用的類別組合為常數或 composable

### Rollback Plan
- Git 保留遷移前的完整狀態
- 可逐元件回滾而不影響其他部分

## Testing Strategy

### Manual Testing
遵循 `tests/manual-test-plan.md` 進行完整測試:
1. 視覺回歸測試 (比對遷移前後)
2. 響應式設計測試 (320px - 2560px)
3. 暗色模式切換測試
4. 互動功能測試 (hover, focus, active states)
5. 多瀏覽器測試 (Chrome, Firefox, Safari, Edge)

### Validation
- Build 成功且無警告
- TypeScript 型別檢查通過
- 檔案大小合理 (預期減少)

## Timeline

- **Phase 1**: 遷移核心元件 (BookList, BorrowForm) - 2 小時
- **Phase 2**: 遷移次要元件 (Toast, QRCodeModal) - 1 小時  
- **Phase 3**: 清理 `main.css` - 0.5 小時
- **Phase 4**: 完整測試和調整 - 1 小時

**Total Estimated Effort**: 4.5 小時

## Decisions Made

1. ✅ **建立 TypeScript 常數**: 為常用樣式組合建立可重用的 TypeScript 常數
   - 例如: `const cardClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm ...'`
   - 提升可維護性,減少重複代碼

2. ✅ **完全移除自訂 CSS**: 包括所有動畫定義
   - `shimmer` 動畫改用 Tailwind 的 `animate-pulse` 或自訂 animation
   - `slideIn` 動畫改用 Vue 的 `<Transition>` 元件或 Tailwind animate
   - 所有 `@keyframes` 轉換為 Tailwind utilities

3. ✅ **不保留基礎樣式層**: 移除 `@layer base`
   - 全域樣式改用 Tailwind 設定檔 (`tailwind.config.ts`)
   - 或在 `app.vue` 中使用 `<NuxtLayout>` 設定全域樣式
   - 使用 Tailwind 的預設排版和字體配置

## References

- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)
- [Nuxt UI Components](https://ui.nuxt.com/)
- Current codebase: `assets/css/main.css`, `components/*.vue`
