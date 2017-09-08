<template>
  <div class="dashboard-container">
    <div class="overview">
      <h4><icon-svg icon-class="vertical"></icon-svg>服务器列表</h4>
      <el-card>
        <div v-for="(server, index) in alarmServers" :key="index" class="item" @click="showAlarmServers(index)">
          <a>
            <icon-svg icon-class="warning"></icon-svg>{{ server.ip }}</a>
        </div>
        <div v-for="(server,index) in runningServers" :key="index" class="item" @click="showRunningServers(index)">
          <a>
            <icon-svg icon-class="on"></icon-svg>{{ server.ip }}</a>
        </div>
        <div v-for="(server, index) in stopedServers" :key="index" class="item" @click="showStopedServers(index)">
          <a>
            <icon-svg icon-class="off"></icon-svg>{{ server.ip }}</a>
        </div>
      </el-card>
    </div>
    <div class="detail">
      <h4><icon-svg icon-class="vertical"></icon-svg>详情</h4>
      <el-card>
        <el-form ref="serverStatus" :model="serverStatus" label-width="70px">
          <el-form-item label="状态">
            <icon-svg icon-class="on" v-if="status === '运行中'"></icon-svg><icon-svg icon-class="off" v-if="status === '已停止'"></icon-svg><icon-svg icon-class="warning" v-if="status === '报警中'"></icon-svg>{{ status }}
          </el-form-item>
          <el-form-item label="ip地址">
            {{ ip }}
          </el-form-item>
          <el-form-item label="配置">
            <el-form-item label="CPU" label-width="80px">
              {{ cpu }}核
            </el-form-item>
            <el-form-item label="内存" label-width="80px">
              {{ memory }}G
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
            <span>进程数{{ process }}</span>
            <el-button type="text" style="float: right; margin-right:80%;" @click="showDetail = true">查看详情</el-button>
          </el-form-item>
          <el-dialog title="所有进程" :visible.sync="showDetail">
              <el-table :data="allProcess">
                <el-table-column width="80" property="PID" label="PID"></el-table-column>
                <el-table-column width="100" property="USER" label="USER"></el-table-column>
                <el-table-column width="80" property="CPU" label="CPU"></el-table-column>
                <el-table-column width="80" property="EME" label="EME"></el-table-column>
                <el-table-column width="100" property="START" label="START"></el-table-column>
                <el-table-column width="100" property="TIME" label="TIME"></el-table-column>
                <el-table-column property="COMMAND" label="COMMAND"></el-table-column>
              </el-table>
          </el-dialog>
          <el-form-item label="监控" label-width="70px">
            <span>最大并发：{{ maxConcurrency }}</span><span style="float: right; margin-right:70%;">授权到期时间：{{ ExpireDate }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
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
      showDetail: false,
      allProcess: [
        {
          PID: null,
          USER: null,
          CPU: null,
          EME: null,
          START: null,
          TIME: null,
          COMMAND: null
        },
        {
          PID: null,
          USER: null,
          CPU: null,
          EME: null,
          START: null,
          TIME: null,
          COMMAND: null
        }
      ],
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
              { value: 80.2, name: '已使用' },
              { value: 19.8, name: '未使用' }

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
              { value: 50, name: '已使用' },
              { value: 50, name: '未使用' }

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
              { value: 20, name: '已使用' },
              { value: 80, name: '未使用' }

            ]
          }
        ]
      },
      ip: null,
      status: '已停止',
      cpu: null,
      memory: null,
      OS: null,
      disk: null,
      process: null,
      maxConcurrency: null,
      ExpireDate: null,
      serverStatus: {
        status: '运行中',
        ip: '192.168.10.10',
        cpu: 8,
        memory: 40,
        OS: 'centos7',
        disk: 12.3
      },
      runningServers: [
        {
          ip: '192.168.11.1'
        },
        {
          ip: '192.168.11.14'
        }
      ],
      stopedServers: [
        {
          ip: '192.168.11.13'
        },
        {
          ip: '192.168.11.12'
        },
        {
          ip: '192.168.11.16'
        },
        {
          ip: '192.168.11.16'
        },
        {
          ip: '192.168.11.17'
        },
        {
          ip: '192.168.11.18'
        },
        {
          ip: '192.168.11.19'
        },
        {
          ip: '192.168.11.101'
        },
        {
          ip: '192.168.11.100'
        },
        {
          ip: '192.168.11.103'
        },
        {
          ip: '192.168.11.113'
        }
      ],
      alarmServers: [
        {
          ip: '192.168.11.11'
        }
      ]
    }
  },
  methods: {
    showAlarmServers(index) {
      this.ip = this.alarmServers[index].ip
    },
    showRunningServers(index) {
      this.ip = this.runningServers[index].ip
    },
    showStopedServers(index) {
      this.ip = this.stopedServers[index].ip
    }
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
</style>
