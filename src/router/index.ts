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
      path: '/lookup',
      name: 'lookup',
      component: () => import('../views/LookupView.vue'),
    },
    {
      path: '/crop',
      name: 'crop',
      component: () => import('../views/CropView.vue'),
    },
  ],
})

export default router
