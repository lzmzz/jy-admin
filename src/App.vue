<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'App',
  data () {
    return {
      userInfo: {}
    }
  },
  mounted(){
    this.getUserInfo()
  },
  methods: {
    getUserInfo: function(){
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if(_.isEmpty(this.userInfo)){
        this.$router.push({
          path: '/login'
        })
      }else{
        this.$http.post('/api/user/getUserInfo', {token: this.userInfo.token}).then((res) => {
          if(res.data.status==-1){
            this.$Message.warning(res.data.data)
            this.$router.push({
              path: '/login'
            })
            localStorage.removeItem('userInfo')
          }else{
            localStorage.setItem('userInfo', JSON.stringify(res.data.data))
            console.log(res.data.data,'res.data.data')
          }
        })
      }
    }
  },
  watch: {
    $route: function(newVal){
      if(newVal.path!='/login'&&_.isEmpty(this.userInfo)){
        this.getUserInfo()
      }
    }
  }
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
