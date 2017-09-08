<template>
  <div class="dashboard-container">
    <div class="overview">
      <p>
        <icon-svg icon-class="vertical"></icon-svg>服务器列表</p>
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
      <p>
        <icon-svg icon-class="vertical"></icon-svg>详情</p>
      <el-card>
        <p>状态：<icon-svg icon-class="on" v-if="status === '运行中'"></icon-svg><icon-svg icon-class="off" v-if="status === '已停止'"></icon-svg>{{ status }}</p>
        <p>ip地址： {{ ip }}</p>
        <p>配置</p>
        <p>CPU：{{ cpu }}核</p>
        <p>内存：{{ memory }}G</p>
        <p>操作系统：{{ OS }}核</p>
        <p>磁盘：{{ disk }}TB</p>
        <p>监控</p>
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
        <!-- <div>
          <span>进程 进程数：{{ process }}</span>
          <p>授权 最大并发：{{ maxConcurrency }} 授权到期时间：{{ ExpireDate }}</p>
        </div> -->
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
                position: 'outside'
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
              { value: 80, name: '已使用' },
              { value: 20, name: '未使用' }

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
                position: 'outside'
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
                position: 'outside'
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
    margin: 30px;
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
  margin-right: 1%;
  margin-left: 0;
  width: 32%;
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
