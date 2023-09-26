import axios from 'axios'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import router from '../router'
const baseUrl = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  // todo 1.基础地址， 2.超时时间
  baseUrl,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带token
    const useStore = useUserStore()
    // 判断token是否存在
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === 0) {
      return response
    }
    // 请求失败抛出错误提示  如果response.data.message没有数据直接返回服务异常
    ElMessage.error(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 错误的特殊情况 如：权限不足 或者登陆过期 ，拦截到登陆页面
    if (error.response.status === 401) {
      router.push('/login')
    }
    // 对响应错误做点什么
    ElMessage.error(error.response.data.message || '服务异常')

    return Promise.reject(error)
  }
)
export default instance
export { baseUrl }
