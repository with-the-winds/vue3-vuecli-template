<!--
 * @Date: 2023-06-19 14:42:07
 * @LastEditors: zhubj
 * @LastEditTime: 2023-06-19 15:25:06
 * @Description: 头部注释
 * @FilePath: \own-vue3-vuecli-template\src\views\login\index.vue
-->
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