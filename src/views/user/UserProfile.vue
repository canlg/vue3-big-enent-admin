<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user.js'
const formRef = ref()
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()

const formData = ref({
  id,
  username,
  nickname,
  email
})
const formRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}/,
      message: '昵称长度为2-10位必须非空',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}
const submitForm = async () => {
  // 等待校验结果
  await formRef.value.validate()
  // 提交修改
  await userUpdateInfoService(formData.value)
  // 通知user模块重新渲染
  getUser()
  // 提示用户修改成功
  ElMessage.success('修改成功')
}
</script>
<template>
  <PageContainer title="用户基本信息">
    <template #default>
      <div>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="登录名称">
            <el-input v-model="formData.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户呢称" prop="nickname">
            <el-input v-model="formData.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="formData.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </PageContainer>
</template>
