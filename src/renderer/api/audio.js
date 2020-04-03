import request from '../util/request'
import {
    Service
} from './index'

/**
 * 用户验证
 */
export function Audio() {
    return request({
        url: Service.Audio,
        method: 'POST'
    })
}
