<template>
  <div class="dashboard-container">
    <div class="overview">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>服务器列表</h4>
      <el-card>
        <el-button v-if="getRole()" type="text" style="margin-left: 10%;margin-bottom: 5px;" @click="addServerGroupConfirm">添加服务器分组</el-button>
        <el-menu :default-active="defaultActive" unique-opened mode="vertical" @open="handleOpen" @close="handleClose" @select="getCurrentServer">
          <div v-for="(serverGroup, index) of allServerGroups" :key="index">
            <el-submenu :index="`${index}`">
              <template slot="title">
                <icon-svg icon-class="group"></icon-svg>&nbsp&nbsp&nbsp{{ serverGroup.groupName }}
              </template>
              <div v-for="(sever, serverIndex) of allServerGroups[index].servers" :key="serverIndex">
                <el-menu-item :index="`${index}-${serverIndex}`">
                  <icon-svg :icon-class="sever.onOffIcon"></icon-svg>&nbsp&nbsp&nbsp{{ sever.machine_name }}
                </el-menu-item>
              </div>
            </el-submenu>
          </div>
        </el-menu>
      </el-card>
    </div>
    <el-dialog size="tiny" title="添加服务器组" :visible.sync="addServerGroupDialog">
      <el-input v-model="addServerGroupData">
        <template slot="prepend">分组名称</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addServerGroupDialog = false">取 消</el-button>
        <el-button type="primary" @click="addServerGroup">确 定</el-button>
      </span>
    </el-dialog>
    <div class="detail">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>详情</h4>
      <el-card v-if="showServer === true">
        <el-form ref="serverStatus" :model="serverStatus" label-width="70px">
          <el-form-item label="状态">
            <icon-svg :icon-class="onOffIcon"></icon-svg>{{ status }}
            <el-button v-if="getRole()" v-loading="onOffLoading" class="onOff-button" @click="onOffServer">
              <icon-svg icon-class="onOff"></icon-svg> {{ onOff }}</el-button>
            <el-button v-if="getRole()" class="drop-button" @click="editServerNameConfirm">修改服务器名称</el-button>
            <el-button v-if="getRole()" class="drop-button" @click="dropOutOfGroupConfirm">从当前分组中移除此服务器</el-button>
            <el-dialog size="tiny" title="移除" :visible.sync="dropOutOfGroupDialog">
              <span>是否确定将此服务器从该服务器组中移除</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dropOutOfGroupDialog = false">取 消</el-button>
                <el-button type="primary" @click="dropOutOfGroup">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog size="tiny" title="修改服务器名称" :visible.sync="editServerNameDialog">
              <el-input v-model="editServerNameData">
                <template slot="prepend">服务器</template>
              </el-input>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editServerNameDialog = false">取 消</el-button>
                <el-button type="primary" @click="editServerName">确 定</el-button>
              </span>
            </el-dialog>
          </el-form-item>
          <el-form-item label="服务器">
            {{ ip }}
          </el-form-item>
          <el-form-item label="配置">
            <el-form-item label="CPU" label-width="80px">
              {{ cpu }}核
            </el-form-item>
            <el-form-item label="内存" label-width="80px">
              {{ memory }}
            </el-form-item>
            <el-form-item label="操作系统" label-width="80px">
              {{ OS }}
            </el-form-item>
            <el-form-item label="磁盘" label-width="80px">
              {{ disk }}TB
            </el-form-item>
          </el-form-item>
          <el-form-item label="监控" label-width="70px">
            <div class="chart-list">
              <div class="echarts">
                <IEcharts :option="cpuStatus"></IEcharts>
                <p class="title">CPU</p>
              </div>
              <div class="echarts">
                <IEcharts :option="memoryStatus"></IEcharts>
                <p class="title">内存</p>
              </div>
              <div class="echarts">
                <IEcharts :option="diskStatus"></IEcharts>
                <p class="title">磁盘</p>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="进程" label-width="70px" style="margin-top: 50px;">
            <span>进程数 {{ process }}</span>
            <el-button type="text" style="float: right; margin-right:80%;" @click="showallProscess">查看详情</el-button>
          </el-form-item>
          <el-dialog title="所有进程" :visible.sync="showDetail">
            <el-table :data="allProcess" height="500">
              <el-table-column width="100" prop="pid" label="PID"></el-table-column>
              <el-table-column width="80" prop="user" label="USER"></el-table-column>
              <el-table-column width="80" prop="cpu" label="CPU"></el-table-column>
              <el-table-column width="80" prop="mem" label="MEM"></el-table-column>
              <el-table-column width="90" prop="start" label="START"></el-table-column>
              <el-table-column width="80" prop="time" label="TIME"></el-table-column>
              <el-table-column prop="command" label="COMMAND"></el-table-column>
            </el-table>
          </el-dialog>
          <el-form-item label="授权" label-width="70px">
            <span>最大并发：{{ maxConcurrency }}</span>
            <span style="float: right; margin-right:60%;">授权到期时间：{{ ExpireDate }}</span>
          </el-form-item>
        </el-form>
      </el-card>
      <el-form ref="serverStatus" :model="serverStatus" label-width="70px">
        <el-card v-if="showServerGroup === true">
          <div slot="header" class="clearfix">
            <el-button size="small" type="primary" @click="addServerConfirm">{{ '添加服务器' }}</el-button>
            <el-button size="small" type="primary" @click="editServerGroupConfirm">{{ '修改服务器组名称' }}</el-button>
            <el-button size="small" type="primary" @click="deletetServerGroupConfirm">{{ '删除该服务器组' }}</el-button>
          </div>
          <span>当前分组下共有{{ numberOfServers }}个服务器</span>
        </el-card>
        <el-card v-if="showTips === true">
          <span>点击左侧服务器列表查看服务器详情</span>
        </el-card>
      </el-form>
      <el-dialog size="tiny" title="添加服务器" :visible.sync="addServerDialog">
        <el-input v-model="addServerData">
          <template slot="prepend">服务器地址</template>
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addServerDialog = false">取 消</el-button>
          <el-button type="primary" @click="addServer">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog size="tiny" title="修改服务器组" :visible.sync="editServerGroupDialog">
        <el-input v-model="editServerGroupData">
          <template slot="prepend">服务器组名称</template>
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editServerGroupDialog = false">取 消</el-button>
          <el-button type="primary" @click="editServerGroup">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog size="tiny" title="删除" :visible.sync="deletetServerGroupDialog">
        <span>是否删除该分组</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deletetServerGroupDialog = false">取 消</el-button>
          <el-button type="primary" @click="deletetGroup">确 定</el-button>
        </span>
      </el-dialog>
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
      'roles',
      'token'
    ])
  },
  data() {
    return {
      defaultActive: '0',
      onOffIcon: null,
      numberOfServers: null,
      showServer: false,
      showServerGroup: false,
      showTips: true,
      addServerGroupDialog: false,
      editServerGroupDialog: false,
      addServerDialog: false,
      deletetServerGroupDialog: false,
      dropOutOfGroupDialog: false,
      editServerNameDialog: false,
      editServerNameData: null,
      addServerGroupData: null,
      addServerData: null,
      editServerGroupData: null,
      allServerGroups: [],
      showDetail: false,
      allProcess: [],
      onOff: '开启服务',
      cpuStatus: {
        title: {
          show: false,
          text: 'CPU'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {d}%'
        },
        series: [
          {
            name: 'CPU',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: 'inner'
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [
              { value: null, name: '已使用' },
              { value: null, name: '未使用' }

            ]
          }
        ]
      },
      memoryStatus: {
        title: {
          show: false,
          text: '内存'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {d}%'
        },
        series: [
          {
            name: '内存',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: 'inner'
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [
              { value: null, name: '已使用' },
              { value: null, name: '未使用' }

            ]
          }
        ]
      },
      diskStatus: {
        title: {
          show: false,
          text: '磁盘',
          position: 'botton'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {d}%'
        },
        series: [
          {
            name: '磁盘',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'inner'
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [
              { value: 0, name: '已使用' },
              { value: 100, name: '未使用' }

            ]
          }
        ]
      },
      ip: null,
      onOffLoading: null,
      status: null,
      cpu: null,
      memory: null,
      OS: null,
      disk: null,
      process: null,
      maxConcurrency: null,
      ExpireDate: null,
      serverStatus: {},
      runningServers: [],
      stopedServers: [],
      alarmServers: [],
      allStopedServers: [],
      allRunningServers: [],
      currentServerGroup: null,
      groupIndex: null,
      serverIndex: null
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
    addServerGroupConfirm() {
      this.addServerGroupData = null
      this.addServerGroupDialog = true
    },
    addServerConfirm() {
      this.addServerData = null
      this.addServerDialog = true
    },
    editServerGroupConfirm() {
      this.editServerGroupDialog = true
    },
    editServerNameConfirm() {
      this.editServerNameDialog = true
    },
    deletetServerGroupConfirm() {
      this.deletetServerGroupDialog = true
    },
    dropOutOfGroupConfirm() {
      this.dropOutOfGroupDialog = true
    },
    async editServerName() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/' + this.allServerGroups[this.groupIndex].groupName + '/updatemachine',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token
          },
          data: qs.stringify({
            machine_id: this.allServerGroups[this.groupIndex].servers[this.serverIndex].id,
            machine_name: this.editServerNameData
          })
        })
        if (res.data.code === 0) {
          location.reload()
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: res.data.msg
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          type: 'error',
          message: e
        })
      }
    },
    async editServerGroup() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/updatemachinegroup',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token
          },
          data: qs.stringify({
            machine_group_id: this.allServerGroups[this.groupIndex].id,
            machine_group_name: this.editServerGroupData
          })
        })
        if (res.data.code === 0) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '修改成功'
          })
          // location.reload()
          this.allServerGroups[this.groupIndex].groupName = this.editServerGroupData
          this.editServerGroupDialog = false
        } else {
          this.$message({
            showClose: true,
            type: 'success',
            message: res.data.msg
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          type: 'error',
          message: e
        })
      }
    },
    async addServerGroup() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/createmachinegroup',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token
          },
          data: qs.stringify({
            machine_group_name: this.addServerGroupData
          })
        })
        if (res.data.code === 0) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '创建成功'
          })
          this.allServerGroups.push({
            groupName: this.addServerGroupData
          })
          this.addServerGroupDialog = false
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: res.data.msg
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          type: 'error',
          message: e
        })
      }
    },
    async addServer() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/' + this.currentServerGroup + '/createmachine',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token
          },
          data: qs.stringify({
            machine_name: this.addServerData
          })
        })
        if (res.data.code === 0) {
          await this.$message({
            showClose: true,
            type: 'success',
            message: '添加成功'
          })
          this.addServerDialog = false
          this.$router.go({ path: this.$route.path })
          // this.$route.reload()
          // this.allServerGroups[this.groupIndex].servers.push({
          //   machine_name: this.addServerData
          // })
          // this.addServerDialog = false
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: res.data.msg
          })
        }
      } catch (error) {
        this.$message({
          showClose: true,
          type: 'error',
          message: error
        })
      }
    },
    async getCurrentServer(key) {
      this.showServer = true
      this.showServerGroup = false
      this.showTips = false
      const any = key.split('-')
      const groupIndex = Number(any[0])
      const serverIndex = Number(any[1])
      this.ip = this.allServerGroups[groupIndex].servers[serverIndex].machine_name
      this.currentServerGroup = this.allServerGroups[groupIndex].groupName
      this.groupIndex = groupIndex
      this.serverIndex = serverIndex
      if (this.allServerGroups[groupIndex].servers[serverIndex].onOffIcon === 'on') {
        this.onOff = '关闭服务'
        this.onOffIcon = 'on'
        this.status = '已开启'
      } else {
        if (this.allServerGroups[groupIndex].servers[serverIndex].onOffIcon === 'off') {
          this.onOff = '开启服务'
          this.onOffIcon = 'off'
          this.status = '未开启'
        } else {
          this.onOff = '关闭服务'
          this.status = '正在报警'
          // this.onOffIcon = 'warmming'
        }
      }
      await this.showInfo()
    },
    openOrclose(key, keyPath) {
      this.showServer = false
      this.showServerGroup = true
      this.showTips = false
      this.numberOfServers = this.allServerGroups[key].servers.length
      this.currentServerGroup = this.allServerGroups[key].groupName
      this.groupIndex = key
    },
    handleOpen(key, keyPath) {
      this.openOrclose(key, keyPath)
    },
    handleClose(key, keyPath) {
      this.openOrclose(key, keyPath)
    },
    async onOffServer() {
      try {
        if (this.onOff === '关闭服务') {
          this.onOffLoading = true
          const rpcRes = await this.$http.get('http://' + this.ip + ':1999/asvrpc/control?op=stop')
          const serverRes = await this.$http.get('http://' + this.ip + ':1999/asvserver/control?op=stop')
          if (rpcRes.data.code === 0 && serverRes.data.code === 0) {
            await this.getServerList()
            await this.showInfo()
            this.onOff = '开启服务'
            this.onOffIcon = 'off'
            this.status = '未开启'
            this.$message({
              showClose: true,
              type: 'success',
              message: '服务已关闭'
            })
            this.onOffLoading = false
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: rpcRes.data.msg
            })
          }
        } else {
          this.onOffLoading = true
          const rpcRes = await this.$http.get('http://' + this.ip + ':1999/asvrpc/control?op=start')
          const serverRes = await this.$http.get('http://' + this.ip + ':1999/asvserver/control?op=start')
          if (rpcRes.data.code === 0 && serverRes.data.code === 0) {
            await this.getServerList()
            await this.showInfo()
            this.onOff = '关闭服务'
            this.onOffIcon = 'on'
            this.status = '已开启'
            this.$message({
              showClose: true,
              type: 'success',
              message: '服务已开启'
            })
            this.onOffLoading = false
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: rpcRes.data.msg
            })
          }
        }
      } catch (e) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '服务未安装'
        })
        this.onOffLoading = false
      }
    },
    async dropOutOfGroup() {
      try {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/' + this.currentServerGroup + '/deletemachine?machine_name=' + this.ip
        })
        if (res.data.code === 0) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '移除成功'
          })
          // location.reload()
          this.allServerGroups[this.groupIndex].servers.splice(this.serverIndex, 1)
          this.dropOutOfGroupDialog = false
          this.showServer = false
          this.showServerGroup = true
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: res.data.msg
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          type: 'success',
          message: e
        })
      }
    },
    async getServerList() {
      this.allServerGroups = []
      try {
        const res = await this.$http.get(this.$apiUrl + '/api/allmachinegroups')
        const allServerGroups = res.data.machineGroups
        for (let i = 0; i < allServerGroups.length; i++) {
          const onServers = allServerGroups[i].active_machines
          for (let index = 0; index < onServers.length; index++) {
            onServers[index]['onOffIcon'] = 'on'
          }
          const offServers = allServerGroups[i].inactive_machines
          for (let index = 0; index < offServers.length; index++) {
            offServers[index]['onOffIcon'] = 'off'
          }
          onServers.push.apply(onServers, offServers)
          const serverGroup = {}
          serverGroup['groupName'] = allServerGroups[i].machine_group_name
          serverGroup['servers'] = onServers
          serverGroup['id'] = allServerGroups[i].id
          this.allServerGroups.push(serverGroup)
        }
      } catch (e) {
        this.$message({
          showClose: true,
          type: 'error',
          message: e
        })
      }
    },
    async deletetGroup() {
      try {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/deletemachinegroup?machine_group_name=' + this.allServerGroups[this.groupIndex].groupName
        })
        if (res.data.code === 0) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功'
          })
          this.allServerGroups.splice(this.groupIndex, 1)
          this.deletetServerGroupDialog = false
          await this.getServerList()
          // location.reload()
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: res.data.msg
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          type: 'error',
          message: e
        })
      }
    },
    async showInfo() {
      try {
        this.ExpireDate = null
        this.maxConcurrency = null
        this.cpu = null
        this.memory = null
        this.OS = null
        this.process = null
        this.cpuStatus = {
          title: {
            show: false,
            text: 'CPU'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {d}%'
          },
          series: [
            {
              name: 'CPU',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: true,
              label: {
                normal: {
                  show: true,
                  position: 'inner'
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: [
                { value: 0, name: '已使用' },
                { value: 100, name: '未使用' }

              ]
            }
          ]
        }
        this.memoryStatus = {
          title: {
            show: false,
            text: '内存'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {d}%'
          },
          series: [
            {
              name: '内存',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: true,
              label: {
                normal: {
                  show: true,
                  position: 'inner'
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: [
                { value: 0, name: '已使用' },
                { value: 100, name: '未使用' }

              ]
            }
          ]
        }
        const info = await this.$http.get('http://' + this.ip + ':1999/deviceinfos')
        const authorizeInfo = await this.$http.get('http://' + this.ip + ':1999/devicelicenceinfo')
        if (info.data.code === 0 && authorizeInfo.data.code === 0) {
          const authorize = authorizeInfo.data
          this.ExpireDate = authorize.exp
          this.maxConcurrency = authorize.max_con
          const serverInfo = info.data
          this.cpu = serverInfo.cpu_info.cpu_number
          this.memory = serverInfo.memory_info.mem_total
          this.OS = serverInfo.os
          this.process = serverInfo.proc_num
          this.cpuStatus.series[0].data[0].value = parseFloat(serverInfo.cpu_info.cpu_busy) * 100
          this.cpuStatus.series[0].data[1].value = parseFloat(serverInfo.cpu_info.cpu_idle) * 100
          this.memoryStatus.series[0].data[0].value = parseFloat(serverInfo.memory_info.mem_used) * 100
          this.memoryStatus.series[0].data[1].value = parseFloat(serverInfo.memory_info.mem_free) * 100
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: info.data.msg
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '未部署服务'
        })
      }
    },
    async showallProscess() {
      const info = await this.$http.get('http://' + this.ip + ':1999/procinfo')
      this.allProcess = info.data
      this.showDetail = true
    },
    showCurrentServerInfo() {
      if (Object.keys(this.$route.params).length > 0) {
        const server = this.allServerGroups[this.$route.params.groupIndex].servers
        for (let i = 0; i < server.length; i++) {
          if (server[i].id === this.$route.params.srverId) {
            this.ip = server[i].machine_name
          }
        }
        if (this.$route.params.status === 'on') {
          this.onOff = '关闭服务'
          this.onOffIcon = 'on'
          this.status = '已开启'
        } else {
          if (this.$route.params.status === 'off') {
            this.onOff = '开启服务'
            this.onOffIcon = 'off'
            this.status = '未开启'
          } else {
            if (this.$route.params.status === 'alarm') {
              this.onOff = '关闭服务'
              this.status = '正在报警'
              // this.onOffIcon = 'warmming'
            }
          }
        }
        this.showServer = true
        this.showServerGroup = false
        this.showTips = false
        this.showInfo()
      }
    }
  },
  async mounted() {
    await this.getServerList()
    await this.showCurrentServerInfo()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.overview {
  margin-bottom: 5px;
  width: 20%;
  float: left;
  height: auto;
}

.detail {
  float: left;
  width: 78%;
  height: auto;
}

.item {
  padding: 5px 10px;
}

.echarts {
  float: left;
  margin-right: 0;
  margin-left: 0;
  width: 20%;
  height: 160px;
}

.chart-list {
  margin-top: 20px;
  width: 100%;
  margin-bottom: 20px;
}

.p {
  margin-top: 2px;
  padding: 1px;
}

.title {
  margin-left: 45%;
  margin-bottom: 20px;
}

.onOff-button {
  margin-left: 10%;
}

.drop-button {
  margin-right: 10px;
}
</style>
