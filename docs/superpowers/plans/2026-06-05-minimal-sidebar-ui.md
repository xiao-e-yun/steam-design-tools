# Minimal Sidebar UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all raw-HTML styling with shadcn-vue components and add a fixed sidebar layout with dark mode toggle and GitHub link across all pages.

**Architecture:** `App.vue` becomes a sidebar shell using shadcn-vue Sidebar primitives; `HomeView` and `CropView` are refactored to use shadcn-vue Input/Button/Select/Label; a `useDark` composable handles dark mode via `.dark` class on `<html>`; `AboutView` is deleted.

**Tech Stack:** Vue 3, TypeScript, shadcn-vue (reka-nova), Tailwind v4, VueUse (`useDark`/`useToggle`), lucide-vue-next

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/App.vue` | Sidebar shell layout |
| Modify | `src/assets/main.css` | Remove old layout overrides |
| Modify | `src/router/index.ts` | Remove About route |
| Delete | `src/views/AboutView.vue` | No longer needed |
| Modify | `src/views/HomeView.vue` | shadcn-vue form components |
| Modify | `src/views/CropView.vue` | shadcn-vue form components |
| Create | `src/components/ui/sidebar.vue` | (installed via CLI) |
| Create | `src/components/ui/button.vue` | (installed via CLI) |
| Create | `src/components/ui/input.vue` | (installed via CLI) |
| Create | `src/components/ui/label.vue` | (installed via CLI) |
| Create | `src/components/ui/select.vue` | (installed via CLI) |
| Create | `src/components/ui/separator.vue` | (installed via CLI) |

---

### Task 1: Install shadcn-vue components

**Files:**
- Creates: `src/components/ui/button.vue`, `src/components/ui/input.vue`, `src/components/ui/label.vue`, `src/components/ui/select.vue`, `src/components/ui/separator.vue`, `src/components/ui/sidebar.vue`

- [ ] **Step 1: Install required components**

```bash
bunx shadcn-vue@latest add button input label select separator sidebar
```

Expected: Each component folder created under `src/components/ui/`.

- [ ] **Step 2: Verify components exist**

```bash
ls src/components/ui/
```

Expected: directories for `button`, `input`, `label`, `select`, `separator`, `sidebar` (or single files depending on registry).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/
git commit -m "chore: add shadcn-vue button, input, label, select, separator, sidebar components"
```

---

### Task 2: Remove About route and view

**Files:**
- Modify: `src/router/index.ts`
- Delete: `src/views/AboutView.vue`

- [ ] **Step 1: Remove About route from router**

Edit `src/router/index.ts` — remove the `/about` route entry so the file reads:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/crop',
      name: 'crop',
      component: () => import('../views/CropView.vue'),
    },
  ],
})

export default router
```

- [ ] **Step 2: Delete AboutView**

```bash
rm src/views/AboutView.vue
```

- [ ] **Step 3: Commit**

```bash
git add src/router/index.ts
git rm src/views/AboutView.vue
git commit -m "chore: remove About page and route"
```

---

### Task 3: Clean up main.css layout overrides

**Files:**
- Modify: `src/assets/main.css`

- [ ] **Step 1: Remove old layout rules**

In `src/assets/main.css`, delete these blocks (they conflict with the new sidebar layout):

```css
/* DELETE this entire block */
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}

/* DELETE these blocks */
a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
  padding: 3px;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
}
```

After deletion, the top of the file (after imports) should go directly to the `@theme inline` block. Keep everything from `@theme inline` onward unchanged.

- [ ] **Step 2: Commit**

```bash
git add src/assets/main.css
git commit -m "style: remove legacy layout overrides from main.css"
```

---

### Task 4: Build App.vue sidebar shell

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Check what the sidebar component exports**

```bash
cat src/components/ui/sidebar/index.ts 2>/dev/null || ls src/components/ui/sidebar/
```

Note the exported component names (e.g. `Sidebar`, `SidebarContent`, `SidebarProvider`, etc.) — use them in the next step.

- [ ] **Step 2: Rewrite App.vue**

Replace the entire contents of `src/App.vue` with:

```vue
<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun, Github } from 'lucide-vue-next'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()

