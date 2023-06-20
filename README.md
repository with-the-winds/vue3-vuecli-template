创建一个 vue3 + webpack5 + element-plus 基本模板 （vue3 + webpack5 从零配置项目）。
本项目结构可以作为实战项目的基本结构搭建学习，作为刚学习完vue还没有实战项目经验的小伙伴练习比较合适。

项目地址：

GitHub：[https://github.com/with-the-winds/vue3-vuecli-template](https://github.com/with-the-winds/vue3-vuecli-template)

gitee: [https://gitee.com/with_the_winds/vue3-vuecli-template](https://gitee.com/with_the_winds/vue3-vuecli-template)
# 前言
本项目是通过 vue-cli 创建的 vue3 项目。基本的创建思路都是基于 [ruoyi框架](http://120.79.202.7/) 的项目。其实vue-admin-template 和 ruoyi 框架的都是差不多的，因为这两个项目是只有使用的文档，没有搭建的文档思路，所以我自己这写了下搭建的思路。

那为什么不直接使用该项目呢？是因为我觉得该项目的模板过于庞大（虽然不需要的可以直接删除，但是觉得有点麻烦）所以自己仿照着写一个模板（自己写的也更有利于自己理解和使用）。
# 环境

**node：** v16.16.0

**npm**： v8.11.0

vue3 + webpack5 + vue-router4 + vuex4

# 直接使用
通过 git clone 或者直接下载 zip 包的方式进行下载代码。

```javascript
// gitee 地址
git clone https://gitee.com/with_the_winds/vue3-vuecli-template.git
// github 地址
git clone https://github.com/with-the-winds/vue3-vuecli-template.git
```
# Project setup
```javascript
cd vue3-vuecli-template
npm install
```
### Compiles and hot-reloads for development
```javascript
npm run serve
```
### Compiles and minifies for production
```javascript
npm run build
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
# 搭建过程
搭建过程主要是让初学者知道模板是如何搭建的，并方便查阅信息。
## 一、通过 vue-cli 创建项目
```javascript
vue create own-vue3-vuecli-template
```
安装选项：
选择安装vuex、vue-router、sass，后面默认这些是已经安装，不会再重复安装了。
## 二、创建环境变量
在根目录（own-vue3-vuecli-template文件下）创建 .env.development 和 .env.production 两个文件，用于存放开发环境和生产环境的环境变量值。

.env.development:
```javascript
# 开发环境配置
NODE_ENV = 'development'

# 页面标题
VUE_APP_TITLE = '页面标题'

# 开发环境/重写路径(公共路径)
VUE_APP_BASE_URL = '/dev-api'

# 百度地图KEY
VUE_APP_BAIDU_MAP_KEY = ''

```
.env.production:
```javascript
# 生产环境配置
NODE_ENV = 'production'

# 页面标题
VUE_APP_TITLE = '页面标题'

# 生产环境/重写路径(公共路径)
VUE_APP_BASE_URL = '/prod-api'

# 百度地图KEY
VUE_APP_BAIDU_MAP_KEY = ''
```
后面自己要调整的地方自己修改。
## 三、安装 element-plus 
也可以使用别的组件库，这里使用 element-plus。
```javascript
npm install element-plus --save
```
安装完成后这边不进行全局引用，使用按需引入的自动导入方式，这时候需要安装 `unplugin-vue-components` 和 `unplugin-auto-import`这两款插件。
```javascript
npm install -D unplugin-vue-components unplugin-auto-import
```
然后把下列代码插入到Webpack 的配置文件中：
vue.config.js：
```javascript
const { defineConfig } = require('@vue/cli-service')

const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  // 和webpapck属性完全一致，最后会进行合并
  configureWebpack:{
    //配置webpack自动按需引入element-plus
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  }
})
```
**示例：**
HomeView.vue:
```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <el-button type="success">按钮</el-button>
  </div>
</template>
```
![image.png](https://gitee.com/with_the_winds/images/raw/master/vue3-vuecli-template/20230620-001.png)
可以看到在没有引入 element-plus ，已经可以正常使用了。
## 四、安装 axios
### 1.安装 axios 实现网络请求
```javascript
npm install axios --save
```
### 2.封装 axios
在 src 目录下创建一个 utils文件夹，用于存放常用的 js 工具文件。并在 utils 文件夹下新建一个 request.js 文件。
#### 2.1 先创建 axios 的基本结构
request.js：
```javascript
import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
  // 请求之前要处理的地方
  
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 响应成功返回要处理的地方

  return res
  },
  error => {
    // 响应失败要处理的地方
    console.log('err' + error)
    let { message } = error;

    return Promise.reject(error)
  }
)

