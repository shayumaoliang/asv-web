<template>
  <div class="dashboard-container">
    <h3>
      <icon-svg icon-class="vertical"></icon-svg>操作日志</h3>
    <el-table :data="accountData">
      <el-table-column width="150" prop="accountName" label="账号"></el-table-column>
      <el-table-column width="150" prop="authority" label="操作权限"></el-table-column>
      <el-table-column width="150" prop="name" label="联系人姓名"></el-table-column>
      <el-table-column width="150" prop="phone" label="手机号码"></el-table-column>
      <el-table-column width="220" prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="text" @click="editContactDialog(scope)">编辑</el-button>
          <el-button type="text" @click="resetPasswordDialog(scope)">重设密码</el-button>
          <el-button type="text" @click="deleteAccountDialog(scope)">删除</el-button>
        </template>
      </el-table-column>
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
