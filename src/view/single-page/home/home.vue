<template>
  <div class="text">
    欢迎来到坚永订单后台管理系统！
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
  },
}
</script>

<style scoped>
.text{font-size: 42px}
</style>
