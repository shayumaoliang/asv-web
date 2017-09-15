<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>账号管理
      <el-button class="createNewAccount" size="small" type="primary">添加账号</el-button>
    </h4>
    <el-form class="view" label-width="120px" label-position="left" :model="accountData">
      <el-table :data="accountData">
        <el-table-column width="300" prop="accountName" label="账号"></el-table-column>
        <el-table-column width="300" prop="authority" label="操作权限"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" @click="deleteAccountDialog(scope)">删除</el-button>
            <el-button type="text" @click="resetPasswordDialog(scope)">重设密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-dialog title="是否删除账号？" :visible.sync="deleteAccountConfirm" size="tiny">
      <span>删除后不可恢复，请谨慎操作。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteAccountConfirm = false">取 消</el-button>
        <el-button type="primary" @click="deleteAccount()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="重设密码" :visible.sync="resetPasswordConfirm" size="tiny">
      <el-form :model="password" :rules="passwordRule" ref="password" label-width="100px">
        <el-form-item label="输入新密码" prop="pass">
          <el-input type="password" v-model="password.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="password.checkPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordConfirm = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword()">确 定</el-button>
      </span>
    </el-dialog>
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.password.checkPass !== '') {
          this.$refs.password.validateField('checkPass')
        }
        callback()
      }
    }
    var validatecheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.password.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      password: {
        pass: '',
        checkPass: ''
      },
      passwordRule: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatecheckPassword, trigger: 'blur' }
        ]
      },
      deleteAccountConfirm: false,
      resetPasswordConfirm: false,
      accountData: [
        {
          accountName: '张三',
          authority: 'admin'
        }
      ]
    }
  },
  methods: {
    deleteAccountDialog(scope) {
      this.deleteAccountConfirm = true
    },
    resetPasswordDialog(scope) {
      this.resetPasswordConfirm = true
    },
    deleteAccount() {
      this.deleteAccountConfirm = false
      this.$message({
        showClose: true,
        message: '成功删除',
        type: 'success'
      })
    },
    resetPassword(password) {
      this.$refs[password].validate((valid) => {
        if (valid) {
          this.resetPasswordConfirm = false
          this.$message({
            showClose: true,
            message: '重设密码成功',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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

.createNewAccount {
  float: right;
  margin-right: 20%;
}

.view {
  width: 80%;
}
</style>
