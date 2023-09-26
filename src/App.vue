<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
// 获取路由参数
const route = useRoute()
// 获取路由对象
const router = useRouter()
const goList = () => {
  // vue3不支持this
  router.push('/list')
  console.log(route)
}

// 登陆验证
const userStore = useUserStore()
</script>

<template>
  <div>
    <hr />
    <router-view></router-view>
    <hr />
  </div>

  <div>我是app</div>
  <el-button @click="$router.push('/home')">首页</el-button>
  <el-button @click="goList">跳列表页</el-button>
  <p>{{ userStore.token }}</p>
  <el-button @click="userStore.setToken('fasfsdf fsdf')">登陆</el-button>
  <el-button @click="userStore.removeToken()">注销</el-button>
</template>
<style scoped></style>
