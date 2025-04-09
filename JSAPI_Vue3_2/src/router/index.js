import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoadMonitor from '../views/LoadMonitor.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/load-monitor',
      name: 'loadMonitor',
      component: LoadMonitor
    }
  ]
})

export default router
