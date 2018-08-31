import axios from '@/libs/api.request'

export const getOrderList = (params) => {//订单列表
  return axios.request({
    url: '/orderApi/getOrderList',
    method: 'post',
    params
  })
}