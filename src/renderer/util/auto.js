import { Login } from "../api/auth"
import { findOne, update, add } from "../db/userCURD"

import {
    Message
} from 'element-ui'

export function getToken() {
    return localStorage.getItem('access_token')
}

export function setToken(token) {
    localStorage.setItem('access_token', token)
}

export function getTokenExpiresTime() {
    return localStorage.getItem('expires_at')
}

export function setTokenExpiresTime(expires_at) {
    localStorage.setItem('expires_at', expires_at)
}

export function getItem(key) {
    return localStorage.getItem(key)
}

export function setItem(key, value) {
    localStorage.setItem(key, value)
}


export function checkLogin() {
    //判断登陆是否过期
    let token = getToken();
    let token_ok = false;
    if (token) {
        let expires_time = getTokenExpiresTime();
        if (expires_time) {
            expires_time = Number(expires_time);
            if (expires_time - new Date().getTime() > 0) {
                token_ok = true;
            }
        } else {
            console.log("没有过期时间");
        }
    }
    if (!token_ok) {
        Login().then(res => {

            if (res.access_token) {
                setTokenFromData(res)
            } else {
                //获取失败
                Message({
                    message: "获取token失败",
                    type: 'error',
                    duration: 5 * 1000
                })
            }
            console.log(res);
        });
    }
}

function setTokenFromData(res) {
    setToken(res.access_token)
    setTokenExpiresTime(new Date().getTime() + res.expires_in)
    setItem("refresh_token", res.access_token)
    setItem("scope", res.scope)
    setItem("session_key", res.session_key)
    setItem("session_secret", res.session_secret)
}


export function checkLoginDB() {
    //判断登陆是否过期
    findOne({}).then(res => {
        console.log("user info :", res)
        let token_ok = false;
        let has_token = res
        if (has_token) {
            let token = res.access_token;
            if (token) {
                let expires_in = res.expires_in;
                if (expires_in) {
                    expires_in = Number(expires_in);
                    if (expires_in - new Date().getTime() > 0) {
                        token_ok = true;
                        console.info("token时间还没有过期");
                    } else {
                        console.info("token时间已经过期，需要重新获取");
                    }
                }
            }
        }
        if (!token_ok) {
            Login().then(new_res => {
                if (new_res.access_token) {
                    setTokenFromData(new_res)
                    new_res.expires_in = new Date().getTime() + new_res.expires_in
                    if (has_token) {
                        //更新
                        update({ _id: res._id }, new_res)
                    } else {
                        //插入
                        add(new_res)
                    }
                } else {
                    //获取失败
                    Message({
                        message: "获取token失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            });
        } else {
            setTokenFromData(res)
        }

    })

}