const navItems = [
  { label: 'Profile Background', to: '/' },
  { label: 'Crop Tool', to: '/crop' },
]
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader class="px-4 py-5">
        <span class="text-base font-semibold tracking-tight">Steam Tools</span>
      </SidebarHeader>

      <SidebarContent class="px-2">
        <SidebarMenu>
          <SidebarMenuItem v-for="item in navItems" :key="item.to">
            <SidebarMenuButton
              as-child
              :is-active="route.path === item.to"
            >
              <RouterLink :to="item.to">{{ item.label }}</RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter class="px-3 py-3 flex flex-col gap-1">
        <Separator class="mb-2" />
        <Button variant="ghost" size="sm" class="w-full justify-start gap-2" as-child>
          <a href="https://github.com/xiao-e-yun/steam-design-tools" target="_blank" rel="noopener">
            <Github class="size-4" />
            GitHub
          </a>
        </Button>
        <Button variant="ghost" size="sm" class="w-full justify-start gap-2" @click="toggleDark()">
          <Sun v-if="isDark" class="size-4" />
          <Moon v-else class="size-4" />
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </Button>
      </SidebarFooter>
    </Sidebar>

    <SidebarInset>
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
</template>
```

- [ ] **Step 3: Verify dev server starts without errors**

```bash
bun run dev
```

Check browser console for import errors. Fix any missing exports by checking the actual component names in `src/components/ui/sidebar/`.

- [ ] **Step 4: Commit**

```bash
git add src/App.vue
git commit -m "feat: add sidebar shell layout with dark mode toggle and GitHub link"
```

---

### Task 5: Refactor HomeView with shadcn-vue components

**Files:**
- Modify: `src/views/HomeView.vue`

- [ ] **Step 1: Rewrite HomeView.vue**

Replace the entire contents of `src/views/HomeView.vue` with:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import PreviewProfile from '@/components/PreviewProfile.vue'

interface Profile {
  background: string | null
  animatedBackground?: { webm: string; mp4: string }
}

const input = ref('')
const profile = ref<Profile | null>(null)
const error = ref('')
const loading = ref(false)

function parseUrl(raw: string): { name: string } | { id: string } | null {
  const s = raw.trim()
  const idMatch = s.match(/steamcommunity\.com\/profiles\/(\d+)/)
  if (idMatch?.[1]) return { id: idMatch[1] }
  const nameMatch = s.match(/steamcommunity\.com\/id\/([a-zA-Z0-9_-]+)/)
  if (nameMatch?.[1]) return { name: nameMatch[1] }
  return null
}

async function lookup() {
  error.value = ''
  profile.value = null
  const parsed = parseUrl(input.value)
  if (!parsed) {
    profile.value = { background: input.value.trim() }
    return
  }
  loading.value = true
  try {
    const params = 'name' in parsed
      ? `name=${encodeURIComponent(parsed.name)}`
      : `id=${encodeURIComponent(parsed.id)}`
    const res = await fetch(`/api/profile?${params}`)
    const data = await res.json()
    if (!res.ok) { error.value = data.error ?? '發生錯誤'; return }
    profile.value = data
  } catch {
    error.value = '網路錯誤'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-2xl">
    <h1 class="text-xl font-semibold mb-6">Profile Background</h1>

    <form class="flex flex-col gap-4" @submit.prevent="lookup">
      <div class="flex flex-col gap-1.5">
        <Label for="profile-url">Steam Profile URL</Label>
        <div class="flex gap-2">
          <Input
            id="profile-url"
            v-model="input"
            placeholder="https://steamcommunity.com/id/yourname/"
            :disabled="loading"
            class="flex-1"
          />
          <Button type="submit" :disabled="loading">
            {{ loading ? '查詢中…' : '查詢' }}
          </Button>
        </div>
      </div>
    </form>

    <p v-if="error" class="text-destructive text-sm mt-4">{{ error }}</p>
    <p v-if="profile && !profile.background" class="text-muted-foreground text-sm mt-4">此用戶沒有設定背景</p>
    <div v-else-if="profile" class="mt-6">
      <PreviewProfile :profile="profile" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173/` — form should use shadcn-vue Input and Button, no raw `<style scoped>` styles.

- [ ] **Step 3: Commit**

```bash
git add src/views/HomeView.vue
git commit -m "feat: refactor HomeView with shadcn-vue Input, Button, Label"
```

---

### Task 6: Refactor CropView with shadcn-vue components

**Files:**
- Modify: `src/views/CropView.vue`

- [ ] **Step 1: Rewrite CropView.vue**

