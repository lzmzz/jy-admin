// sql语句
var sqlMap = {
    // 用户
    user: {
        add: 'insert into user(name, tel, work_type, pwd) values (?, ?, ?, ?)',
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
        addOrder: 'insert into `order` (order_no, create_time, order_status, order_name, order_many, client_name, order_format, client_no, client_request, order_remark) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        getOrderItem: 'select * from `order` where order_no = ?',
        setOrderItem: 'update `order` set '
    }
}

module.exports = sqlMap