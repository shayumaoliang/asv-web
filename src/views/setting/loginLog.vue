<template>
  <div class="dashboard-container">
    <h3>
      <icon-svg icon-class="vertical"></icon-svg>登录日志</h3>
    <el-date-picker class="data-picker" v-model="dataRange" type="daterange" align="right" placeholder="选择时间范围查看登录日志" :picker-options="pickerOptions" @change="checkDataRange">
    </el-date-picker>
    <el-button class="data-picker" @click="getAllLoginLog">全部记录</el-button>
    <el-table :data="loginLogsData" height="500">
      <el-table-column prop="name" label="账号"></el-table-column>
      <el-table-column prop="loginTime" label="上线时间"></el-table-column>
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
  },
  data() {
    return {
      loginLogsData: [],
      dataRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近三小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近十二小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 12)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
      }
    }
  },
  methods: {
    timetrans(time) {
      const date = new Date(time * 1000)
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
      const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return Y + M + D + h + m + s
    },
    async getAllLoginLog() {
      this.loginLogsData = []
      this.dataRange = []
      const res = await this.$http.get(this.$apiUrl + '/api/allloginlogs')
      if (res.data.code === 0) {
        const logs = res.data.login_logs
        for (let i = 0; i < logs.length; i++) {
          const log = {}
          log.name = logs[i].login_user_name
          log.loginTime = this.timetrans(logs[i].login_time)
          this.loginLogsData.push(log)
        }
      } else {
        this.$message(
          {
            showClose: true,
            type: 'error',
            message: res.data.msg
          }
        )
      }
    },
    async checkDataRange(date) {
      try {
        this.loginLogsData = []
        if (date.length !== 0) {
          const beginTime = Date.parse(date[0]) / 1000
          const endTime = Date.parse(date[1]) / 1000
          const res = await this.$http.get(this.$apiUrl + '/api/loginlogs_between?begin_time=' + beginTime + '&end_time=' + endTime)
          if (res.data.code === 0) {
            const logs = res.data.login_logs
            for (let i = 0; i < logs.length; i++) {
              const log = {}
              log.name = logs[i].login_user_name
              log.loginTime = this.timetrans(logs[i].login_time)
              this.loginLogsData.push(log)
            }
          } else {
            if (res.data.code !== 1102) {
              this.$message(
                {
                  showClose: true,
                  type: 'error',
                  message: res.data.msg
                }
              )
            }
          }
        } else {
          this.getAllLoginLog()
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  async mounted() {
    await this.getAllLoginLog()
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

.data-picker {
  float: right;
}
</style>
