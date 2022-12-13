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
  login: '/login',
  register: '/register',
  weatherQuery: '/weatherQuery', // 天气查询
  tensorflowMaxTemp: 'tensorflowMaxTemp',
  tensorflowMinTemp: 'tensorflowMinTemp',
}