import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoadMonitor from '../views/LoadMonitor.vue'
import AbnormalDetection from '../views/AbnormalDetection.vue'
import AbnormalPrediction from '../views/AbnormalPrediction.vue'

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
    },
    {
      path: '/abnormal-detection',
      name: 'abnormalDetection',
      component: AbnormalDetection
    },
    {
      path: '/abnormal-prediction',
      name: 'abnormalPrediction',
      component: AbnormalPrediction
    }
  ]
})

export default router
