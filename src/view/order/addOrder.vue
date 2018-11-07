<template>
  <div>
      <div class="formPanel">
        <Form ref="orderData" :model="orderData" label-position="right" :label-width="100" :rules="orderValidate">
          <FormItem label="订单类型：" prop="order_type">
            <RadioGroup v-model="orderData.order_type">
              <Radio :label="0">出货生产单</Radio>
              <Radio :label="1">库存生产单</Radio>
          </RadioGroup>
          </FormItem>
          <FormItem label="订单号：" prop="order_no">
              <Input v-model="orderData.order_no"></Input>
          </FormItem>
          <FormItem label="订单名：" prop="order_name">
              <Input v-model="orderData.order_name"></Input>
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
          <Button type="primary" @click="addOrder('orderData')" class="addBtn" :loading="loadingBtn">确定</Button>
      </Form>
      </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loadingBtn: false,
      orderData: {
        order_no: "",
        order_name: "",
        order_many: "",
        client_name: "",
        order_format: "",
        client_no: "",
        order_remark: "",
        client_request: "",
        order_type: 0,
      },
      token: JSON.parse(localStorage.getItem('userInfo')).token,
      orderValidate: {
        order_no: [
          {
            required: true,
            message: "订单号不能为空",
            trigger: "blur"
          }
        ],
        order_name: [
          {
            required: true,
            message: "订单名不能为空",
            trigger: "blur"
          }
        ],
        order_many: [
          {
            required: true,
            message: "订单数量不能为空",
            trigger: "blur"
          }
        ],
        client_name: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        order_format: [
          {
            required: true,
            message: "订单规格不能为空",
            trigger: "blur"
          }
        ],
        client_no: [
          { required: true, message: "客户编号不能为空", trigger: "blur" }
        ],
        order_type: [
          { required: true, message: "请选择订单类型" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    ...mapActions([]),
    addOrder: function(name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
            this.loadingBtn=true
            var params = this.orderData
            params.token=this.token
            this.$http.post('/jyadmin/api/order/addOrder', params).then((res) => {
              console.log(res,'res')
              this.$Message.info(res.data.data)
              this.loadingBtn=false
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.$Message.error('订单信息有误，请修改')
          }
      })
    },
  }
};
</script>

<style scoped>
.formPanel {
  width: 420px;
}
.formPanel .ivu-input-number{width: 100%;}
.addBtn {
  width: 120px;
  margin: 0 auto;
  display: block;
}
</style>
