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
      <el-card class="bigCard">
        <div slot="header" class="clearfix">
          <span class="line">
            <icon-svg icon-class="running"></icon-svg> 运行中：{{ running }}</span>
        </div>
        <div v-for="(server, index) in runningServers" :key="index" class="running item">
          <router-link to="serverConfiguration/server">
            <icon-svg icon-class="on"></icon-svg>{{ server }}</router-link>
        </div>
      </el-card>
      <el-card class="bigCard">
        <div slot="header" class="clearfix">
          <span class="line">
            <icon-svg icon-class="stop"></icon-svg> 已停止：{{ stoped }}</span>
        </div>
        <div v-for="(server, index) in stopedServers" :key="index" class="stoped item">
          <router-link to="serverConfiguration/server">
            <icon-svg icon-class="off"></icon-svg>{{ server }}</router-link>
        </div>
      </el-card>
      <el-card class="bigCard">
        <div slot="header" class="clearfix">
          <span class="line">
            <icon-svg icon-class="alarm"></icon-svg> 报警中：{{ alarm }}</span>
        </div>
        <div v-for="(server, index) in alarmServers" :key="index" class="stoped item">
          <router-link to="serverConfiguration/server">
            <icon-svg icon-class="warning"></icon-svg>{{ server.ip }}</router-link>
        </div>
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
      switchValue: '',
      allServer: null,
      running: null,
      alarm: null,
      stoped: null,
      runningServers: [],
      stopedServers: [],
      alarmServers: []
    }
  },
  methods: {
    switchChange() {

    },
    async getServerList() {
      const res = await this.$http.get(this.$apiUrl + '/servicesinfo')
      this.allServer = res.data.service_total
      this.running = res.data.active_total
      this.stoped = res.data.inactive_total
      this.runningServers = res.data.active_services
      this.stopedServers = res.data.inactive_services
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

.bigCard {
  width: 93%;
  height: auto;
  margin-top: 5px;
}
</style>
