<!-- 抽屉 -->
<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import {
  artPubService,
  artGetdatailService,
  artEditService
} from '@/api/article.js'
import { baseURL } from '@/utils/request'
import axios from 'axios'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
// 默认数据
// const defaultForm = ref({
//   title: '', // 标题
//   cate_id: '', // 分类id
//   cover_img: '', // 封面图片 file 对象
//   content: '', // string 内容
//   state: '' // 状态
// })
// 准备数据  //用做提交的数据
const formModel = ref({
  title: '', // 标题
  cate_id: '', // 分类id
  cover_img: '', // 封面图片 file 对象
  content: '', // string 内容
  state: '' // 状态
})
// 默认图片  //在未上传文件的时候默认显示空
const imageUrl = ref('')
// 图片预览功能
const onSelectFile = (uploadFile) => {
  // 图片预览
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  // 将图片存入formModel 将来用于提交
  formModel.value.cover_img = uploadFile.raw
}
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将状态存进formModel
  formModel.value.state = state
  // 接口需要的是formdata对象
  // 这里要将普通的js对象转为formdata对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    // console.log('编辑操作')
    await artEditService(fd)
    ElMessage.success('修改成功')
    // 编辑成功后关闭抽屉
    visibleDrawer.value = false
    // 重新调用渲染,通知父组件,修改成功了
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPubService(fd)
    ElMessage.success('添加成功')
    // 添加成功后关闭抽屉
    visibleDrawer.value = false
    // 重新调用渲染,通知父组件,添加成功了
    emit('success', 'add')
  }
}

// 组件对外暴露 open，基于传来的数据区分添加和编辑
// open({}) => 说明是添加
// open({id,cate_name,...}) => 说明是编辑
// 调用后可以打开抽屉
const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // 如果id存在需要基于row.id发送请求，获取编辑对应的详情数据进行回显
    const res = await artGetdatailService(row.id)
    // 数据回显
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imageUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象，存储起来, 将来便于提交
    const file = await imageUrlToFileObject(
      imageUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    // 添加前要清空数据
    formModel.value = {}
    // console.log('添加操作')
    imageUrl.value = ''
    // 清空富文本编辑器需要特殊的方法
    editorRef.value.setHTML()
  }
  // console.log(row)
}
// 将网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}
defineExpose({
  open
})
</script>
<template>
  <el-drawer
    label="rtl"
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    size="50%"
  >
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!--此处而要关闭element-plus的自动上传，不需要配置 action等参数
只需要做前端的本地预览图片即可，无需在提交前上传图标
语法:URL.create0bjectURL(...)创建本地预览的地址，来预览 -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"
            ><Plus
          /></el-icon> </el-upload
      ></el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
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
</style>
