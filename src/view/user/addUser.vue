<template>
  <div>
      <div class="formPanel">
        <Form ref="userData" :model="userData" label-position="right" :label-width="100" :rules="userValidate">
          <FormItem label="姓名：" prop="name">
              <Input v-model="userData.name"></Input>
          </FormItem>
          <FormItem label="手机号：" prop="tel">
              <Input v-model="userData.tel"></Input>
          </FormItem>
          <FormItem label="登录密码：" prop="pwd">
              <Input v-model="userData.pwd"></Input>
          </FormItem>
          <FormItem label="工种：" prop="work_type">
            <Select v-model="userData.work_type" placeholder="点击选择工种">
              <Option :value="index" v-for="(item,index) in statusArr" :key="index">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem label="车间师傅：" prop="is_master">
            <RadioGroup v-model="userData.is_master">
              <Radio :label="0">是</Radio>
              <Radio :label="1">否</Radio>
          </RadioGroup>
          </FormItem>
          <Button type="primary" @click="addUser('userData')" class="addBtn" :loading="loadingBtn">确定</Button>
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
      userData: {
        name: "",
        tel: "",
        pwd: "",
        work_type: "",
        is_master: "",
      },
      statusArr: ['开料师傅','拉伸师傅','油压师傅','车床师傅','巴位师傅','米位/甲位师傅','抛光师傅','打字师傅','清洗师傅','包装师傅'],
      token: JSON.parse(localStorage.getItem('userInfo')).token,
      userValidate: {
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: "电话不能为空",
            trigger: "blur"
          }
        ],
        pwd: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        is_master: [
          { required: true, message: "请选择是否为车间师傅",}
        ],
        work_type: [
          { required: true, message: "请选择工种",}
        ],
      }
    };
  },
  mounted() {},
  methods: {
    ...mapActions([]),
    addUser: function(name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
            this.loadingBtn=true
            var params = this.userData
            params.token=this.token
            this.$http.post('/jyadmin/api/user/addUser', params).then((res) => {
              console.log(res,'res')
              this.$Message.info(res.data.data)
              this.loadingBtn=false
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.$Message.error('员工信息有误，请修改')
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
