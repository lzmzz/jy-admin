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
      userInfo: JSON.parse(localStorage.getItem('userInfo'))
    }
  },
  mounted(){
    this.getUserInfo()
  },
  methods: {
    getUserInfo: function(){
      if(_.isEmpty(this.userInfo)){
        this.$router.push({
          path: '/login'
        })
      }else{
        if(this.userInfo.work_type!=999){
          this.$router.push({
            path: '/login'
          })
        }
      }
    }
  },
  watch: {
    $route: {
      handler(newVal){
        
        if(newVal.path!='/login'){
          if(_.isEmpty(JSON.parse(localStorage.getItem('userInfo')))){
            this.$router.push({
              path: '/login'
            })
          }else{
            let params = {}
            this.$http.post('/jyadmin/api/user/getUserInfo', {token: JSON.parse(localStorage.getItem('userInfo')).token}).then((res) => {
              if(res.data.status==-1){
                this.$router.push({
                  path: '/login'
                })  
                this.$Message.info(res.data.data)
              }
            })
          }
        }
      },
      deep: true
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
