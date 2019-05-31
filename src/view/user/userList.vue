<template>
  <div>
    <div class="filterPanel">
        员工姓名：<Input v-model="filterData.name" placeholder="请输入员工姓名" />
        电话：<Input v-model="filterData.tel" placeholder="请输入员工电话" />
        工种：<Select v-model="filterData.work_type" placeholder="点击选择工种">
              <Option :value="index" v-for="(item,index) in statusArr" :key="index">{{item}}</Option>
            </Select>
        <Button type="primary" icon="ios-search" @click="getFilterData">搜索</Button>
    </div>
    <Table border :columns="columns1" :data="userTableData" class="orderTable"></Table>
    <Modal
      v-model="showStatusDtl"
      width="1200px"
      title="工资详情">
      <Table border :columns="columns2" :data="statusTableData" class="orderTable gzTable"></Table>      
      <div slot="footer" class="modalFt">
        <div>
          总计：<span class="ygWage">{{ygWage}}</span>
        </div>
        <div>
          <Button type="primary" @click="showStatusDtl=false">确定</Button>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="showUserDtl"
      title="修改信息">
        <Form ref="userData" :model="userData" label-position="right" :label-width="100" :rules="orderValidate">
          <FormItem label="员工姓名：" prop="name">
            <Input v-model="userData.name"></Input>
          </FormItem>
          <FormItem label="登录密码：" prop="pwd">
            <Input v-model="userData.pwd"></Input>
          </FormItem>
          <FormItem label="电话号码：" prop="tel">
            <Input v-model="userData.tel"></Input>
          </FormItem>
          <FormItem label="车间师傅：" prop="order_type">
            <RadioGroup v-model="userData.is_master">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
          </RadioGroup>
          </FormItem>
          <FormItem label="工种：" prop="work_type">
            <Select v-model="userData.work_type" :value="statusArr[userData.work_type]">
              <Option :value="index" v-for="(item,index) in statusArr" :key="index">{{item}}</Option>
            </Select>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="setUserDtl('userData')" :loading="userDlgLoad">确定</Button>
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
        name: '',
        tel: '',
        work_type: '',
      },
       userData: {
        order_no: "",
        order_many: "",
        client_name: "",
        order_format: "",
        client_no: "",
        client_request: "",
        order_remark: "",
        order_status: "",
        order_type: 0,
      },
      statusArr: ['开料师傅','拉伸师傅','油压师傅','车床师傅','巴位师傅','米位/甲位师傅','抛光师傅','打字师傅','清洗师傅','包装师傅', '全部'],
      orderValidate: {
        tel: [{required: true, message: "手机号不能为空",}],
        pwd: [{required: true, message: "密码不能为空",}],
        name: [{required: true, message: "姓名不能为空",}],
      },
      options3: {
        disabledDate (date) {
          return date && date.valueOf() >= Date.now() - 8000000
        },
        shortcuts: [
          {
            text: '今天',
            value () {
              return [new Date(),new Date()];
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
          title: '员工姓名',
          key: 'name'
        },
        {
          title: '工种',
          key: 'work_type',
          render: (h,params)=>{
            var status = params.row.work_type
            var text = ''
            for(var i=0;i<this.statusArr.length;i++){
              if(status==i){
                text=this.statusArr[i]
              }
            }
            return h('span',{
              style:{color: '#2db7f5'}
            },text)
          }
        },
        {
          title: '电话号码',
          key: 'tel'
        },
        {
          title: '登录密码',
          key: 'pwd'
        },
        {
          title: '车间师傅',
          key: 'is_master',
        },
        {
          title: '本月工资',
          key: 'wage',
          render: (h,params)=>{
            return h('span',{
              style:{color: '#2d8cf0', cursor: 'pointer', fontSize: '16px'},
              on: {
                click: () => {
                  this.getWageDtl(params.row.user_id, params.row.work_type)
                }
              }
            },'点击查看')
          }
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
                    this.openUserDtl(params.row.user_id)
                  }
                }
              },'修改'),
              h('Button', {
                props: {
                  type: 'error',
                  icon: 'ios-trash',
                },
                on: {
                  click: () => {
                    this.deleteOrder(params.row.user_id)
                  }
                }
              },'删除')
            ])
          }
        },
      ],
      columns2: [
        {
          title: '员工姓名',
          key: 'userName'
        },
        {
          title: '工种类别',
          key: 'workType',
          render: (h,params)=>{
            var i  =params.row.workType
            var text = this.statusArr[i]
            return h('div',{
              
            },text)
          }
        },
        {
          title: '订单号',
          key: 'order_no'
        },
        {
          title: '生产个数',
          key: 'statusMany'
        },
        {
          title: '完成时间',
          key: 'confrimTime',
          render: (h,params)=>{
            var time = this.timestampToTime(params.row.confrimTime)
            return h('div',{
              
            },time)
          }
        },
        {
          title: '单价',
          key: 'price'
        },
        {
          title: '小计',
          key: 'xiaoji',
          render: (h,params)=>{
            return h('span',{
              style:{color: '#2d8cf0', cursor: 'pointer', fontSize: '16px'}
            },params.row.xiaoji)
          }
        },
      ],
      userList: [],
      userTableData: [],
      showUserDtl: false,
      userDlgLoad: false,
      oldUserData: {},
      activePage: 1,
      totalLen: 1,
      statusTableData: [],
      showStatusDtl: false,
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      ygWage: 0,
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    ...mapActions([
    ]),
    deleteOrder(user_id) {
      this.$Modal.confirm({
        content: '确定要删除这个员工吗？',
        loading: true,
        onOk: ()=>{
          this.$Modal.remove()
          var params = {
            token: this.userInfo.token,
            user_id: user_id
          }
          this.$http.post('/jyadmin/api/user/deleteUser', params).then((res) => {
            this.getUserList()
            if(res.data.status==0){
              this.$Message.success(res.data.data)
            }else{
              this.$Message.error(res.data.data)
            }
          })
        }
      })
    },
    getWageDtl: function(user_id, work_type){
      //查看订单数量详情
      var params = {
        token: this.userInfo.token,
        user_id: user_id,
        work_type,
      }
      this.$http.post('/jyadmin/api/order/getWageDtl', params).then((res) => {
        console.log(res, '')
        if(res.data.status==0){
          var data = res.data.data
          var arr = []
          this.ygWage=0
          if(data.length>0){
            for(var i=0;i<data.length;i++){
              arr.push({
                userName: data[i].user_name,
                workType: data[i].work_type,
                statusMany: data[i].status_many,
                confrimTime: data[i].confrim_time,
                order_no: data[i].order_no,
                price: data[i].price,
                xiaoji: data[i].xiaoji,
              })
              this.ygWage+=data[i].xiaoji
            }
          }
          this.statusTableData=arr
          this.showStatusDtl=true
        }
      })
    },
    getUserList: function(params){
      if(_.isEmpty(params)){
        params={}
      }
      params.token=this.userInfo.token
      this.$http.post('/jyadmin/api/user/getUserList', params).then((res) => {
        if(res.data.status!=-1){
          this.userTableData=[]
          this.userList=res.data.data
          this.totalLen = res.data.totalLen
        }else{
          this.$Message.error(res.data.data)
        }
      }).catch(err => {
          return err
        console.log(err)
      })
    },
    changePage: function(activePage){
      this.activePage=activePage
      this.getUserList(this.filterData)
    },
    setUserDtl: function(name){
      //修改订单详情
      this.userDlgLoad = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          var newUserData = {}
          for(var item in this.userData){
            if(this.oldUserData[item]!=this.userData[item]){
              newUserData[item]=this.userData[item]
            }
          }
          var params = newUserData
          if(_.isEmpty(params)){
            this.userDlgLoad = false
            this.showUserDtl=false
            return
          }
          params.token=this.userInfo.token
          params.user_id = this.userData.user_id
          this.$http.post('/jyadmin/api/user/setUserItem', params).then((res) => {
            this.getUserList(this.filterData)
            this.userDlgLoad = false
            this.showUserDtl=false
            this.$Message.info(res.data.data)
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.userDlgLoad = false
          this.$Message.error('订单信息有误，请修改')
        }
      })
    },
    openUserDtl: function(user_id){
      //打开员工详情
      // params.token=this.token
      var params = {}
      params.user_id=user_id
      params.token=this.userInfo.token
      this.$http.post('/jyadmin/api/user/getUserItem', params).then((res) => {
        if(res.data.status==0){
          var data = res.data.data
          this.userData={
            is_master: parseInt(data.is_master),
            name: data.name,
            pwd: data.pwd,
            tel: data.tel,
            work_type: data.work_type,
            user_id: data.id,
          }
          this.oldUserData = JSON.parse(JSON.stringify(this.userData))
          this.showUserDtl = true
        }else{
          this.$Message.error(res.data.data)
        }
      }).catch(err => {
        console.log(err)
      })
      
    },
    getFilterData: function(){
      //搜索
      this.activePage=1
      this.getUserList(this.filterData)
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
    userList: function(newVal){
      for(var i=0;i<newVal.length;i++){
        var createTime = this.timestampToTime(newVal[i].create_time)
        var is_master = newVal[i].is_master==1? '是': '否'
        this.userTableData.push({
          name: newVal[i].name,
          work_type: newVal[i].work_type,
          tel: newVal[i].tel,
          pwd: newVal[i].pwd,
          is_master: is_master,
          user_id: newVal[i].id,
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
.modalFt{display: flex;justify-content: space-between;align-items: center;font-size: 18px;}

@keyframes scaleAni{
  0%{transform: scale(1)}
  50%{transform: scale(1.5)}
  100%{transform: scale(1)}
}
.ygWage{font-weight: bold;color: #19be6b;}
</style>

<style>
.orderTable .operationBox{display: flex;justify-content: space-between;}
.orderTable .ivu-table-cell{text-align: center;width: 100%;}
.gzTable table{max-height: 400px;}
.vertical-center-modal{display: flex;align-items: center;justify-content: center;}
.vertical-center-modal .ivu-modal{top: 0px;}
.filterPanel .ivu-select{width: 120px;}
</style>
