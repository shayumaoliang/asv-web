<template>
  <div class="dashboard-container">
    <div class="overview">
      <p class="title">
        <icon-svg icon-class="vertical"></icon-svg>综述</p>
      <div class="card-group">
        <el-card class="card-list">
          <p>
            <icon-svg class="line-card" icon-class="server"></icon-svg> 服务器：{{allServer}}</p>
        </el-card>
        <el-card class="card-list">
          <p>
            <icon-svg class="line-card" icon-class="running"></icon-svg> 运行中：{{running}}</p>
        </el-card>
        <el-card class="card-list">
          <p>
            <icon-svg class="line-card" icon-class="alarm"></icon-svg> 报警中：{{alarm}}</p>
        </el-card>
      </div>
    </div>
    <div class="detail">
      <p class="title">
        <icon-svg icon-class="vertical"></icon-svg>详情</p>
      <el-card v-for="(serverGroup, index) of allServerGroups" :key="index" class="group-card">
        <div slot="header">
          <icon-svg icon-class="group"></icon-svg>&nbsp&nbsp&nbsp{{ allServerGroups[index].groupName }}，&nbsp&nbsp&nbsp共&nbsp&nbsp{{ serverGroup.allserverNumber }}&nbsp&nbsp台服务器
        </div>
        <el-card class="bigCard">
          <div slot="header" class="clearfix">
            <span class="line">
              <icon-svg icon-class="running"></icon-svg> 运行中：{{ allServerGroups[index].runningNumber }}</span>
          </div>
          <div v-for="(server, onServerIndex) of allServerGroups[index].runningServers" :key="onServerIndex" class="running item">
            <a @click="showRunningServerInfo(onServerIndex, index)">
              <icon-svg icon-class="on"></icon-svg>{{ server.machine_name }}</a>
          </div>
        </el-card>
        <el-card class="bigCard">
          <div slot="header" class="clearfix">
            <span class="line">
              <icon-svg icon-class="stop"></icon-svg> 已停止：{{ allServerGroups[index].stopedNumber }}</span>
          </div>
          <div v-for="(server, offServerIndex) of allServerGroups[index].stopedServers" :key="offServerIndex" class="stoped item">
            <a @click="showStopedServerInfo(offServerIndex, index)">
              <icon-svg icon-class="off"></icon-svg>{{ server.machine_name }}</a>
          </div>
        </el-card>
        <el-card class="bigCard">
          <div slot="header" class="clearfix">
            <span class="line">
              <icon-svg icon-class="alarm"></icon-svg> 报警中：{{ allServerGroups[index].alarmingNumber }}</span>
          </div>
          <div v-for="(server, alarmIndex) of allServerGroups[index].alarmingServers" :key="alarmIndex" class="stoped item">
            <router-link to="serverConfiguration/server">
              <icon-svg icon-class="warning"></icon-svg>{{ server.machine_name }}</router-link>
          </div>
        </el-card>
      </el-card>
    </div>
  </div>
</template>

<script>
import http from '@/api/http.js'
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'roles',
      'name',
      'token'
    ])
  },
  data() {
    return {
      http,
      switchValue: '',
      allServer: null,
      running: null,
      alarm: 0,
      stoped: null,
      runningServers: [],
      stopedServers: [],
      alarmServers: [],
      allServerGroups: []
    }
  },
  methods: {
    showRunningServerInfo(onServerIndex, index) {
      this.$router.push({
        name: '服务器',
        params: {
          groupIndex: index,
          serverIndex: onServerIndex,
          srverId: this.allServerGroups[index].runningServers[onServerIndex].id,
          status: 'on'
        }
      })
    },
    showStopedServerInfo(offServerIndex, index) {
      this.$router.push({
        name: '服务器',
        params: {
          groupIndex: index,
          serverIndex: offServerIndex + this.allServerGroups[index].runningNumber,
          srverId: this.allServerGroups[index].stopedServers[offServerIndex].id,
          status: 'off'
        }
      })
    },
    async getServerList() {
      const res = await this.$http.get(this.$apiUrl + '/api/allmachinegroups')
      // const res = await this.$http.get(this.$apiUrl + '/servicesinfo')
      const serverGroups = res.data.machineGroups
      for (let i = 0; i < serverGroups.length; i++) {
        const allServer = Number(serverGroups[i].machine_total)
        const runningNumber = Number(serverGroups[i].active_total)
        this.allServer += allServer
        this.running += runningNumber
        const allServerGroups = {}
        allServerGroups['runningServers'] = serverGroups[i].active_machines
        allServerGroups['stopedServers'] = serverGroups[i].inactive_machines
        // allServerGroups['alarmingServers'] = serverGroups[i].alarm_machines
        allServerGroups['allserverNumber'] = serverGroups[i].machine_total
        allServerGroups['runningNumber'] = serverGroups[i].active_total
        allServerGroups['stopedNumber'] = serverGroups[i].inactive_total
        allServerGroups['groupName'] = serverGroups[i].machine_group_name
        this.allServerGroups.push(allServerGroups)
      }
    }
  },
  mounted() {
    this.getServerList()
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

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.title {
  font-weight: bold;
}

.line {
  line-height: 25px;
  float: left;
  margin-left: 2%;
  font-size: 18px;
  font-weight: bold;
}

.running {
  font-size: 14px;
  float: left;
}

.stoped {
  font-size: 14px;
  float: left;
}

.item {
  padding: 18px 18px;
}

.overview {
  margin-bottom: 5px;
}

.card-group {
  margin-bottom: 5px;
}

.card-list {
  width: 31%;
  height: 100px;
  float: left;
}

.line-card {
  margin-left: 5%;
}

.detail {
  margin-top: 10px;
  float: left;
  width: 100%
}

.group-card {
  width: 45%;
  margin-left: 1.5%;
  float: left;
  margin-bottom: 10px;
}

.bigCard {
  width: 100%;
  height: auto;
  margin-top: 5px;
}
</style>
