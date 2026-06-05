<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { routes } from '@/router';
</script>

<template>
  <div class="p-8 max-w-2xl">
    <h1 class="text-xl font-semibold pb-6">Steam Design Tools</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <RouterLink
        v-for="route in routes.filter(r => r.description)"
        :key="route.path" :to="route.path"
        class="block rounded-lg border border-border p-5 hover:bg-accent transition-colors"
      >
        <h2 class="font-medium mb-1">{{ route.title }}</h2>
        <p class="text-sm text-muted-foreground">{{ route.description }}</p>
      </RouterLink>
    </div>
  </div>
</template>
