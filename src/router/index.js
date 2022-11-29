import { createRouter,createWebHistory } from 'vue-router'

import Home from '../components/HomeView.vue'

const routes = [
  {
    path: '/login',
    component: ()=>import('../components/Login.vue')
  },
  {
    path: '/',
    redirect: '/home/weather-query'
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: 'weather-query',
        component: ()=>import('../components/homeChildren/WeatherQuery/WeatherQuery.vue')
      },
      {
        path: 'weather-statistic-analysis',
        component: ()=>import('../components/homeChildren/StatisticsAnalysis/StatisticsAnalysis.vue')
      },
      {
        path: 'predict-maxTemp',
        component: ()=>import('../components/homeChildren/tensorflow/PredictMaxTemp.vue')
      },
      {
        path: 'predict-minTemp',
        component: ()=>import('../components/homeChildren/tensorflow/PredictMinTemp.vue')
      },
      {
        path: 'predict-test',
        component:  ()=>import('../components/homeChildren/tensorflow/Test.vue')
      },
      {
        path: 'predict-last',
        component:  ()=>import('../components/homeChildren/tensorflow/LastResult.vue')
      },
    ]
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router;