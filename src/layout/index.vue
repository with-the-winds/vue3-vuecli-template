<!--
 * @Date: 2023-06-19 16:16:21
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-19 16:17:50
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\src\layout\index.vue
-->
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