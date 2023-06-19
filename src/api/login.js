/*
 * @Date: 2023-06-19 09:02:19
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-19 09:07:37
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\src\api\login.js
 */
import request from '../utils/request.js'

// 登录
export function login(data) {
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}