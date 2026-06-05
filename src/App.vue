<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { Moon, Sun, Github, ArrowLeft } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'
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
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()

const navItems = [
  { label: 'Crop Images', to: '/crop' },
  { label: 'Lookup Background', to: '/lookup' },
]
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader class="px-4 py-3 flex-row items-center justify-between">
        <RouterLink to="/" class="text-base font-bold tracking-wide hover:opacity-80 transition-opacity">Steam Tools</RouterLink>
        <RouterLink v-if="route.path !== '/'" to="/" class="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft class="size-4" />
        </RouterLink>
      </SidebarHeader>

      <SidebarContent class="px-2">
        <SidebarMenu class="gap-1">
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

      <SidebarFooter class="px-3 py-3">
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
      <header class="flex md:hidden items-center justify-between px-4 py-3 border-b border-border">
        <RouterLink to="/" class="text-base font-bold tracking-wide hover:opacity-80 transition-opacity">Steam Tools</RouterLink>
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
