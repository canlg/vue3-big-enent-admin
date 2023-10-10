<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { updateUserAvatar } from '@/api/user.js'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
// 图片回显
const imageUrl = ref(userStore.user.user_pic)

const uploadRef = ref()
const onSelectFile = (uploadFile) => {
  // 基于 FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imageUrl.value = reader.result
  }
}
const onUpdateAvatar = async () => {
  // 发送请求更新头像
  await updateUserAvatar(imageUrl.value)
  //   重新渲染
  await userStore.getUser()
  //   提示用户
  ElMessage.success('头像更新成功')
}
</script>
<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="onSelectFile"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <el-button
      class="button"
      type="primary"
      @click="uploadRef.$el.querySelector('input').click()"
      >选择图片</el-button
    >
    <el-button class="button" type="success" @click="onUpdateAvatar"
      >上传头像</el-button
    >
  </page-container>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .avatar:hover {
      border-radius: 50%;
      transition: 1s;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-radius: 50%;
      transition: 1s;

      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
.button {
  margin-left: 35px;
  margin-top: 20px;
}
</style>
