import { user } from './datastore'
import {
    Message
} from 'element-ui'

export function add(data) {
    return new Promise((resolve, reject) => {
        user.insert(data, function (err, res) {
            if (err) {
                Message({
                    message: "user insert error",
                    type: 'error',
                    duration: 5 * 1000
                })
                reject(err)
                return
            }
            resolve(res)
        })
    })
}

export function remove(data) {
    return new Promise((resolve, reject) => {
        user.remove({ _id: data._id }, function (err, res) {
            if (err) {
                Message({
                    message: "user remove error",
                    type: 'error',
                    duration: 5 * 1000
                })
                reject(err)
                return
            }
            resolve(res)
        })
    })
}

export function update(old_data, new_data) {
    return new Promise((resolve, reject) => {
        user.update({ _id: old_data._id }, { $set: new_data }, { multi: true }, function (err, res) {
            if (err) {
                Message({
                    message: "user update error",
                    type: 'error',
                    duration: 5 * 1000
                })
                reject(err)
                return
            }
            console.log("成功", res)

            resolve(res)
        })
    })
}


export function find(data) {

    console.log(user)

    return new Promise((resolve, reject) => {
        user.find(data, function (err, res) {
            if (err) {
                Message({
                    message: "user find error",
                    type: 'error',
                    duration: 5 * 1000
                })
                reject(err)
                return
            }
            resolve(res)
        })
    })
}

export function findOne(data) {
    return new Promise((resolve, reject) => {
        user.findOne(data, function (err, res) {
            if (err) {
                Message({
                    message: "user findOne error",
                    type: 'error',
                    duration: 5 * 1000
                })
                reject(err)
                return
            }
            resolve(res)
        })
    })
}