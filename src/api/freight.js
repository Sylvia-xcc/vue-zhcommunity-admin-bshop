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

// 运费模板添加
export function freightAdd(data) {
  return request({
    url: 'Freight/add',
    method: 'post',
    data
  })
}

// 运费模板编辑
export function freightEdit(data) {
  return request({
    url: 'Freight/edit',
    method: 'post',
    data
  })
}

// 运费模板详情
export function freightDetail(id) {
  return request({
    url: 'freight/detail',
    method: 'get',
    params:{id}
  })
}

// 运费模板删除
export function freightDel(data) {
  return request({
    url: 'Freight/delTemp',
    method: 'post',
    data
  })
}

// 省/市详情
export function freightCity() {
  return request({
    url: 'freight/childCityTree',
    method: 'get'
  })
}
// ==运费模板 end============================================