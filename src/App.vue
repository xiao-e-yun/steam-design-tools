<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun, Github } from 'lucide-vue-next'
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
      <SidebarHeader class="px-4 py-5 flex-row items-center justify-between">
        <span class="text-base font-black tracking-tight">Steam Tools</span>
        <a href="https://github.com/xiao-e-yun/steam-design-tools" target="_blank" rel="noopener" class="text-muted-foreground hover:text-foreground transition-colors">
          <Github class="size-4" />
        </a>
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

      <SidebarFooter class="px-3 py-3">
        <Separator class="mb-2" />
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
