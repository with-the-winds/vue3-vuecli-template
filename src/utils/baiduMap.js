/*
 * @Date: 2023-06-18 11:21:18
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-18 15:15:01
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\src\utils\baiduMap.js
 */
// baiduMap.js

const baiduMapKey = process.env.VUE_APP_BAIDU_MAP_KEY;

export function getBMap () {
  if (!baiduMapKey) {
    return;
  }
  const BMap_URL = `https://api.map.baidu.com/api?v=3.0&ak=${baiduMapKey}&s=1&callback=onBMapCallback`;
  return new Promise((resolve, reject) => {
    // 如果已加载直接返回
    if (typeof BMap !== 'undefined') {
      resolve(BMap)
      return true;
    }

    // 百度地图异步加载回调处理
    window.onBMapCallback = () => {
      console.log('百度地图脚本初始化成功...');
      resolve(BMap)
    }

    // 插入script脚本
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript'
    scriptElement.src = BMap_URL
    document.head.appendChild(scriptElement);
  })
}