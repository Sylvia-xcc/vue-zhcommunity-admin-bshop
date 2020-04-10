import request from '@/utils/request'

// 基础数据统计
export function basicDataStatistics() {
    return request({
        url: 'index/index',
        method: 'get',
    })
}

// 销量折线图
export function lineChart() {
    return request({
        url: 'index/linechart',
        method: 'get',
    })
}