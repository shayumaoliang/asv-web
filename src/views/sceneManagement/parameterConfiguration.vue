<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>参数配置</h4>
    <el-form label-width="10px" label-position="left" :model="rpcServerData">
      <el-card class="view">
        <div slot="header" class="header-card">
          <span>asv-rpc 配置</span>
          <el-button v-if="getRole()" size="small" class="delete-icon el-icon-plus" @click="addRpcServerConfig()">添加配置项</el-button>
          <el-button v-if="getRole()" size="small" type="success" class="delete-icon" @click="pushRpcServerConfigConfirm()">提交配置</el-button>
        </div>
        <div v-for="(config, index) of allRpcServerConfig" :key="index">
          <el-form-item class="item-form">
            <el-input size="small" class="config-input" v-model="config.name">
              <template slot="prepend"> 配置项名</template>
            </el-input>
            <el-input size="small" class="config-input" v-model="config.configValue">
              <template slot="prepend"> 配置项值</template>
            </el-input>
            <el-button v-if="getRole()" size="mini" type="primary" class="delete-icon el-icon-delete" @click="deleteRpcServerConfig(index)">删除该配置项</el-button>
          </el-form-item>
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
    <el-form label-width="10px" label-position="left" :model="asvServerData">
      <el-card class="view">
        <div slot="header" class="header-card">
          <span>asvServer 配置</span>
          <el-button v-if="getRole()" size="small" class="delete-icon el-icon-plus" @click="addAsvServerConfig()">添加配置项</el-button>
          <el-button v-if="getRole()" size="small" type="success" class="delete-icon" @click="pushAsvServerConfigConfirm()">提交配置</el-button>
        </div>
        <div v-for="(config, index) of allAsvServerConfig" :key="index">
          <el-form-item class="item-form">
            <el-input size="small" class="config-input" v-model="config.name">
              <template slot="prepend"> 配置项名</template>
            </el-input>
            <el-input size="small" class="config-input" v-model="config.configValue">
              <template slot="prepend"> 配置项值</template>
            </el-input>
            <el-button v-if="getRole()" size="mini" type="primary" class="delete-icon el-icon-delete" @click="deleteAsvServerConfig(index)">删除该配置项</el-button>
          </el-form-item>
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
        const res = await this.$http.get(this.$apiUrl + '/api/allconfigs')
        if (res.data.code === 0) {
          let rpcConfigData
          let asvServerData
          if (res.data.configs[0].config_name === 'asv-rpc') {
            rpcConfigData = res.data.configs[0].conf_data
            asvServerData = res.data.configs[1].conf_data
          } else {
            rpcConfigData = res.data.configs[0].conf_data
            asvServerData = res.data.configs[1].conf_data
          }
          for (let i = 0; i < Object.keys(rpcConfigData).length; i++) {
            const allRpcConfig = {}
            allRpcConfig['name'] = Object.keys(rpcConfigData)[i]
            allRpcConfig['configValue'] = Object.values(rpcConfigData)[i]
            this.allRpcServerConfig.push(allRpcConfig)
          }
          for (let i = 0; i < Object.keys(asvServerData).length; i++) {
            const allasvConfig = {}
            allasvConfig['name'] = Object.keys(asvServerData)[i]
            allasvConfig['configValue'] = Object.values(asvServerData)[i]
            this.allAsvServerConfig.push(allasvConfig)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    addRpcServerConfig() {
      this.allRpcServerConfig.push(
        {
          name: null,
          configValue: null
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
        }
      } catch (e) {
        console.log(e)
      }
    },
    addAsvServerConfig() {
      this.allAsvServerConfig.push(
        {
          name: null,
          configValue: null
        }
      )
    },
    deleteAsvServerConfig(index) {
      this.allAsvServerConfig.splice(index, 1)
    },
    pushAsvServerConfigConfirm() {
      this.pushRpcServerConfigDialog = true
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
  margin-bottom: 10px;
}
</style>
