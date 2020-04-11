import request from '@/utils/request'

// 提现明细列表
export function cashoutList(query) {
    return request({
        url: 'Merchantextract/lists',
        method: 'get',
        params:query
    })
}

//提现
export function cashoutAdd(data) {
    return request({
        url: 'Merchantextract/add',
        method: 'post',
        data
    })
}

//删除
export function cashoutDel(data) {
    return request({
        url: 'Merchantextract/del',
        method: 'post',
        data
    })
}