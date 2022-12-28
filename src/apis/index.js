import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.timeout = 15000

axios.interceptors.request.use((config)=> {
  return config
})

axios.interceptors.response.use((res)=> {
  return res.data
})

export default {
  login: '/login', // 登录
  register: '/register', // 注册
  weatherQuery: '/weatherQuery', // 天气查询
  waterNumber: '/waterNumber', // 全国降水量
  weatherTypeStat: '/weatherTypeStat', // 天气分布统计 饼图
  windStat: '/windStat', // 风向统计 水平柱状图
  predictTemp: '/predictTemp', // 气温预测
  manageUser: '/manageUser', // 用户管理
  updateUserStatus: '/updateUserStatus', // 更新用户状态
  deleteUser: '/deleteUser', // 删除用户
  tensorflowMaxTemp: '/tensorflowMaxTemp',
  tensorflowMinTemp: '/tensorflowMinTemp',
}