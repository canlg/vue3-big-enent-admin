<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import {
  artGetChannelsService,
  artDelChannelsService
} from '../../api/article.js'
import ChannelEdit from './components/ChannelEdit.vue'
const channelList = ref([])
const loading = ref(false)
const dialog = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  //   console.log(channelList.value)
  loading.value = false
}
getChannelList()
// row 是当前行的数据  index的当前行的下标
// 删除
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('此操作不可逆,你确认要删除吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelsService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
// 编辑
const onEditChannel = (row) => {
  // 如果是想编辑的话 就把row传过去，row里面是有数据的
  dialog.value.open(row)
}
// 添加
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList()
}
</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row, $index }">
          <el-button
            circle
            type="primary"
            :icon="Edit"
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            circle
            type="danger"
            :icon="Delete"
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>
