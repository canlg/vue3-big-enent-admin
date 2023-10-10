<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelsList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // console.log(channelList.value)
}
getChannelsList()
</script>
<template>
  <!-- 下拉菜单 菜单的label是展示给用户看的，value是收集起来提交给后台的, $event是当前选中的意思-->
  <!-- @update是监听事件,@update:modelValue就是监听modelValue发生的变化 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <el-option
      v-for="item in channelList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>
