<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="locked"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'loginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    //aaa
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const params = {name: this.form.userName,pwd : this.form.password}
          this.$http.post('/jyadmin/api/user/login', params).then((res) => {
            console.log(res.data)
            if(res.data.status==-1){
              this.$Message.warning(res.data.data)
            }else if(res.data.status==0){
              this.$Message.success('登录成功')
              localStorage.setItem('userInfo', JSON.stringify(res.data.data))
              this.$router.push({
                path: '/order/orderList',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>
