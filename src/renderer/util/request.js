import axios from 'axios'
import {
  Message
} from 'element-ui'

import {
  getToken
} from './auto'


const oauth_base_url_dev = ''
const urlQa = 'https://openapi.baidu.com/'
let baseURL = ''
process.env.NODE_ENV === 'development' ? baseURL = oauth_base_url_dev : baseURL = urlQa


const service = axios.create({
  baseURL: baseURL, // api的base_url
  timeout: 50000 // request timeout
})

service.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=utf8'
  let token = getToken()
  if (token) {
    config.headers['Authorization'] = token
    if (config.url.indexOf("?") != -1) {
      config.url += "&tok=" + token
    } else {
      config.url += "?tok=" + token
    }
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

service.interceptors.response.use(response => {
  return response.data
},
  error => {
    console.error('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service