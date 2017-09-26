<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>未授权服务器</h4>
    <div v-for="(server, index) of servers" :key="server.ip">
      <el-card class="servers">
        <el-form label-width="70px">
          <el-form-item label="状态">
            <icon-svg icon-class="on" v-if="server.status === '运行中'"></icon-svg>
            <icon-svg icon-class="off" v-if="server.status === '已停止'"></icon-svg>
            <icon-svg icon-class="warning" v-if="server.status === '报警中'"></icon-svg>{{ server.status }}
          </el-form-item>
          <el-form-item label="ip地址">
            {{ server.ip }}
          </el-form-item>
          <el-form-item label="配置">
            <el-form-item label="CPU" label-width="80px">
              {{ server.cpu }}核
            </el-form-item>
            <el-form-item label="内存" label-width="80px">
              {{ server.memory }}
            </el-form-item>
            <el-form-item label="操作系统" label-width="80px">
              {{ server.OS }}
            </el-form-item>
            <el-form-item label="磁盘" label-width="80px">
              {{ server.disk }}TB
            </el-form-item>
          </el-form-item>
          <el-form-item label="LOG">
            <el-input :disabled="true" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="server.log">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" placeholder="请输入验证信息" v-model="server.lic">
            </el-input>
            <el-button type="primary"  v-if="getRole()" @click="authorize(index)" class="import-button">授权</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
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
      'roles'
    ])
  },
  data() {
    return {
      verification: null,
      servers: []
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
    async authorize(index) {
      // const body = {
      //   key: 'lic',
      //   value: `${this.servers[index].lic}`
      // }
      // const res = await this.$http.post('http://' + this.servers[index].ip + ':1999/setlicence', body, {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      //   }
      // })
      const res = await this.$http({
        method: 'POST',
        url: 'http://' + this.servers[index].ip + ':1999/setlicence',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({ lic: this.servers[index].lic })
      })
      if (this.servers[index].lic.length !== 0) {
        if (res.data.code === 606) {
          this.$message({
            type: 'error',
            message: '授权码有误，请检查'
          })
        }
        if (res.data.code === 607) {
          this.$message({
            type: 'error',
            message: 'asvrpc 服务未启动'
          })
        } else {
          this.$message({
            type: 'success',
            message: '授权成功'
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '验证信息不能为空'
        })
      }
    },
    async getUnauthorizedServer() {
      const res = await this.$http.get(this.$apiUrl + '/unauthservicesinfo')
      const serverList = res.data.unauth_services
      const serversInfo = []
      for (const ip of serverList) {
        const authorizeServerInfo = await this.$http.get('http://' + ip + ':1999/deviceinfos')
        const statusInfo = await this.$http.get('http://' + ip + ':1999/asv/status')
        const authorizeInfo = await this.$http.get('http://' + ip + ':1999/devicelicenceinfo')
        const rpcStatus = statusInfo.data.asvrpc.status
        const serverStatus = statusInfo.data.asvserver.status
        let realStatus
        if (rpcStatus === 'active' && serverStatus === 'active') {
          realStatus = '运行中'
        } else {
          realStatus = '已停止'
        }
        const serverInfo = {}
        serverInfo['status'] = realStatus
        serverInfo['ip'] = ip
        serverInfo['cpu'] = authorizeServerInfo.data.cpu_info.cpu_number
        serverInfo['memory'] = authorizeServerInfo.data.memory_info.mem_total
        serverInfo['OS'] = authorizeServerInfo.data.os
        serverInfo['log'] = authorizeInfo.data.print
        serverInfo['lic'] = ''
        // serverInfo['disk'] = authorizeInfo.data
        serversInfo.push(serverInfo)
      }
      this.servers = serversInfo
    }
  },
  async mounted() {
    await this.getUnauthorizedServer()
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

.servers {
  width: 31%;
  float: left;
  margin-left: 5px;
  margin-bottom: 5px;
}

.log {
  height: 150px;
}

.import-button {
  margin-top: 10px;
  margin-right: 10%;
  float: right;
}
</style>
