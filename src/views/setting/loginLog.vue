<template>
  <div class="dashboard-container">
    <h3>
      <icon-svg icon-class="vertical"></icon-svg>登录日志</h3>
    <el-table :data="accountData">
      <el-table-column width="300" prop="accountName" label="账号"></el-table-column>
      <el-table-column width="300" prop="authority" label="上线时间"></el-table-column>
      <el-table-column prop="name" label="退出时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {
    return {

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
