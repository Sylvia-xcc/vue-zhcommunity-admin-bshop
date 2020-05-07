import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'user/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'user/logout',
    method: 'post'
  })
}

export function wechatLogin(page) {
  return request({
    url: 'login/getQrcode',
    method: 'get',
    params: { page }
  })
}

// ===重置密码======================================
export function resetPassword(data) {
  return request({
    url: 'user/setPass',
    method: 'post',
    data
  })
}