Replace the entire contents of `src/views/CropView.vue` with:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { buildComposite, sliceCanvas, saveSlices } from '@/utils/crop'
import type { ShowcaseType } from '@/utils/crop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const type = ref<ShowcaseType>(0)
const typeStr = ref('0')
const bgUrl = ref('')
const files = ref<File[]>([])
const trimRight = ref(false)
const dirHandle = ref<FileSystemDirectoryHandle | null>(null)
const status = ref('')
const running = ref(false)

function onTypeChange(val: string) {
  typeStr.value = val
  type.value = Number(val) as ShowcaseType
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  files.value = input.files ? Array.from(input.files) : []
}

async function pickFolder() {
  if (!('showDirectoryPicker' in window)) {
    status.value = '此瀏覽器不支援資料夾選擇，請使用 Chrome 或 Edge'
    return
  }
  try {
    dirHandle.value = await (window as any).showDirectoryPicker({ mode: 'readwrite' })
    status.value = `已選擇資料夾：${dirHandle.value!.name}`
  } catch {
    // user cancelled
  }
}

async function run() {
  if (!files.value.length) { status.value = '請先選擇圖片'; return }
  if (!dirHandle.value) { status.value = '請先選擇輸出資料夾'; return }
  running.value = true
  status.value = ''
  try {
    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i]!
      status.value = `處理中 ${i + 1} / ${files.value.length}：${file.name}`
      const composite = await buildComposite(file as File, type.value, bgUrl.value.trim() || null)
      const slices = sliceCanvas(composite, type.value, file.name, trimRight.value)
      await saveSlices(slices, dirHandle.value!)
    }
    status.value = `完成！共處理 ${files.value.length} 張圖片`
  } catch (err) {
    status.value = `錯誤：${(err as Error).message}`
  } finally {
    running.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-xl flex flex-col gap-6">
    <h1 class="text-xl font-semibold">Steam 展示欄切圖工具</h1>

    <div class="flex flex-col gap-1.5">
      <Label>展示欄類型</Label>
      <Select :model-value="typeStr" @update:model-value="onTypeChange">
        <SelectTrigger class="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">藝術作品展示欄（615px）</SelectItem>
          <SelectItem value="1">精選藝術作品展示欄（630px）</SelectItem>
          <SelectItem value="2">工作坊展示欄（628px）</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="bg-url">背景圖 URL（選填）</Label>
      <Input id="bg-url" v-model="bgUrl" placeholder="https://..." type="url" />
    </div>

    <div v-if="type === 0" class="flex items-center gap-2">
      <input id="trim-right" v-model="trimRight" type="checkbox" class="size-4 rounded border-border" />
      <Label for="trim-right">裁減更多圖片（右側底部額外裁去 70px）</Label>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="file-input">選擇圖片（可多選）</Label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        multiple
        class="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
        @change="onFileChange"
      />
      <p v-if="files.length" class="text-sm text-muted-foreground">已選擇 {{ files.length }} 張圖片</p>
    </div>

    <div class="flex gap-2">
      <Button variant="outline" :disabled="running" @click="pickFolder">選擇輸出資料夾</Button>
      <Button :disabled="running || !files.length || !dirHandle" @click="run">
        {{ running ? '處理中…' : '開始切圖' }}
      </Button>
    </div>

    <p v-if="status" :class="status.startsWith('錯誤') ? 'text-destructive' : 'text-green-500'" class="text-sm">
      {{ status }}
    </p>
  </div>
</template>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173/crop` — all form elements should use shadcn-vue components, dark/light mode toggle should work.

- [ ] **Step 3: Commit**

```bash
git add src/views/CropView.vue
git commit -m "feat: refactor CropView with shadcn-vue Select, Input, Button, Label"
```

---

## Self-Review Notes

- All six tasks cover the full feature scope (sidebar, dark mode, GitHub link, About removal, HomeView refactor, CropView refactor).
- No TBD or placeholder steps — every step includes exact code or commands.
- Type/method consistency: `ShowcaseType`, `buildComposite`, `sliceCanvas`, `saveSlices` are unchanged from original; `typeStr`/`onTypeChange` bridge added for shadcn Select string values.
- Task 4 Step 1 is a defensive check for sidebar export names, as shadcn-vue sidebar registries vary.
- `useDark` from VueUse toggles the `.dark` class on `<html>`, which matches the existing Tailwind v4 dark variant `(&:is(.dark *))` in main.css.
