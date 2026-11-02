# Player CMS

玩家後台管理系統（前端）。提供玩家時間軸、玩家標記、個人資料與德州撲克數據分析等頁面，目前資料由 MSW（Mock Service Worker）模擬，尚未串接正式後端 API。

## 技術棧

| 類別 | 使用 |
| --- | --- |
| 框架 | Vue 3（Composition API、`<script setup>`）+ TypeScript |
| 建置 | Vite |
| 路由 | Vue Router |
| UI | Element Plus（按需自動引入） |
| 樣式 | SCSS（`<style scoped lang="scss">`） |
| HTTP | Axios |
| Mock | MSW |

## 環境需求

- Node.js `^22.18.0` 或 `>=24.12.0`
- npm

## 快速開始

```bash
npm install
npm run dev
```

## 常用指令

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 型別檢查（`vue-tsc`）並打包 |
| `npm run build-only` | 只打包，不做型別檢查 |
| `npm run type-check` | 只做型別檢查 |
| `npm run preview` | 預覽打包結果 |

## 環境變數

定義於 `.env.development`：

| 變數 | 預設值 | 說明 |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | Axios `baseURL` |
| `VITE_USE_MSW` | `true` | 為 `true` 時，啟動時載入 MSW 攔截 API 請求 |

串接正式後端時，把 `VITE_USE_MSW` 改為 `false`，並將 `VITE_API_URL` 指向後端位址。

## 頁面與路由

預設進入 `/` 會導向 `/timeline`。

| 路徑 | 頁面 | 狀態 |
| --- | --- | --- |
| `/timeline` | 時間軸（日期篩選） | 已完成 |
| `/player-tag` | 玩家標記 | 已完成 |
| `/player-profile` | 個人資料 | 已完成 |
| `/texas` | 德州撲克分析 | 已完成 |
| `/backpack` | 背包道具 | 開發中 |
| `/short-deck` | 短牌 | 開發中 |
| `/all-in-or-fold` | 全押或棄牌 | 開發中 |
| `/omaha` | 奧馬哈 | 開發中 |
| `/squid` | 魷魚遊戲 | 開發中 |
| `/thunder` | 閃電 | 開發中 |
| `/ofc` | 大波羅 | 開發中 |
| `/thirteen` | 13張 | 開發中 |
| `/tournament` | 錦標賽 | 開發中 |
| `/earnings` | 收益分析 | 開發中 |

「開發中」頁面使用 `FeatureUnderDevelopment` 元件作為佔位。

## 專案結構

```text
src/
├── apis/          # API 請求（依功能分檔，統一經由 utils/request.ts）
├── assets/        # SVG 圖示與圖片
├── components/    # 跨頁共用元件（common / form / layout / table）
├── composables/   # 共用邏輯（表格分頁、排序、格式化、主題）
├── layout/        # 後台版型（SideBar、TopBar）
├── mock/          # Mock 資料
├── mocks/         # MSW 設定（browser.ts、handlers/）
├── router/        # 路由設定
├── styles/        # 全域 SCSS（variables、mixins、reset、data-table）
├── types/         # TypeScript 型別
├── utils/         # 工具函式（request、copyToClipboard）
└── views/         # 頁面，各頁私有元件放在 views/<page>/components/
```

## Mock API（MSW）

- Handler 位於 `src/mocks/handlers/`，資料來源在 `src/mock/`。
- Service Worker 檔案為 `public/mockServiceWorker.js`（由 `msw init` 產生，勿手動修改）。
- 未被攔截的請求會直接放行（`onUnhandledRequest: "bypass"`）。

新增一支 API 的流程：

1. `src/types/` 定義型別
2. `src/apis/` 新增請求函式
3. `src/mock/` 放假資料
4. `src/mocks/handlers/` 新增 handler 並在 `index.ts` 註冊

### 目前的 API 端點

| 功能 | 端點 |
| --- | --- |
| 玩家 | `GET /players/list` |
| 個人資料 | `GET /profile/:playerId` |
| 時間軸 | `GET /timeline/:playerId/list`、`GET /timeline/filter-options` |
| 玩家標記 | `/playerTag/list`、`/playerTag/names`、`/playerTag/tag-options`、`/playerTag/country-options`、`/playerTag/batch-delete`、`/playerTag/item` |
| 德州撲克 | `/texas/:playerId/summary`、`/street-stats`、`/hands-highlight`、`/sessions`、`/sessions/export` |

## 請求處理（`src/utils/request.ts`）

- `baseURL` 取自 `VITE_API_URL`，逾時 5 秒。
- 請求攔截器：若 `localStorage` 有 `token`，自動帶入 `Authorization: Bearer <token>`。
- 回應攔截器：直接回傳 `response.data`；發生錯誤時以 `ElMessage` 統一提示。

## 開發規範

專案規範放在 `.cursor/rules/`，開發前請先閱讀：

- `Vue3-Frontend-Rules.mdc`：Vue 3 / TypeScript、目錄、命名、Router、Props 等
- `API-and-Pinia-Rules.mdc`：API 目錄與寫法、Axios、Composable、Pinia（規範有定義，但目前尚未安裝 `pinia`，需要時再加）
- `SCSS-RWD-and-Git-Rules.mdc`：SCSS、RWD、Breakpoint、CSS 單位、圖片

重點摘要：

- 新增 Element Plus 元件無需手動 import（已設定自動引入）。
- 路徑別名 `@` 指向 `src/`。
- SCSS 已自動注入 `@/styles/_mixins.scss`，可直接使用 mixin。
- 縮排為 4 個空格（見 `.prettierrc`）。
- 不導入 TailwindCSS。

## Git 工作流程

- `main`：穩定版本
- `develop`：整合分支
- `feat/*`：功能分支（例如 `feat/texas`、`feat/player-tag`），完成後合併回 `develop`

Commit 訊息採 Conventional Commits，例如：

```text
feat(texas): 新增德州撲克分析頁與 mock API
refactor(table): 抽離共用資料表格與排序分頁邏輯
style(ui): 新增全域深色 scrollbar 樣式
```

## 部署

- 打包輸出至 `dist/`。
- `public/_redirects` 已設定 `/* /index.html 200`，用於 SPA 路由 fallback（如 Netlify）。
- 若要部署到沒有後端的展示環境，需保持 `VITE_USE_MSW=true`，並確認 `.env.production` 有對應設定（目前專案只有 `.env.development`）。

## Repository

<https://github.com/wenkai0505/vue3PlayerCms>
