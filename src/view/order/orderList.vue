<template>
  <div>
    <div class="filterPanel">
      订单号：<Input v-model="filterData.orderNo" placeholder="请输入订单号" />
      规格：<Input v-model="filterData.orderFormat" placeholder="请输入规格" />
      客户名：<Input v-model="filterData.clientName" placeholder="请输入客户名" />
      客户编号：<Input v-model="filterData.clientNo" placeholder="请输入客户编号" />
      日期筛选：<DatePicker :options="options3" type="daterange" placement="bottom-end" placeholder="请选择日期" @on-change="changeDate"></DatePicker>
      <Button type="primary" icon="ios-search" @click="getFilterData">搜索</Button>
    </div>
    <Table border :columns="columns1" :data="orderTableData" class="orderTable"></Table>
    <div class="panelPanel">
      <Page :total="totalLen" @on-change="changePage" />
    </div>
    <Modal
      v-model="showOrderDtl"
      title="修改订单">
        <Form ref="orderData" :model="orderData" label-position="right" :label-width="100" :rules="orderValidate">
          <FormItem label="订单号：" prop="order_no">
            <!-- <Input v-model="orderData.order_no"></Input> -->
            <p>{{orderData.order_no}}</p>
          </FormItem>
          <FormItem label="订单名：" prop="order_name">
            <Input v-model="orderData.order_name"></Input>
          </FormItem>
          <FormItem label="订单状态：" prop="order_status">
            <Select v-model="orderData.order_status" :value="statusArr[orderData.order_status]">
              <Option :value="index" v-for="(item,index) in statusArr" :key="index">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem label="订单数量：" prop="order_many">
            <Input v-model="orderData.order_many"></Input>
          </FormItem>
          <FormItem label="客户名称：" prop="client_name">
            <Input v-model="orderData.client_name"></Input>
          </FormItem>
          <FormItem label="订单规格：" prop="order_format">
            <Input v-model="orderData.order_format"></Input>
          </FormItem>
          <FormItem label="客户编号：" prop="client_no">
            <Input v-model="orderData.client_no"></Input>
          </FormItem>
          <FormItem label="客户要求：">
            <Input v-model="orderData.client_request"></Input>
          </FormItem>
          <FormItem label="订单备注：">
            <Input v-model="orderData.order_remark" type="textarea"></Input>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="setOrderDtl('orderData')" :loading="orderDlgLoad">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      filterData: {
        orderNo: '',
        orderFormat: '',
        clientName: '',
        clientNo: '',
        startTime: '',
        endTime: ''
      },
       orderData: {
        order_no: "",
        order_name: "",
        order_many: "",
        client_name: "",
        order_format: "",
        client_no: "",
        client_request: "",
        order_remark: "",
        order_status: "",
      },
      statusArr: ['开料中','拉伸中','油压中','车床中','巴位中','米位/甲位中','抛光中','打字中','清洗中','包装中','已完成'],
      orderValidate: {
        order_no: [{required: true, message: "订单号不能为空",}],
        order_name: [{required: true, message: "订单名不能为空",}],
        order_many: [{required: true, type: "number", message: "订单数量不能为空",}],
        client_name: [{ required: true, message: "客户名称不能为空",  }],
        order_format: [{required: true, message: "订单规格不能为空", }],
        client_no: [{ required: true, message: "客户编号不能为空",  }],
      },
      options3: {
        disabledDate (date) {
          return date && date.valueOf() >= Date.now() - 8000000
        },
        shortcuts: [
          {
            text: '今天',
            value () {
              return new Date();
            }
          },
          {
            text: '最近一周',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: '最近一个月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: '最近三个月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ]
      },
      columns1: [
        {
          title: '订单号',
          key: 'orderNo'
        },
        {
          title: '创建时间',
          width: 180,
          key: 'createTime'
        },
        {
          title: '订单名称',
          key: 'orderName'
        },
        {
          title: '订单数量',
          key: 'orderMany'
        },
        {
          title: '订单规格',
          key: 'orderFormat'
        },
        {
          title: '订单状态',
          key: 'orderStatus',
          render: (h,params)=>{
            var status = params.row.orderStatus
            var color = ''
            var text = ''
            if(status!=10){
              color='#2d8cf0'
            }else{
              color='#19be6b'
            }
            for(var i=0;i<this.statusArr.length;i++){
              if(status==i){
                text=this.statusArr[i]
              }
            }
            return h('span',{
              style:{color:color}
            },text)
          }
        },
        {
          title: '客户名称',
          key: 'clientName'
        },
        {
          title: '客户编号',
          key: 'clientNo'
        },
        {
          title: '操作',
          width: 200,
          key: 'operation',
          render: (h,params)=>{
            return h('div',
              {
                class: 'operationBox'
              },[
              h('Button', {
                props: {
                  type: 'info',
                  icon: 'settings',
                },
                on: {
                  click: () => {
                    this.openOrderDtl(params.row.orderNo)
                  }
                }
              },'修改'),
              h('Button', {
                props: {
                  type: 'error',
                  icon: 'ios-trash',
                }
              },'删除')
            ])
          }
        },
        // {
        //   title: '客户要求',
        //   key: 'clientRequest'
        // },
        // {
        //   title: '订单备注',
        //   key: 'orderRemark'
        // },
      ],
      orderList: [],
      orderTableData: [],
      showOrderDtl: false,
      orderDlgLoad: false,
      oldOrderData: {},
      activePage: 1,
      totalLen: 1,
      token: JSON.parse(localStorage.getItem('userInfo')).token
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    ...mapActions([
    ]),
    getOrderList: function(params){
      if(_.isEmpty(params)){
        params={}
      }
      params.page=this.activePage
      params.token=this.token
      this.$http.post('/api/order/getOrderList', params).then((res) => {
        if(res.data.status!=-1){
          this.orderTableData=[]
          this.orderList=res.data.data
          this.totalLen = res.data.totalLen
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changePage: function(activePage){
      this.activePage=activePage
      this.getOrderList(this.filterData)
    },
    setOrderDtl: function(name){
      //修改订单详情
      this.orderDlgLoad = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          var newOrderData = {}
          console.log(this.orderData.order_status,'order_status')
          for(var item in this.orderData){
            if(this.oldOrderData[item]!=this.orderData[item]){
              newOrderData[item]=this.orderData[item]
            }
          }
          var params = newOrderData
          if(_.isEmpty(params)){
            this.orderDlgLoad = false
            this.showOrderDtl=false
            return
          }
          params.order_no = this.orderData.order_no
          this.$http.post('/api/order/setOrderItem', params).then((res) => {
            this.getOrderList()
            this.orderDlgLoad = false
            this.showOrderDtl=false
            this.$Message.info(res.data.data)
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.orderDlgLoad = false
          this.$Message.error('订单信息有误，请修改')
        }
      })
    },
    openOrderDtl: function(orderNo){
      //打开订单详情
      this.$http.post('/api/order/getOrderItem', {orderNo}).then((res) => {
        var data = res.data.data
        this.orderData={
          order_no: data.order_no,
          order_name: data.order_name,
          order_many: data.order_many,
          client_name: data.client_name,
          order_format: data.order_format,
          client_no: data.client_no,
          client_request: data.client_request,
          order_remark: data.order_remark,
          order_status: data.order_status,
        }
        this.oldOrderData = JSON.parse(JSON.stringify(this.orderData))
        this.showOrderDtl = true
      }).catch(err => {
        console.log(err)
      })
      
    },
    changeDate: function(date){
      //筛选日期
      var time1 = new Date(date[0]).getTime()-28800000
      var time2 = new Date(date[1]).getTime()-28800000
      if(time1<time2){
        this.filterData.startTime=time2
        this.filterData.endTime=time1
      }else{
        this.filterData.startTime=time1
        this.filterData.endTime=time2
      }
    },
    getFilterData: function(){
      //搜索
      this.activePage=1
      this.getOrderList(this.filterData)
    },
    timestampToTime: function(timestamp) {
      var date = new Date(parseInt(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '年'
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月'
      var D = date.getDate() + '日'
      return Y+M+D;
    }
  },
  watch: {
    orderList: function(newVal){
      for(var i=0;i<newVal.length;i++){
        var createTime = this.timestampToTime(newVal[i].create_time)
        this.orderTableData.push({
          orderNo: newVal[i].order_no,
          createTime: createTime,
          orderName: newVal[i].order_name,
          orderMany: newVal[i].order_many,
          orderFormat: newVal[i].order_format,
          orderStatus: newVal[i].order_status,
          clientName: newVal[i].client_name,
          clientNo: newVal[i].client_no,
          clientRequest: newVal[i].client_request,
          orderRemark: newVal[i].order_remark
        })
      }
    }
  }
}
</script>

<style scoped>
.filterPanel{display: flex;align-items: center;margin-bottom: 20px;}
.filterPanel .ivu-input-wrapper{width: 120px;margin-right: 20px;}
.filterPanel .ivu-btn{margin-left: 20px;}
.panelPanel{margin: 20px;display: flex;justify-content: flex-end;}
</style>

<style>
.orderTable .operationBox{display: flex;justify-content: space-between;}
.orderTable .ivu-table-cell{text-align: center;width: 100%;}
.vertical-center-modal{display: flex;align-items: center;justify-content: center;}
.vertical-center-modal .ivu-modal{top: 0px;}
</style>
