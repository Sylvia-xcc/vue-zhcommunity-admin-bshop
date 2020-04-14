import request from '@/utils/request'

// 商户商品分类列表
export function classifyList(query) {
    return request({
        url: 'Merchantclass/lists',
        method: 'get',
        params:query
    })
}

// 商户商品分类一级列表
export function classifyFirstList() {
    return request({
        url: 'Merchantclass/classList',
        method: 'get',
    })
}

// 商户商品分类添加
export function classifyAdd(data) {
    return request({
        url: 'Merchantclass/add',
        method: 'post',
        data
    })
}

// 商户商品分类编辑
export function classifyEdit(data) {
    return request({
        url: 'Merchantclass/edit',
        method: 'post',
        data
    })
}

// 商户商品分类删除
export function classifyDel(data) {
    return request({
        url: 'Merchantclass/del',
        method: 'post',
        data
    })
}

// 商户商品分类详情
export function classifyDetail(id) {
    return request({
        url: 'Merchantclass/detail',
        method: 'get',
        params: { id }
    })
}