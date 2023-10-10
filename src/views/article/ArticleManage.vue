<script setup>
import { formatTime } from '@/utils/format.js'
import { artGetListService } from '@/api/article.js'
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
const articleList = ref([]) //文章列表
const total = ref(0) //文章数据总条数
const loading = ref(false) //加载效果
// 定义请求参数对象
const params = ref({
  pagenum: 1, //当前页
  pagesize: 10, //每页的数据量
  cate_id: '', //文章分类id
  state: '' //状态
})

const getArticleList = async () => {
  // 请求数据前加载动画
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  // 请求完毕后结束加载动画
  loading.value = false
}
// 基于params参数获取列表
getArticleList()

// 分页逻辑  size是当前点击页
// const onSizeChange = (size) => {
//   // console.log('当前每页条数', size)
//   params.value.pagenum = 1
//   params.value.pagesize = size
// }
const onCurrentChange = (page) => {
  // console.log('页码变化了', page)
  // 更新当前页
  params.value.pagenum = page
  // 基于最新的当前页渲染数据
  getArticleList()
}

// 删除文章
const onDeleteArticle = (row) => {
  console.log(row)
}

const articleEditRef = ref()
// 添加文章
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑文章
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 搜索 //根据条件进行渲染
const onSearch = () => {
  params.value.pagenum = 1 //重置页面
  // console.log(params.value)
  getArticleList() //重新渲染
}
// 重置 //将筛选条件清空
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 添加或者编辑 成功之后的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加,最好渲染最后一页  Math.ceil是向上取整的意思
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数,再渲染
    params.value.pagenum = lastPage
    getArticleList()
  }
  // 编辑的话，渲染当前页就行
  getArticleList()
}
</script>
<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单区域 inline加上这个整个表单会在同一行显示-->
    <el-form inline>
      <!-- 表单域 -->
      <el-form-item label="文章分类:">
        <!-- 下拉菜单 菜单的label是展示给用户看的，value是收集起来提交给后台的-->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态:">
        <!-- 后台标记发布状态，通过中文标记的，已发布/草稿 -->
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="onSearch"
          >搜索</el-button
        >
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <!-- 表格区域 内置加载动画-->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <!-- 作用域插槽 -->
        <template #default="{ row }">
          <!-- el-link 能把文本变成链接 underline去掉下划线-->
          <el-link :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <!-- 对时间进行格式处理 -->
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽row 可以获取当前行的数据 => v-for 遍历item -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 5, 20, 30]"
      :background="true"
      layout="total,  prev, pager, next, jumper"
      :total="total"
      @current-change="onCurrentChange"
      style="margin-top: 70px; justify-content: center"
    />
    <!-- 抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </PageContainer>
</template>
