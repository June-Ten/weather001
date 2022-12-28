import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/HomeView.vue'

const routes = [
  {
    path: '/login', // 登录页
    component: () => import('../components/Login.vue'),
  },
  {
    path: '/register', // 注册页
    component: () => import('../components/Register.vue'),
  },
  {
    path: '/',
    redirect: '/home/weather-query',
  },
  {
    path: '/home', // 主界面
    component: Home,
    children: [
      {
        path: 'weather-query', // 天气查询table
        component: () =>
          import('../components/homeChildren/WeatherQuery/index.vue'),
      },
      {
        path: 'weather-statistic-analysis', // 天气状况统计
        component: () =>
          import('../components/homeChildren/StatisticsAnalysis/index.vue'),
      },
      {
        path: 'predict-maxTemp',
        component: () =>
          import('../components/homeChildren/tensorflow/PredictMaxTemp.vue'),
      },
      {
        path: 'predict-minTemp',
        component: () =>
          import('../components/homeChildren/tensorflow/PredictMinTemp.vue'),
      },
      {
        path: 'predict-test',
        component: () =>
          import('../components/homeChildren/tensorflow/Test.vue'),
      },
      {
        path: 'predict-last',
        component: () =>
          import('../components/homeChildren/tensorflow/LastResult.vue'),
      },
      {
        path: 'precipitation', // 全国降水量
        component: () => import('../components/homeChildren/precipitation/index.vue'),
      },
      {
        path: 'predict-temp', // 气温预测
        component: () => import('../components/homeChildren/tensorflow/index.vue'),
      },
      {
        path: 'manage-user', // 用户管理
        component: () => import('../components/homeChildren/manageUser/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router
