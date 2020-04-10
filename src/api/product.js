import request from '@/utils/request'

// ==商品===================================================
// 商品列表
export function productList(query) {
  return request({
    url: 'goods/lists',
    method: 'get',
    params: query
  })
}

// 商品详情
export function detailProduct(id) {
  return request({
    url: 'goods/detail',
    method: 'get',
    params: { id }
  })
}

// 商品分类
export function fetchCategoryList() {
  return request({
    url: 'category/lists',
    method: 'get'
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

// 商品编辑
export function editProduct(data) {
  return request({
    url: 'goods/edit',
    method: 'post',
    data
  })
}
// ==商品 end================================================

// ==商品规格 end============================================
//设置商品规格
export function setProductGuige(data) {
  return request({
    url: 'product/guigeSet',
    method: 'post',
    data
  })
}

//商品规格列表
export function listProductGuige(pid) {
  return request({
    url: 'product/guigeList',
    method: 'get',
    params: { pid }
  })
}

//商品规格删除
export function delProductGuige(data) {
  return request({
    url: 'product/guigeDel',
    method: 'post',
    data
  })
}

//商品规格属性列表（）
export function listProductAttr(pid) {
  return request({
    url: 'product/attrList',
    method: 'get',
    params: { pid }
  })
}

//修改商品规格属性列表
export function editProductAttr(data) {
  return request({
    url: 'product/attrEdit',
    method: 'post',
    data
  })
}

// ==商品规格 ===============================================

// ==规格属性 ===============================================
// 规格属性列表
export function listAttribute(query) {
  return request({
    url: 'attribute/lists',
    method: 'get',
    params: query
  })
}

// 规格属性详情
export function detailAttribute(id) {
  return request({
    url: 'attribute/detail',
    method: 'get',
    params: { id }
  })
}

// 新增规格属性
export function addAttribute(data) {
  return request({
    url: 'attribute/add',
    method: 'post',
    data
  })
}

// 新增规格属性
export function editAttribute(data) {
  return request({
    url: 'attribute/edit',
    method: 'post',
    data
  })
}

// 删除规格属性
export function delAttribute(data) {
  return request({
    url: 'attribute/del',
    method: 'post',
    data
  })
}
// ==规格属性 end============================================

// ==订单===================================================
// 订单列表
export function listOrder(query) {
  return request({
    url: 'order/lists',
    method: 'get',
    params: query
  })
}

// 订单详情
export function detailOrder(id) {
  return request({
    url: 'order/detail',
    method: 'get',
    params: { id }
  })
}

// 编辑订单
export function editOrder(data) {
  return request({
    url: 'order/edit',
    method: 'post',
    data
  })
}

// 删除订单
export function delOrder(data) {
  return request({
    url: 'order/del',
    method: 'post',
    data
  })
}

// 发货
export function deliveryOrder(data) {
  return request({
    url: 'order/toDelivery',
    method: 'post',
    data
  })
}
// ==订单 end================================================



