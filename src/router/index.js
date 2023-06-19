/*
 * @Date: 2023-06-18 10:09:15
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-19 17:01:11
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\src\router\index.js
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/layout',
    name: 'Layout',
    component: () => import('../layout/index.vue'),
    redirect: '/home',
    children: [{
      path: '/home',
      name: 'Home',
      component: () => import('../views/home/index.vue')
    }]
  },
  {
    path: '/404',
    component: () => import('../views/error/404.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
