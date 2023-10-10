import request from '@/utils/request'

// export const userRegisterService = ({ username, password, repassword }) => {
//   return request.post('/api/reg', { username, password, repassword })
// }

// 简写 注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 登陆接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 用户基本信息接口
export const userGetInfoService = () => request.get('/my/userinfo')

// 修改用户信息
export const userUpdateInfoService = (data) => request.put('/my/userinfo', data)

// 更换头像
export const updateUserAvatar = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 重置密码
export const userUpdatePasswordService = (old_pwd, new_pwd, re_pwd) =>
  request.patch('/my/updatepwd', old_pwd, new_pwd, re_pwd)
