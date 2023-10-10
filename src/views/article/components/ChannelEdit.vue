<script setup>
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article.js'
const formRef = ref()
const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
// 检验规则
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类名必须是1-15位的字符或数字',
      trigger: 'blur'
    }
  ]
}
const emit = defineEmits(['success'])
const onsubmit = async () => {
  // 对数据进行校验
  await formRef.value.validate()
  console.log(formRef.value)
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  //   添加完成或者编辑完成要关闭弹层
  dialogVisible.value = false
  //   实时渲染  通知父亲调用渲染
  emit('success')
}
// 组件对外暴露 open，基于传来的数据区分添加和编辑
// open({}) => 说明是添加
// open({id,cate_name,...}) => 说明是编辑
// 调用后可以打开弹层
const open = (row) => {
  // 弹窗的显示
  //   console.log(row)
  dialogVisible.value = true
  //   编辑数据回显  row装的是分类数据
  formModel.value = { ...row }
}

// 向外暴露方法
defineExpose({
  open
})
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
