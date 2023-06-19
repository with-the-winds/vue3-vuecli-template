/*
 * @Date: 2023-06-18 16:29:47
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-19 13:12:11
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\src\utils\request.js
 */
import axios from 'axios'
import { getToken } from './auth'
import errorCode from './errorCode'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import store from '@/store';

// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 3000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token (默认是存在的，只有传值 false 的时候是不需要token)
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer' + getToken() // 让每个请求携带 token 根据实际情况修改
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
      return res.data
    }
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录','系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          isRelogin.show = false;
          store.dispatch('LogOut').then(() => {
            location.href = '/index';
          })
        }).catch(() => {
          isRelogin.show = false
        })
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElNotification({ type: 'error', title: msg})
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    // 响应失败要处理的地方
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({ message: message, type: 'error', duration: 3 * 1000 })
    return Promise.reject(error)
  }
)

export default service
