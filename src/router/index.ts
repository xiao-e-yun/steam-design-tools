import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const routes = [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/lookup',
      name: 'lookup',
      title: 'Lookup Background',
      description: '查詢 Steam 用戶的個人頁面背景圖',
      component: () => import('../views/LookupView.vue'),
    },
    {
      path: '/crop',
      name: 'crop',
      title: 'Crop Images',
      description: '裁切圖片工具',
      component: () => import('../views/CropView.vue'),
    },
  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
