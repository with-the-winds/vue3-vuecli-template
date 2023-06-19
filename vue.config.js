/*
 * @Date: 2023-06-18 10:09:15
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-19 10:49:41
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\vue.config.js
 */
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
