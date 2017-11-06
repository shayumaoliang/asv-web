<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>参数配置</h4>
    <el-form label-position="left" label-width="90px" :model="rpcServerData">
      <el-card class="view">
        <div slot="header" class="header-card">
          <span>asv-rpc 配置</span>
          <el-button v-if="getRole()" size="small" class="delete-icon el-icon-plus" @click="addRpcServerConfig()">添加配置项</el-button>
          <el-button v-if="getRole()" size="small" type="success" class="delete-icon" @click="pushRpcServerConfigConfirm()">提交配置</el-button>
        </div>
        <div v-for="(config, index) of allRpcServerConfig" :key="index">
          <el-form-item class="item-form" label="配置项名">
            <el-input size="small" class="config-input" v-model="config.name"></el-input>
          </el-form-item>
          <el-form-item class="item-form" label="配置项值">
            <el-input size="small" class="config-input" v-model="config.configValue"></el-input>
          </el-form-item>
          <el-form-item class="item-form" label="配置项描述">
            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 5}" class="config-input" v-model="config.description"></el-input>
          </el-form-item>
          <el-form-item class="item-form">
            <el-button v-if="getRole()" size="mini" type="danger" class="delete-icon el-icon-delete" @click="deleteRpcServerConfig(index)">删除该配置项</el-button>
          </el-form-item>
          <hr />
        </div>
      </el-card>
    </el-form>
    <el-dialog title="提交修改配置提醒" :visible.sync="pushRpcServerConfigDialog" size="tiny">
      <span>请确认您的修改没有错误<br /><br />如果提交错误配置项将导致不可预估的后果</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pushRpcServerConfigDialog = false">取 消</el-button>
        <el-button type="primary" @click="pushRpcServerConfig">确 定</el-button>
      </span>
    </el-dialog>
    <el-form label-width="90px" label-position="left" :model="asvServerData">
      <el-card class="view">
        <div slot="header" class="header-card">
          <span>asvServer 配置</span>
          <el-button v-if="getRole()" size="small" class="delete-icon el-icon-plus" @click="addAsvServerConfig()">添加配置项</el-button>
          <el-button v-if="getRole()" size="small" type="success" class="delete-icon" @click="pushAsvServerConfigConfirm()">提交配置</el-button>
        </div>
        <div v-for="(config, index) of allAsvServerConfig" :key="index">
          <el-form-item class="item-form" label="配置项名">
            <el-input size="small" class="config-input" v-model="config.name"></el-input>
          </el-form-item>
          <el-form-item class="item-form" label="配置项值">
            <el-input size="small" class="config-input" v-model="config.configValue"></el-input>
          </el-form-item>
          <el-form-item class="item-form" label="配置项描述">
            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 5}" class="config-input" v-model="config.description"></el-input>
          </el-form-item>
          <el-form-item class="item-form">
            <el-button v-if="getRole()" size="mini" type="danger" class="delete-icon el-icon-delete" @click="deleteAsvServerConfig(index)">删除该配置项</el-button>
          </el-form-item>
          <hr />
        </div>
      </el-card>
    </el-form>
    <el-dialog title="提交修改配置提醒" :visible.sync="pushAsvServerConfigDialog" size="tiny">
      <span>请确认您的修改没有错误<br /><br />如果提交错误配置项将导致不可预估的后果</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pushAsvServerConfigDialog = false">取 消</el-button>
        <el-button type="primary" @click="pushAsvServerConfig">确 定</el-button>
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
      'roles',
      'token'
    ])
  },
  data() {
    return {
      pushRpcServerConfigDialog: false,
      pushAsvServerConfigDialog: false,
      rpcServerData: {},
      asvServerData: {},
      allRpcServerConfig: [],
      allAsvServerConfig: []
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
    async showAllConfig() {
      try {
        this.allAsvServerConfig = []
        this.allRpcServerConfig = []
        const res = await this.$http.get(this.$apiUrl + '/api/allconfigs')
        if (res.data.code === 0) {
          let rpcConfigData
          let asvServerData
          if (res.data.configs[0].config_name === 'asv-rpc') {
            rpcConfigData = res.data.configs[0].config_data.configs
            asvServerData = res.data.configs[1].config_data.configs
          } else {
            rpcConfigData = res.data.configs[1].config_data.configs
            asvServerData = res.data.configs[0].config_data.configs
          }
          for (let i = 0; i < rpcConfigData.length; i++) {
            const allRpcConfig = {}
            allRpcConfig['name'] = rpcConfigData[i].key
            allRpcConfig['configValue'] = rpcConfigData[i].value
            allRpcConfig['description'] = rpcConfigData[i].description
            this.allRpcServerConfig.push(allRpcConfig)
          }
          for (let i = 0; i < asvServerData.length; i++) {
            const allasvConfig = {}
            allasvConfig['name'] = asvServerData[i].key
            allasvConfig['configValue'] = asvServerData[i].value
            allasvConfig['description'] = asvServerData[i].description
            this.allAsvServerConfig.push(allasvConfig)
          }
        } else {
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: '信息获取失败: ' + res.data.msg
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    addRpcServerConfig() {
      this.allRpcServerConfig.push(
        {
          name: null,
          configValue: null,
          description: null
        }
      )
    },
    deleteRpcServerConfig(index) {
      this.allRpcServerConfig.splice(index, 1)
      console.log(this.allRpcServerConfig)
    },
    pushRpcServerConfigConfirm() {
      this.pushRpcServerConfigDialog = true
    },
    async pushRpcServerConfig() {
      try {
        const body = {}
        for (let i = 0; i < this.allRpcServerConfig.length; i++) {
          body[`${this.allRpcServerConfig[i].name}`] = `${this.allRpcServerConfig[i].configValue}`
        }
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/updateconfig?config_name=asv-rpc',
          headers: { 'Content-Type': 'application/json', 'Authorization': this.token },
          data: body
        })
        if (res.data.code === 0) {
          this.pushRpcServerConfigDialog = false
          this.showAllConfig()
          this.$message(
            {
              showClose: true,
              type: 'success',
              message: '提交配置成功'
            }
          )
        } else {
          this.pushRpcServerConfigDialog = false
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: '提交失败: ' + res.data.msg
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    addAsvServerConfig() {
      this.allAsvServerConfig.push(
        {
          name: null,
          configValue: null,
          description: null
        }
      )
    },
    deleteAsvServerConfig(index) {
      this.allAsvServerConfig.splice(index, 1)
    },
    pushAsvServerConfigConfirm() {
      this.pushAsvServerConfigDialog = true
    },
    async pushAsvServerConfig() {
      try {
        const body = {}
        for (let i = 0; i < this.allAsvServerConfig.length; i++) {
          body[`${this.allAsvServerConfig[i].name}`] = `${this.allAsvServerConfig[i].configValue}`
        }
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/updateconfig?config_name=asvserver',
          headers: { 'Content-Type': 'application/json', 'Authorization': this.token },
          data: body
        })
        if (res.data.code === 0) {
          this.pushAsvServerConfigDialog = false
          this.showAllConfig()
          this.$message(
            {
              showClose: true,
              type: 'success',
              message: '提交配置成功'
            }
          )
        } else {
          this.pushAsvServerConfigDialog = false
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: '提交失败: ' + res.data.msg
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.showAllConfig()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 8px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.view {
  width: 45%;
  float: left;
  margin-right: 5%;
}

.delete-icon {
  float: right;
  margin-left: 10px;
}

.config-input {
  width: 70%;
}

.header-card {
  height: 20px;
}

.item-form {
  margin-bottom: 5px;
  margin-top: 5px;
}
</style>
