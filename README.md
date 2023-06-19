# own-vue3-vuecli-template

## 前言

本项目是通过 vue-cli 创建的 vue3 项目。基本的创建思路都是基于 [ruoyi框架](http://120.79.202.7/) 的项目。

那为什么不直接使用该项目呢？是因为我觉得该项目的模板过于庞大（虽然不需要的可以直接删除，但是觉得有点麻烦）所以自己仿照着写一个模板（自己写的也更有利于自己修改和使用）。

## 环境

**node：** v16.16.0

**npm：** npm@8.11.0


## 涉及插件

状态管理工具：Vuex

样式预处理器：sass

组件库：element-plus

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 注意点

1.对于安装的 element-plus 实现了自动按需引入，请勿全局使用，可参考 [element-plus](https://element-plus.org/zh-CN/guide/quickstart.html#%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5) 官方网站。
