import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

export default {
  login: '/login',
  tensorflowMaxTemp: 'tensorflowMaxTemp',
  tensorflowMinTemp: 'tensorflowMinTemp',
}