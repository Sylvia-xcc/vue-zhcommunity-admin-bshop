import request from '@/utils/request'

export function productList(query) {
  return request({
    url: 'goods/lists',
    method: 'get',
    params: query
  })
}

export function fetchProduct(id) {
  return request({
    url: '/vue-element-admin/product/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/product/pv',
    method: 'get',
    params: { pv }
  })
}

export function addProduct(data) {
  return request({
    url: 'goods/add',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/vue-element-admin/product/update',
    method: 'post',
    data
  })
}
