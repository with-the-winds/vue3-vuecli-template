/*
 * @Date: 2023-06-19 13:38:07
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-20 10:40:37
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\src\permission.js
 */
import NProgress from "nprogress";
import 'nprogress/nprogress.css'
import router from "./router";
import store from "./store";
import { ElMessage } from "element-plus";
import { getToken } from "./utils/auth";
import { isRelogin } from "./utils/request";

NProgress.configure({ showSpinner: false }) // 关闭加载微调器

const whiteList = ['/login','/404','/layout', '/home'] // 设置白名单，用于任何人可访问

// 钩子函数
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // to.meta.title && store.dispatch('settings/setTitle', to.meta.title) // 用于设置title
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/home' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(() => {
          isRelogin.show = false
          // 用于生成路由
          // store.dispatch('GenerateRoutes').then(accessRoutes => {
          //   // 根据roles权限生成可访问的路由表
          //   router.addRoutes(accessRoutes) // 动态添加可访问路由表
          //   next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          // })
        }).catch(err => {
            store.dispatch('LogOut').then(() => {
              ElMessage({ type: 'error', message: err })
              next({ path: '/login' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})