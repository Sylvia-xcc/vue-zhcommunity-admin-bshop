import request from '@/utils/request'

// 商家信息
export function storeDetail() {
  return request({
    url: 'user/getExt',
    method: 'get',
  })
}

export function storeDetailEdit(data) {
  return request({
    url: 'user/setExt',
    method: 'post',
    data
  })
}

// ===广告信息======================================
// 广告列表
export function swiperList(query) {
  return request({
    url: 'merchantbanner/lists',
    method: 'get',
    params:query,
  })
}

// 广告详情
export function swiperDetail(id) {
  return request({
    url: 'merchantbanner/detail',
    method: 'get',
    params:{id},
  })
}


//新增广告
export function swiperAdd(data) {
  return request({
    url: 'merchantbanner/add',
    method: 'post',
    data
  })
}

//编辑广告
export function swiperEdit(data) {
  return request({
    url: 'merchantbanner/edit',
    method: 'post',
    data
  })
}
