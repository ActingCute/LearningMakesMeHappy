import request from '../util/request'
import {
  Service
} from './index'

/**
 * 用户验证
 */
export function Login() {
  return request({
    url: Service.Login,
    method: 'POST'
  })
}
