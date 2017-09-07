<template>
  <div class="dashboard-container">
    <div class="overview">
      <p><icon-svg icon-class="vertical"></icon-svg>服务器列表</p>
      <el-card>
          <div v-for="(server, index) in alarmServers" :key="index" class="item" @click="showAlarmServers(index)">
            <a><icon-svg icon-class="warning" ></icon-svg>{{ server.ip }}</a>
          </div>
          <div v-for="(server,index) in runningServers" :key="index" class="item" @click="showRunningServers(index)">
            <a><icon-svg icon-class="on" ></icon-svg>{{ server.ip }}</a>
          </div>
          <div v-for="(server, index) in stopedServers" :key="index" class="item" @click="showStopedServers(index)">
            <a><icon-svg icon-class="off" ></icon-svg>{{ server.ip }}</a>
          </div>
      </el-card>
    </div>
    <div class="detail">
      <p><icon-svg icon-class="vertical"></icon-svg>详情</p>
        <el-card>
          <p>ip: {{ ip }}</p>
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
      ip: null,
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
  width: 30%;
  float: left;
  height: auto;
}
.detail {
  float: left;
  width: 68%;
  height: auto;
}
.item {
  padding: 5px 10px;
}
</style>