export default service
```
#### 2.2 安装和封装 js-cookie
登录的时候一般都是需要 token 验证的，所以需要使用 cookie 存放 token，当然也可以存放在 localStorage 或 sessionStorage 中（一般还是在cookie中）。
安装：
```javascript
npm install js-cookie --save
```
封装：
在 utils 文件夹下创建一个 auth.js 文件，并复制如下代码：
auth.js：
```javascript
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

```
#### 2.3 完善 axios 的结构
对于 request.js 进行完善，使封装的 axios 功能更加丰富。实现的功能：

1.请求时设置 token 的可选项，因为有的接口不一定要用 token；

2.请求报错；

3.响应成功返回和响应报错（响应返回的code根据实际项目和后端对接）。


在 utils 文件夹下创建 errorCode.js 文件，用于存放响应返回错误 code 的消息值（根据实际项目）。
errorCode.js：
```javascript
export default {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  'default': '系统未知错误，请反馈给管理员'
}

```
完善 request.js 文件。
request.js：
```javascript
import axios from 'axios'
import { getToken } from './auth'
import errorCode from './errorCode'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';

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
          // 调用退出登录接口...
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

```
可以从上面看到，在网络请求的时候如果返回401时，做了重新登录的提示，这边的退出登陆接口会通过状态管理store退出登录，因为store这边还没有实际写，所以暂时空留位置，后面会补充进去。

## 五、使用封装的 request.js 创建 api
上述的 axios 到现在已经封装完成，然后现在应该创建一个接口，看如何使用封装的 axios。

在 src 文件夹下创建一个 api 文件夹，然后在 api 文件夹下创建一个 login.js 文件，用于存放登录等相关接口。

login.js：
```javascript
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
```
这样就可以在别的页面上进行使用接口了。
## 六、配置vue.config.js
对于创建的接口如果运行在开发环境中，那么需要设置下代理服务器 devServer，生产环境一般用nginx配置就可以了，所以在 vue.config.js 文件下配置下代理服务器，顺便再配置下别的选项。

对于vue中webpack的默认配置和相关配置信息可以阅读下这篇文章 [https://juejin.cn/post/6886698055685373965#heading-3](https://juejin.cn/post/6886698055685373965#heading-3) 和 官方文档一起配合食用更佳！！！

安装下 `compression-webpack-plugin `插件用于 gzip 压缩打包。
```javascript
npm install compression-webpack-plugin --save-dev
```
完整配置如下（包含了gzip插件的配置和代理服务器的配置）：

vue.config.js：
```javascript
'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const { defineConfig } = require('@vue/cli-service')

const name = process.env.VUE_APP_TITLE || '网页标题' // 网页标题

const port = process.env.port || process.env.npm_config_port || 8080 // 端口

