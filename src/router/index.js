import { createRouter, createWebHistory } from 'vue-router'
// createRouter创建路由实例
// createWebHistory    history 配置模式 地址栏不带井号
// createWebHashHistory   hash模式配置   地址栏带井号
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, //登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        }
      ]
    }, //详情页
    { path: '/login', component: () => import('@/viewws/login/LoginPage.vue') }, //登录页
    { path: '/login', component: () => import('@/viewws/login/LoginPage.vue') }, //登录页
    { path: '/login', component: () => import('@/viewws/login/LoginPage.vue') } //登录页
  ]
})

export default router
