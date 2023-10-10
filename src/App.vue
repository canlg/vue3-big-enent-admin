<script setup>
import zhCn from 'element-plus/dist/locale/zh-Cn.mjs'
// 获取路由参数
// const route = useRoute()
// 获取路由对象
// const router = useRouter()
</script>

<template>
  <div>
    <!-- 配置中文 -->
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>
<style scoped></style>