// element-plus 按需导入自动导入的插件
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
// 实现 gzip 压缩打包
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = defineConfig({
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径
  // 例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。注意目标目录的内容在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'static',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖（对所有的依赖都进行转译可能会降低构建速度）
  transpileDependencies: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:8088`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  // 和webpapck属性完全一致，最后会进行合并
  configureWebpack:{
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    //配置webpack自动按需引入element-plus
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
      new CompressionPlugin({
        test: /\.(js|css|html)?$/i,     // 压缩文件格式
        filename: '[path][base].gz',   // 压缩后的文件名
        algorithm: 'gzip',              // 使用gzip压缩
        threshold: 10240,               // 最小文件开启压缩
        minRatio: 0.8                   // 压缩率小于1才会压缩
      })
    ],
  }
})

```
## 七、搭建 store
对状态管理进行模块化，一般像 vue-admin-template 、ruoyi-vue 这些模板都会添加移动端设备的判断但是我不太会所以这边就不添加了。
### 创建 modules 文件夹
在 store 文件夹下创建 modules 文件夹用于存放模块。然后在 modules 文件夹下再创建一个 user.js 文件，用于存放用户的相关信息。
### 实现 user.js 模块
该文件实现的思路：

1.存放用户登录后的相关信息（一般来说存放token、角色信息、按钮的权限信息，具体还是根据实际项目来）；

2.退出登录时清空用户的相关信息。

user.js：
```javascript
import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    name: '',
    roles: [],
    permissions: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.user
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
```
### 引入 user.js 模块
在 store 文件夹下的 index.js 文件中引入 user.js 文件。

index.js：
```javascript
import { createStore } from 'vuex'
import user from './modules/user'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user
  }
})

```
### 处理 request.js 遗留的退出登录的功能
在 request.js 文件中，之前有个 401 状态码调用退出登录接口的功能没有实现，现在补充完整。

引入 store 文件：
```javascript
import store from '@/store';
```
添加退出登录接口：
```javascript
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
```
## 八、添加 permission.js
在 src 文件夹下创建 permission.js 文件：

该文件的作用主要是通过路由导航守卫，实现路由的控制：

1.当 token 消失后不能跳转别的页面，要返回登录页面；

2.点击登录之后不能通过回退按钮返回到登录页面（这个不是必须的看具体实现，另外三条是必须必须的）；

3.点击退出登录后会自动跳转到登录页面，同样不能越过登录通过回退按钮进入到其他页面；

4.由于页面刷新会重置store，所以要实现vuex的持久化（当然对于vuex的持久化是有插件的，我这边是没有使用）。

安装插件`nprogress`用于控制进度条的显示：
```javascript
npm i nprogress -S
```
 permission.js：
```javascript
import NProgress from "nprogress";
import 'nprogress/nprogress.css'
import router from "./router";
import store from "./store";
import { ElMessage } from "element-plus";
import { getToken } from "./utils/auth";
import { isRelogin } from "./utils/request";

NProgress.configure({ showSpinner: false }) // 关闭加载微调器

const whiteList = ['/login'] // 设置白名单，用于任何人可访问

// 钩子函数
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // to.meta.title && store.dispatch('settings/setTitle', to.meta.title) // 用于设置title
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
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
              next({ path: '/' })
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
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
```
目前页面重定向的页面都是登录页面，所以现在修改路由配置。

注意：这里我注释了两个地方，一个是生成路由的部分，还有一个是设置页面 title 的部分。对于生成路由的部分就是用来动态生成路由，而不是把页面的路由都静态放在 router.js 页面中，由后端接口传递过来（这部分请根据实际项目接口写）。

创建完成之后引入到 main.js 文件，用于实现控制页面的权限。

main.js：
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './permission' // permission control

createApp(App).use(store).use(router).mount('#app')
```
## 九、搭建路由页面
页面分为公共页面和动态加载的页面，公共页面一般包含登录页面和404页面。
### 创建登录页面
把原本的 AboutView.vue 文件 和 HomeView.vue 文件删除。注意把 APP.vue 文件中的链接去掉，只留下<router-view/>。然后在 views 文件夹下面创建一个 login 文件夹，在 login 文件夹下面创建一个 index.vue 文件。

login/index.vue：
```javascript
<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" size="small" class="login-form">
      <title>登录表单</title>
      <el-form-item prop="username" label="账号：">
        <el-input 
          v-model="loginForm.username" 
          type="text" 
          placeholder="账号">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码：">
        <el-input 
          v-model="loginForm.password" 
          type="password" 
          placeholder="密码" 
          @keyup.enter="handleLogin">
        </el-input>
      </el-form-item>
      <el-form-item style="width: 100%;">
        <el-button 
          :loading="loading" 
          type="primary" 
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登录</span>
          <span v-else>登 录 中 ...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import store from '@/store'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }]
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginRef.validate(valid => {
        if (valid) {
          this.loading = true
          store.dispatch('user/Login', this.loginForm).then(() => {
            this.$router.push({ path: '/home' })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
```
这里没有写样式，只是简单搭建下页面，让功能能运行就行。
### 创建 404 页面
在 view 文件夹下创建 error 文件夹，在error 文件夹下创建 404.vue 文件。
这里有用到两个404的图片，分别在 assets/images/base 文件夹下面。

error/404.vue：
```javascript
<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/images/base/404.png" alt="404">
        <img class="pic-404__child left" src="@/assets/images/base/404_cloud.png" alt="404">
        <img class="pic-404__child mid" src="@/assets/images/base/404_cloud.png" alt="404">
        <img class="pic-404__child right" src="@/assets/images/base/404_cloud.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">
          404错误!
        </div>
        <div class="bullshit__headline">
          {{ message }}
        </div>
        <div class="bullshit__info">
          对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
        </div>
        <router-link to="/" class="bullshit__return-home">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return '找不到网页！'
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container{
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.wscn-http404 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden;
    &__parent {
      width: 100%;
    }
    &__child {
      position: absolute;
      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }
      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }
        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }
        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }
        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }
        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }
        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }
        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }
        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }
        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }
        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>

