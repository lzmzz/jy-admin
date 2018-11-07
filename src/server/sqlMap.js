// sql语句
var sqlMap = {
    // 用户
    user: {
        addUser: 'insert into user(name, tel, work_type, pwd, is_master) values (?, ?, ?, ?, ?)',
        login: 'select work_type, pwd from `user` where name=?',
        loginSuccess: 'update `user` set login_time=?, token=? where name=?',
        getUserInfo: 'select name, tel, login_time, work_type, token from `user` where token=?',
        checkToken: 'select work_type from `user` where token=?',
        clearToken: 'update `user` set token=? where token=?',
    },
    //订单
    order: {
        getOrderList: 'select * from `order`',
        getOrderCount: 'select count(*) from `order`',
        addOrder: 'insert into `order` (order_no, create_time, order_status, order_name, order_many, client_name, order_format, client_no, client_request, order_remark, order_type) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        getOrderItem: 'select * from `order` where order_no = ?',
        setOrderItem: 'update `order` set ',
        getStatusDtl: 'select status_many, work_type, user_name, confrim_time from `status_details` where order_no = ?',
        deleteOrder: 'delete from `order` where order_no=?',
        deleteOrderDtl: 'delete from `status_details` where order_no=?',
    }
}

module.exports = sqlMap