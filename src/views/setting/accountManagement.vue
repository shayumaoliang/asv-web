<template v-if="getRole()">
  <div class="dashboard-container">
    <div v-if="getRole()">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>账号管理
        <el-button class="createNewAccount" size="small" type="primary" @click="addAccountConfirm">添加账号</el-button>
      </h4>
      <el-form class="view" label-width="120px" label-position="left">
        <el-table :data="accountData">
          <el-table-column width="300" prop="accountName" label="账号"></el-table-column>
          <el-table-column width="300" prop="authority" label="操作权限"></el-table-column>
          <!-- <el-table-column width="150" prop="name" label="联系人姓名"></el-table-column>
          <el-table-column width="150" prop="phone" label="手机号码"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column> -->
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" @click="editContactDialog(scope)">编辑权限</el-button>
              <el-button type="text" @click="resetPasswordDialog(scope)">重设密码</el-button>
              <el-button type="text" @click="deleteAccountDialog(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div v-else>
      <icon-svg icon-class="vertical"></icon-svg>账号信息
      <el-form style="margin-top: 50px;" label-position="right" label-width="150px">
        <el-form-item label="当前登录账号">
          {{ userName }}
        </el-form-item>
        <el-form-item label="账号权限">
          {{ '浏览权限' }}
        </el-form-item>
        <el-form-item label="权限描述">
          {{ '非管理员账号无法进行各项操作，只能查看各项服务状态等信息。' }}
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="编辑账号信息" :visible.sync="editContactConfirm" width='30%'>
      <el-form :model="editAccountData" label-width="50px">
        <el-form-item label="权限">
          <el-checkbox v-model="editAccountData.authority"> 操作权限</el-checkbox>
        </el-form-item>
        <!-- <el-form-item label="姓名">
          <el-input disabled v-model="editAccountData.name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input disabled v-model="editAccountData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input disabled v-model="editAccountData.email"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editContactConfirm = false">取 消</el-button>
        <el-button type="primary" @click="editContact()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="是否删除账号？" :visible.sync="deleteAccountConfirm" width='30%'>
      <span>删除后不可恢复，请谨慎操作。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteAccountConfirm = false">取 消</el-button>
        <el-button type="danger" @click="deleteAccount()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="创建账号" :visible.sync="addAccountDialog" width='30%'>
      <el-form :model="createAccountData" label-width="50px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="createAccountData.accountName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="checkPass">
          <el-input type="password" v-model="createAccountData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox v-model="createAccountData.authority"> 操作权限</el-checkbox>
        </el-form-item>
        <!-- <el-form-item label="姓名">
          <el-input disabled v-model="createAccountData.name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input disabled v-model="createAccountData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input disabled v-model="createAccountData.email"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAccount()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="重设密码" :visible.sync="resetPasswordConfirm" width='30%'>
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
        <el-button type="primary" @click="resetPassword('password')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const qs = require('qs')
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'token',
      'userName'
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
      createAccountData: {
        accountName: null,
        password: null,
        authority: false,
        name: null,
        phone: null,
        email: null
      },
      editAccountData: {
        authority: null,
        name: null,
        phone: null,
        email: null
      },
      scope: null,
      editContactConfirm: false,
      addAccountDialog: false,
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
      accountData: [],
      checkAuthority: [],
      allAuthority: [
        {
          label: '接收报警权限',
          value: 'alarm'
        },
        {
          label: '操作权限',
          value: 'opration'
        }
      ]
    }
  },
  methods: {
    getRole() {
      if (this.roles === 'admin') {
        return true
      } else {
        return false
      }
    },
    async showAllAcount() {
      this.accountData = []
      try {
        const res = await this.$http.get(this.$apiUrl + '/api/allusers')
        if (res.data.code === 0) {
          const users = res.data.users
          for (let i = 0; i < users.length; i++) {
            const user = {
              accountName: null,
              authority: null
            }
            user.accountName = users[i].username
            if (users[i].admin === true) {
              user.authority = '操作权限'
            } else {
              user.authority = '浏览权限'
            }
            this.accountData.push(user)
          }
          for (let i = 0; i < this.accountData.length; i++) {
            if (this.accountData[i].accountName === this.userName) {
              if (this.accountData[i].authority === '浏览权限') {
                return
              } else {
                document.cookie = 'Authorization' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    editContactDialog(scope) {
      this.scope = scope
      this.editAccountData.name = scope.row.name
      this.editAccountData.accountName = scope.row.accountName
      this.editAccountData.phone = scope.row.phone
      this.editAccountData.email = scope.row.email
      if (scope.row.authority === '浏览权限') {
        this.editAccountData.authority = false
      } else {
        this.editAccountData.authority = true
      }
      this.editContactConfirm = true
    },
    async editContact() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/updateuser',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
          data: qs.stringify(
            {
              username: this.editAccountData.accountName,
              admin: this.editAccountData.authority
            }
          )
        })
        if (res.data.code === 0) {
          this.showAllAcount()
          this.editContactConfirm = false
          this.$message(
            {
              showClose: true,
              type: 'success',
              message: '修改成功'
            }
          )
        } else {
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: res.data.msg
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    addAccountConfirm() {
      this.addAccountDialog = true
    },
    async addAccount() {
      try {
        if (!this.createAccountData.accountName) {
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: '账号不能为空'
            }
          )
        } else {
          if (!this.createAccountData.password) {
            this.$message(
              {
                showClose: true,
                type: 'error',
                message: '密码不能为空'
              }
            )
          } else {
            if (this.createAccountData.password.length < 6) {
              this.$message(
                {
                  showClose: true,
                  type: 'error',
                  message: '密码长度须大于六位数'
                }
              )
            } else {
              const res = await this.$http({
                method: 'POST',
                url: this.$apiUrl + '/admin/createuser',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
                data: qs.stringify(
                  {
                    username: this.createAccountData.accountName,
                    password: this.createAccountData.password,
                    admin: this.createAccountData.authority
                  }
                )
              })
              if (res.data.code === 0) {
                this.addAccountDialog = false
                this.showAllAcount()
                this.$message(
                  {
                    showClose: true,
                    type: 'success',
                    message: '创建成功'
                  }
                )
              } else {
                if (res.data.code === 504) {
                  this.$message(
                    {
                      showClose: true,
                      type: 'error',
                      message: '用户名已存在，请更换再尝试'
                    }
                  )
                } else {
                  this.$message(
                    {
                      showClose: true,
                      type: 'error',
                      message: res.data.msg
                    }
                  )
                }
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
        this.$message(
          {
            showClose: true,
            type: 'error',
            message: '发生错误，请查看日志'
          }
        )
      }
    },
    deleteAccountDialog(scope) {
      this.scope = scope
      this.deleteAccountConfirm = true
    },
    resetPasswordDialog(scope) {
      this.scope = scope
      this.editAccountData.accountName = scope.row.accountName
      this.resetPasswordConfirm = true
    },
    async deleteAccount() {
      try {
        const res = await this.$http(
          {
            method: 'GET',
            url: this.$apiUrl + '/admin/deleteuser?username=' + this.scope.row.accountName,
            headers: { 'Authorization': this.token }
          }
        )
        if (res.data.code === 0) {
          this.showAllAcount()
          this.deleteAccountConfirm = false
          this.$message({
            showClose: true,
            message: '成功删除',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    resetPassword(formName) {
      if (this.password.pass.length < 6) {
        this.$message({
          showClose: true,
          message: '密码长度须大于六',
          type: 'error'
        })
      } else {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await this.$http({
              method: 'POST',
              url: this.$apiUrl + '/admin/updateuserpassword',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
              data: qs.stringify(
                {
                  username: this.editAccountData.accountName,
                  password: this.password.checkPass
                }
              )
            })
            if (res.data.code === 0) {
              this.resetPasswordConfirm = false
              this.$message({
                showClose: true,
                message: '重设密码成功',
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: 'error'
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  },
  async mounted() {
    await this.showAllAcount()
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
  width: 90%;
}
</style>