```
### 重写 router 文件
router/index.vue：
```javascript
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

```
注意：对于 404 页面一定要放在最后面，这里由于是静态路由所以我直接放在这边，正确的方式应该是通过动态路由添加路由完成之后，最后再添加 path: '/:catchAll(.*)' 这个路由页面。这是因为 vue 匹配路由的规则是一个个遍历过去，如果把这个 path 放在中间，那么后面的路由页面就不会被匹配到了，会直接去到404页面。

注意：这个时候记得在 permission.js 文件的白名单中添加 '/404' 路径，不然会被重定向（要明白peimission.js的作用）。

permission.js：
```javascript
const whiteList = ['/login','/404'] // 设置白名单，用于任何人可访问
```
## 十、添加 Layout 页面
这个步骤请根据实际项目来写，因为我这里后台项目写的多，所以基本登录页面进入后就是左边导航栏或者上面导航栏，然后内容显示在导航栏的右边或下面。
在 src 文件夹下创建 layout 文件夹，然后在 layout 文件夹下创建一个index.vue文件。这个文件就作为登录成功后的入口页面。

layout/index.vue：
```javascript
<template>
  <div class="app-wrapper">
    <div class="sidebar"></div>
    <div class="app-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.sidebar {
  width: 200px;
  height: 100%;
  background-color: red;
  position: absolute;
  top: 0;
  left: 0;
}
.app-main {
  width: calc(100% - 200px);
  height: 100%;
  background-color: rgb(68, 150, 222);
  position: absolute;
  top: 0;
  left: 200px;
}
</style>
```
这里分为了左右布局，简单的用红色表示侧边栏，蓝色表示内容区域。现在基本结构就这样搭建好了，如果需要添加别的功能就可以不断添加，比如侧边栏的组件封装。

现在在 views 文件夹下创建一个 home文件夹，然后在 home 文件夹下创建一个 index.vue 文件。该文件用来测试刚刚创建的侧边栏和内容区域是否可行。

home/index.vue：
```javascript
<template>
  <div>
    <h1>这是 Home 页面</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  }
}
</script>
```
注意：修改下APP.vue 的样式，不然当前html没有高度：

APP.vue：
```vue
<style lang="scss">
html {
  width: 100%;
  height: 100%;
}
body {
  margin: 0;
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
</style>
```
添加路由：
在 router 文件夹下的index.js文件配置刚刚新增的home页面：

router/index.js：
```javascript
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

```
注意：不要忘记在 permission.js 文件中添加白名单，不然权限无法访问新增的页面，因为现在没有实际的登录接口，所以一直会被重定向。

permission.js：
```javascript
const whiteList = ['/login','/404','/layout', '/home'] // 设置白名单，用于任何人可访问
```
效果：
![image.png](https://gitee.com/with_the_winds/images/raw/master/vue3-vuecli-template/20230620-002.png)
这样基本的项目结构就全部完成了，实际项目开发的时候记得把白名单的页面设置成自己想要的页面。

上面搭建的步骤中动态路由获取的内容没有添加，一般就是放在获取用户信息接口后面，然后通过 addRoute() 方法添加到路由上面。
# 结尾
项目到这里基本就已经结束了，后面应该会根据自己的实际项目，添加一些功能，比如权限获取、侧边栏的封装、防重复请求等等，但是应该是不会更新在文档上了（有机会的话会写在后面的**补充**上面），所以搭建文档和实际拉取下来的项目可能有点出入。
# 补充

