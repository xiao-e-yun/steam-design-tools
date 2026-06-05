# Layout Rewrite Design

Date: 2026-06-05

## 目標

重寫整體 Layout，將工具頁面改為「左側 Sidebar 放參數輸入、右側放 Preview/輸出」的雙欄結構。

## 架構概覽

```
App.vue
├── SidebarProvider（shadcn-vue）
│   ├── Sidebar（shadcn-vue）← 永遠只顯示導航選單
│   └── SidebarInset
│       └── RouterView
│           ├── HomeView.vue   ← 使用自訂 Sidebar 元件
│           └── CropView.vue  ← 使用自訂 Sidebar 元件
```

## 元件設計

### `src/components/Sidebar.vue`（新建）

工具頁面專用的左側參數面板。

- 頂部有返回按鈕（`RouterLink to="/"`），樣式沿用 `SidebarMenuButton`
- `<slot>` 放各頁面的參數內容
- 固定寬度，與右側主內容區形成雙欄 layout
- import 時以 `Sidebar` 命名使用，覆蓋 shadcn 的 Sidebar 命名

```vue
<!-- 使用方式 -->
<Sidebar>
  <!-- 參數表單 -->
</Sidebar>
<main>
  <!-- Preview / 輸出 -->
</main>
```

### `App.vue`（修改）

- Sidebar 內容保持現有導航選單（navItems），不再根據路由切換
- 移除任何與工具頁面參數相關的邏輯

### `HomeView.vue`（重構）

- 左：`<Sidebar>`（自訂元件）放 Steam Profile URL 輸入 + 查詢按鈕 + 錯誤訊息
- 右：`<PreviewProfile>` 全版顯示
- 邏輯（`input`、`profile`、`error`、`loading`、`lookup()`）保留在 HomeView

### `CropView.vue`（重構）

- 左：`<Sidebar>`（自訂元件）放所有現有參數：
  - 展示欄類型（Select）
  - 背景圖 URL（Input）
  - 裁減選項（checkbox，type=0 時顯示）
  - 選擇圖片（file input）
  - 選擇輸出資料夾（Button）
  - 開始切圖（Button）
  - 狀態訊息
- 右：目前無 preview，留空或顯示狀態提示

## 命名規則

| 來源 | import 名稱 | 用途 |
|------|-------------|------|
| `@/components/Sidebar.vue` | `Sidebar` | 工具頁面左側參數面板 |
| `@/components/ui/sidebar` | `SidebarProvider`, `SidebarInset`, ... | App.vue 全域導航框架 |

工具頁面中只 import 自訂的 `Sidebar`，不 import shadcn 的 sidebar 元件。

## Layout 結構

```
┌─────────────────────────────────────────────────┐
│  App Sidebar（導航）  │  SidebarInset             │
│                       │  ┌──────────┬──────────┐  │
│  • Profile Background │  │ 自訂     │ Preview  │  │
│  • Crop Tool          │  │ Sidebar  │ / 輸出   │  │
│                       │  │（參數）  │          │  │
│                       │  └──────────┴──────────┘  │
└─────────────────────────────────────────────────┘
```

## 不在範圍內

- 新增工具頁面
- 修改 `PreviewProfile.vue` 的視覺設計
- 修改 `src/utils/crop.ts` 的業務邏輯
