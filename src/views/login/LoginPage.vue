<script setup>
import { userRegisterService, userLoginService } from '@/api/user.js'
import { ref, watch } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const isRegister = ref(false)
const form = ref()
//注册
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 整个表单的校验规则
const rules = {
  // 1.required是非空校验 ,message是提示 ，trugger什么时候做校验(blur是失焦时做校验,change是值改变的时候触发)
  // 2.长度校验
  // 3.正则校验 pattern:正则校验
  // 4.自定义校验  自己写逻辑进行校验(校验函数)
  //   validator:(rule,value,callback)
  //   (1)rule 当前校验规则相关的信息
  //   （2）value 所校验的表单元素目前的表单值
  // (3)callback
  //  - callback() 代表校验成功
  //  - callback(new Error(错误信息)) 代表校验失败
  username: [
    // 非空校验
    { required: true, message: '请输入用户名', trugger: 'blur' },
    // 长度校验
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    // 非空校验
    { required: true, message: '请输入密码', trugger: 'blur' },
    // 正则长度校验
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trugger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    },
    // 自定义校验
    {
      validator: (rule, value, callback) => {
        // 判断value和当前form 只收集的password是否一致
        if (value !== formModel.value.password) {
          callback(new Error('密码不一致'))
        } else {
          // 校验成功
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const register = async () => {
  // 注册成功之前，先进行校验，校验成功 -> 请求，校验失败->自动提示
  await form.value.validate()
  //   console.log('开始请求注册')
  //   这里的formModel.value 包含三个参数
  await userRegisterService(formModel.value)

  ElMessage.success('注册成功')

  //   注册成功后切换到登陆页面
  isRegister.value = false
}

// 调用router方法
const router = useRouter()
// 调用pinia方法 将token持久化
const userStore = useUserStore()
// 登陆前预校验
const login = async () => {
  // validate是element组件表单校验
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  //   console.log(res)
  //   将token持久化
  userStore.setToken(res.data.token)
  ElMessage.success('登陆成功')
  //   登陆成功跳转到首页
  router.push('/')
}
// 切换的时候重置表单
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>
<template>
  <el-row class="login-page">
    <!-- el-row一共24份 -->
    <!-- :span="12" 表示在一行中,占12份（百分之50） =6就是占25% -->
    <!-- :offset="3" 表示在一行中,左侧margin份数 -->

    <!-- 结构相关
    el-from 整个表单的组件
    el-from-item 表单的一行
    el-input 表单元素 
    -->
    <!-- 校验相关
        (1)el-form :model="ruleForm" 绑定的整个form的数据对象
        (2)el-form :rules="rules" 绑定的整个rules规则对象
        (3)表单元素 v-model="ruleForm.xxx" 给表单元素，绑定form的子属性
        (4)el-from-item prop配置生效的是那个校验规则
    -->
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            show-password
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            show-password
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
