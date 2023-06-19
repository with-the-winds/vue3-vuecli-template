/*
 * @Date: 2023-06-18 16:51:52
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-18 16:53:05
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\src\utils\auth.js
 */
import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
