import request from '@/utils/request'

// 拼团列表
export function assembleList(query) {
    return request({
        url: 'pintuan/lists',
        method: 'get',
        params: query
    })
}

// 拼团订单列表
export function assembleOrderList(query) {
    return request({
        url: 'pintuanorder/lists',
        method: 'get',
        params: query
    })
}

// 拼团订单详情
export function assembleOrderDetail(id) {
    return request({
        url: 'pintuanorder/detail',
        method: 'get',
        params: {id}
    })
}

// 拼团订单编辑
export function assembleOrderEdit(data) {
    return request({
        url: 'pintuanorder/edit',
        method: 'post',
        data
    })
}