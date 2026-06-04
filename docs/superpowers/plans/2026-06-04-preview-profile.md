# PreviewProfile Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `PreviewProfile.vue` — a component that renders a faithful Steam profile page preview (background + SVG panel overlay) given a `Profile` object.

**Architecture:** A single self-contained Vue 3 component accepting a `Profile` prop. It renders a `.profile__preview` wrapper with an inline `background-image` style, an absolutely-positioned background layer (video if animated, nothing if static), and a 976px SVG overlay container that mimics the Steam profile UI chrome. CSS Modules handle all scoped styles.

**Tech Stack:** Vue 3 (Composition API, `<script setup>`), TypeScript, CSS Modules (`<style module>`)

---

### Task 1: Create `PreviewProfile.vue` component file

**Files:**
- Create: `src/components/PreviewProfile.vue`

- [ ] **Step 1: Create the component with props, template, and CSS Modules**

Create `src/components/PreviewProfile.vue` with this exact content:

```vue
<script setup lang="ts">
interface Profile {
  background: string | null
  animatedBackground?: { webm: string; mp4: string }
}

const props = defineProps<{ profile: Profile }>()
</script>

<template>
  <div
    v-if="profile.background"
    :class="$style.preview"
    :style="{
      backgroundImage: `url('${profile.background}')`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '49.999% 0px',
    }"
  >
    <div :class="$style.previewBg">
      <video
        v-if="profile.animatedBackground"
        :poster="profile.background"
        autoplay
        loop
        muted
        playsinline
        style="width: 1920px; height: 1080px"
      >
        <source :src="profile.animatedBackground.webm" type="video/webm" />
        <source :src="profile.animatedBackground.mp4" type="video/mp4" />
      </video>
    </div>
    <div :class="$style.previewContainer">
      <svg
        width="976"
        height="1170"
        viewBox="0 0 976 1170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0h976v1165a5 5 0 01-5 5H5a5 5 0 01-5-5V0zm28 256a5 5 0 00-5 5v804a5 5 0 005 5h496a5 5 0 005-5V261a5 5 0 00-5-5H29zm510 5a5 5 0 015-5h90a5 5 0 015 5v804a5 5 0 01-5 5h-90a5 5 0 01-5-5V272zM29 30a5 5 0 00-5 5v154a5 5 0 005 5h154a5 5 0 005-5V35a5 5 0 00-5-5H29z"
          fill="#12151a"
          opacity="0.5"
        />
      </svg>
    </div>
  </div>
</template>

<style module>
.preview {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.previewBg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: -1;
}

.previewContainer {
  width: 976px;
  margin: 0 auto;
  min-height: 1080px;
}
</style>
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

Run: `bun run type-check`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/PreviewProfile.vue
git commit -m "feat: add PreviewProfile component with CSS Modules"
```

---

### Task 2: Wire `PreviewProfile` into `HomeView.vue`

**Files:**
- Modify: `src/views/HomeView.vue`

- [ ] **Step 1: Import and register the component**

In `src/views/HomeView.vue`, add the import after the existing imports at the top of `<script setup>`:

```ts
import PreviewProfile from '@/components/PreviewProfile.vue'
```

- [ ] **Step 2: Replace the current result block with `PreviewProfile`**

Find this block in the template:

```html
    <div v-if="profile" class="result">
      <p v-if="!profile.background" class="no-bg">此用戶沒有設定背景</p>
      <template v-else>
        <video
          v-if="profile.animatedBackground"
          :poster="profile.background"
          autoplay loop muted playsinline
        >
          <source :src="profile.animatedBackground.webm" type="video/webm" />
          <source :src="profile.animatedBackground.mp4" type="video/mp4" />
        </video>
        <img v-else :src="profile.background" alt="profile background" />
      </template>
    </div>
```

Replace it with:

```html
    <p v-if="profile && !profile.background" class="no-bg">此用戶沒有設定背景</p>
    <PreviewProfile v-else-if="profile" :profile="profile" />
```

- [ ] **Step 3: Remove now-unused `.result` style**

In the `<style scoped>` block, remove:

```css
.result { margin-top: 1.5rem; }
.result img,
.result video {
  width: 100%;
  border-radius: 4px;
}
```

- [ ] **Step 4: Verify TypeScript compiles cleanly**

Run: `bun run type-check`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/views/HomeView.vue
git commit -m "feat: use PreviewProfile in HomeView"
```
