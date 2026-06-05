<script setup lang="ts">
import {RouterView, RouterLink, useRoute} from 'vue-router'
import {Moon, Sun, ArrowLeft} from '@lucide/vue'
import {useDark, useToggle} from '@vueuse/core'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()

const navItems = [
  {label: 'Crop Images', to: '/crop'},
  {label: 'Lookup Background', to: '/lookup'},
]
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader class="px-4 py-3 flex-row items-center justify-between">
        <RouterLink to="/" class="text-base font-bold tracking-wide hover:opacity-80 transition-opacity">
          Steam Design Tools
        </RouterLink>
        <RouterLink v-if="route.path !== '/'" to="/"
          class="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft class="size-4" />
        </RouterLink>
      </SidebarHeader>

      <SidebarContent class="px-2">
        <SidebarMenu class="gap-1">
          <SidebarMenuItem v-for="item in navItems" :key="item.to">
            <SidebarMenuButton as-child :is-active="route.path === item.to">
              <RouterLink :to="item.to">{{ item.label }}</RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter class="px-3 py-3">
        <Separator class="mb-2" />
        <Button variant="ghost" size="sm" class="w-full justify-start gap-2" as-child>
          <a href="https://github.com/xiao-e-yun/steam-design-tools" target="_blank" rel="noopener">
            <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
              <path
                d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
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
      <header class="flex md:hidden items-center justify-between px-4 py-3 border-b border-border">
        <RouterLink to="/" class="text-base font-bold tracking-wide hover:opacity-80 transition-opacity">
          Steam Design Tools 
        </RouterLink>
        <div class="flex items-center gap-1">
          <Button variant="ghost" size="icon" @click="toggleDark()">
            <Sun v-if="isDark" class="size-4" />
            <Moon v-else class="size-4" />
          </Button>
          <SidebarTrigger />
        </div>
      </header>
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
</template>
