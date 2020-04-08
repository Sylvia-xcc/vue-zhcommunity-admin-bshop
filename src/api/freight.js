import request from '@/utils/request'

// ==运费模板================================================
// 运费模板列表
export function freightList(query) {
  return request({
    url: 'Freight/lists',
    method: 'get',
    params: query
  })
}

// 运费模板详情
export function detailProduct(id) {
  return request({
    url: 'goods/detail',
    method: 'get',
    params: { id }
  })
}

// 运费模板详情
export function freightCity() {
  return request({
    url: 'freight/childCityTree',
    method: 'get'
  })
}
// ==运费模板 end============================================