import request from '@/utils/request'
// 获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')

// 添加文章分类
export const artAddChannelService = (data) => request.post('/my/cate/add', data)

// 编辑文章分类
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)

// 删除文章分类
export const artDelChannelsService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

// 获取文章列表
export const artGetListService = (params) =>
  request.get('/my/article/list', {
    params
  })

// 添加文章  传过来的data必须是一个formData格式的对象
export const artPubService = (data) => {
  request.post('/my/article/add', data)
}

// 获取文章详情
export const artGetdatailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })

// 编辑文章
export const artEditService = (data) => request.put('/my/article/info', data)
