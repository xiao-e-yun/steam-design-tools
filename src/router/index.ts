import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const routes = [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/crop',
      name: 'crop',
      title: 'Crop Images',
      description: 'Crop images for Steam showcases',
      component: () => import('../views/CropView.vue'),
    },
    {
      path: '/lookup',
      name: 'lookup',
      title: 'Lookup Background',
      description: 'Look up a Steam user\'s profile background image',
      component: () => import('../views/LookupView.vue'),
    },
    {
      path: '/guides',
      name: 'guides',
      title: 'Upload Guides',
      description: 'How to upload long images to Steam',
      component: () => import('../views/GuidesView.vue'),
    },
  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
