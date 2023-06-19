/*
 * @Date: 2023-06-18 10:09:15
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-19 16:48:14
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\src\main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './permission' // permission control

createApp(App).use(store).use(router).mount('#app')
