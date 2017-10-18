<template v-if="getRole()">
  <div class="dashboard-container">
    <div v-if="getRole()">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>账号管理
        <el-button class="createNewAccount" size="small" type="primary" @click="addAccountConfirm">添加账号</el-button>
      </h4>
      <el-form class="view" label-width="120px" label-position="left">
        <el-table :data="accountData">
          <el-table-column width="150" prop="accountName" label="账号"></el-table-column>
          <el-table-column width="150" prop="authority" label="操作权限"></el-table-column>
          <el-table-column width="150" prop="name" label="联系人姓名"></el-table-column>
          <el-table-column width="150" prop="phone" label="手机号码"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" @click="editContactDialog(scope)">编辑</el-button>
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
          {{ '非管理员权限' }}
        </el-form-item>
        <el-form-item label="权限描述">
          {{ '非管理员账号无法进行各项操作，只能查看各项服务状态等信息。' }}
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="编辑账号信息" :visible.sync="editContactConfirm" size="tiny">
      <el-form :model="editAccountData" label-width="50px">
        <el-form-item label="权限">
          <el-checkbox-group v-model="editAccountData.authority">
            <el-checkbox v-for="(authority, index) of allAuthority" :label="authority.value" :key="index">{{ authority.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input disabled v-model="editAccountData.name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input disabled v-model="editAccountData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input disabled v-model="editAccountData.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editContactConfirm = false">取 消</el-button>
        <el-button type="primary" @click="editContact()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="是否删除账号？" :visible.sync="deleteAccountConfirm" size="tiny">
      <span>删除后不可恢复，请谨慎操作。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteAccountConfirm = false">取 消</el-button>
        <el-button type="primary" @click="deleteAccount()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="创建账号" :visible.sync="addAccountDialog" size="tiny">
      <el-form :model="createAccountData" label-width="50px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="createAccountData.accountName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="checkPass">
          <el-input type="password" v-model="createAccountData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="createAccountData.authority">
            <el-checkbox v-for="(authority, index) of allAuthority" :label="authority.value" :key="index">{{ authority.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input disabled v-model="createAccountData.name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input disabled v-model="createAccountData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input disabled v-model="createAccountData.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAccount()">确 定</el-button>
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
        authority: [],
        name: null,
        phone: null,
        email: null
      },
      editAccountData: {
        authority: [],
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
              authority: []
            }
            user.accountName = users[i].username
            if (users[i].admin === true && users[i].alarm === true) {
              user.authority[0] = '接收报警权限'
              user.authority[1] = <br />
              user.authority[2] = '操作权限'
            } else {
              if (users[i].admin === false && users[i].alarm === false) {
                user.authority = ['无任何权限']
              } else {
                if (users[i].admin === true && users[i].alarm === false) {
                  user.authority[0] = '操作权限'
                } else {
                  if (users[i].admin === false && users[i].alarm === true) {
                    user.authority[0] = '接收报警权限'
                  }
                }
              }
            }
            this.accountData.push(user)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    editContactDialog(scope) {
      this.scope = scope
      this.editAccountData.authority = []
      this.editAccountData.name = scope.row.name
      this.editAccountData.accountName = scope.row.accountName
      this.editAccountData.phone = scope.row.phone
      this.editAccountData.email = scope.row.email
      if (scope.row.authority[0] === '无任何权限') {
        this.editAccountData.authority = []
      } else {
        if (scope.row.authority.length === 3) {
          this.editAccountData.authority[0] = 'alarm'
          this.editAccountData.authority[1] = 'opration'
        } else {
          if (scope.row.authority[0] === '接收报警权限') {
            this.editAccountData.authority[0] = 'alarm'
          } else {
            this.editAccountData.authority[0] = 'opration'
          }
        }
      }
      this.editContactConfirm = true
    },
    async editContact() {
      try {
        let admin
        let alarm
        const authority = []
        if (this.editAccountData.authority[0] === 'opration' && this.editAccountData.authority.length === 1) {
          admin = true
          alarm = false
          authority[0] = '操作权限'
        } else {
          if (this.editAccountData.authority[0] === 'alarm' && this.editAccountData.authority.length === 1) {
            admin = false
            alarm = true
            authority[0] = '接收警报权限'
          } else {
            if (this.editAccountData.authority[0] === 'alarm' && this.editAccountData.authority[1] === 'opration') {
              admin = true
              alarm = true
              authority[0] = '操作权限'
              authority[1] = <br />
              authority[2] = '接收警报权限'
            } else {
              admin = false
              alarm = false
            }
          }
        }
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/updateuser',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
          data: qs.stringify(
            {
              username: this.editAccountData.accountName,
              admin: admin,
              alarm: alarm
            }
          )
        })
        if (res.data.code === 0) {
          const index = this.scope.$index
          this.accountData[index].authority = authority
          this.showAllAcount()
          this.editContactConfirm = false
          this.$message(
            {
              showClose: true,
              type: 'success',
              message: '修改成功'
            }
          )
          // location.reload()
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
            let authority = []
            let admin
            let alarm
            if (this.createAccountData.authority[0] === 'opration' && this.createAccountData.authority.length === 1) {
              authority[0] = '操作权限'
              admin = true
              alarm = false
            } else {
              if (this.createAccountData.authority[0] === 'alarm' && this.createAccountData.authority.length === 1) {
                authority[0] = '接收报警权限'
                admin = false
                alarm = true
              } else {
                if (this.createAccountData.authority[0] === 'alarm' && this.createAccountData.authority[1] === 'opration') {
                  authority[0] = '接收报警权限'
                  authority[1] = <br />
                  authority[2] = '操作权限'
                  admin = true
                  alarm = true
                } else {
                  authority = ['无任何权限']
                  admin = false
                  alarm = false
                }
              }
            }
            const res = await this.$http({
              method: 'POST',
              url: this.$apiUrl + '/admin/createuser',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
              data: qs.stringify(
                {
                  username: this.createAccountData.accountName,
                  password: this.createAccountData.password,
                  admin: admin,
                  alarm: alarm
                }
              )
            })
            if (res.data.code === 0) {
              this.showAllAcount()
              this.$message(
                {
                  showClose: true,
                  type: 'success',
                  message: '创建成功'
                }
              )
              // this.accountData.push({
              //   accountName: this.createAccountData.accountName,
              //   authority: authority,
              //   name: this.createAccountData.name,
              //   phone: this.createAccountData.phone,
              //   email: this.createAccountData.email
              // })
              // location.reload()
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
      } catch (e) {
        this.$message(
          {
            showClose: true,
            type: 'error',
            message: '啥问题啊'
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
