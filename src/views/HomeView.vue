<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="p-8 max-w-2xl">
    <h1 class="text-xl font-semibold pb-6">Steam Design Tools</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <RouterLink
        to="/lookup"
        class="block rounded-lg border border-border p-5 hover:bg-accent transition-colors"
      >
        <h2 class="font-medium mb-1">Lookup Background</h2>
        <p class="text-sm text-muted-foreground">查詢 Steam 用戶的個人頁面背景圖</p>
      </RouterLink>
      <RouterLink
        to="/crop"
        class="block rounded-lg border border-border p-5 hover:bg-accent transition-colors"
      >
        <h2 class="font-medium mb-1">Crop Images</h2>
        <p class="text-sm text-muted-foreground">裁切圖片工具</p>
      </RouterLink>
    </div>
  </div>
</template>
