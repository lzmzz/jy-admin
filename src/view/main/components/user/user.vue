<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Avatar :src="userAvator"/> -->
      <img src="@/assets/images/avator.png" alt="" class="userImg">
      <Icon :size="12" type="arrow-down-b"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'user',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      this.$router.push({
        name: 'login'
      })
      localStorage.removeItem('userInfo')
    }
  }
}
</script>
<style scoped>
.userImg{width: 32px;vertical-align: middle;}
</style>
