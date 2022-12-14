import { createRouter,createWebHistory } from 'vue-router'

import Home from '../components/HomeView.vue'

const routes = [
  {
    path: '/login', // 登录页
    component: ()=>import('../components/Login.vue')
  },
  {
    path: '/register', // 注册页
    component: ()=>import('../components/Register.vue')
  },
  {
    path: '/',
    redirect: '/home/weather-query'
  },
  {
    path: '/home', // 主界面
    component: Home,
    children: [
      {
        path: 'weather-query',
        component: ()=>import('../components/homeChildren/WeatherQuery/WeatherQuery.vue')
      },
      {
        path: 'weather-statistic-analysis',
        component: ()=>import('../components/homeChildren/StatisticsAnalysis/index.vue')
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
      {
        path: 'all',
        component:  ()=>import('../components/homeChildren/all/All.vue')
      },
    ]
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router;