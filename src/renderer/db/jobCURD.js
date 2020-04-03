import { job } from './datastore'
import {
    Message
} from 'element-ui'

export function add(data) {
    return new Promise((resolve, reject) => {
        job.insert(data, function (err, res) {
            if (err) {
                Message({
                    message: "job insert error",
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
        job.remove({ _id: data._id }, function (err, res) {
            if (err) {
                Message({
                    message: "job remove error",
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
        job.update({ _id: old_data._id }, { $set: new_data }, { multi: true }, function (err, res) {
            if (err) {
                Message({
                    message: "job update error",
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


export function find(data) {
    return new Promise((resolve, reject) => {
        job.find(data, function (err, res) {
            if (err) {
                Message({
                    message: "job find error",
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
        job.findOne(data, function (err, res) {
            if (err) {
                Message({
                    message: "job findOne error",
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