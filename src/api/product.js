import request from '@/utils/request'

export function productList(query) {
  return request({
    url: 'goods/lists',
    method: 'get',
    params: query
  })
}

//商品详情
export function fetchProduct(id) {
  return request({
    url: 'goods/detail',
    method: 'get',
    params: { id }
  })
}

//商品分类
export function fetchCategoryList(){
  return request({
    url:'category/lists',
    method:'get'
  })
}


export function addProduct(data) {
  return request({
    url: 'goods/add',
    method: 'post',
    data
  })
}

export function delProduct(data) {
  return request({
    url: 'goods/del',
    method: 'post',
    data
  })
}

//商品编辑
export function editProduct(data) {
  return request({
    url: 'goods/edit',
    method: 'post',
    data
  })
}

//规格属性列表
export function listAttribute(query){
  return request({
    url:'attribute/lists',
    method:'get',
    params: query
  })
}

//规格属性详情
export function detailAttribute(id){
  return request({
    url:'attribute/detail',
    method:'get',
    params: { id }
  })
}

//新增规格属性
export function addAttribute(data) {
  return request({
    url: 'attribute/add',
    method: 'post',
    data
  })
}

//新增规格属性
export function editAttribute(data) {
  return request({
    url: 'attribute/edit',
    method: 'post',
    data
  })
}

//删除规格属性
export function delAttribute(data) {
  return request({
    url: 'attribute/del',
    method: 'post',
    data
  })
}

