<template>
  <div>
    name：<Input type="text" v-model="name"/>
    tel：<Input type="text" v-model="tel"/>
    work_type：<Input type="text" v-model="work_type"/>
    <Button @click="addUser">确定</Button>
  </div>
</template>

<script>
import { addUser } from '@/api/user'
export default {
  name: 'home',
  data(){
    return {
      name: '',
      tel: '',
      work_type: '',
    }
  },
  methods: {
    addUser() {
      var params = {
        name: this.name,
        tel: this.tel,
        work_type: this.work_type,
        pwd: '123'
      }
      this.$http.post('/api/user/addUser', params).then((response) => {
        console.log(response);
      })
    }
  },
}
</script>

<style>

</style>
