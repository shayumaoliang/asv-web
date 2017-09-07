<template>
  <div class="dashboard-container">
    <!-- <h1>服务器详情</h1>
    <div class='dashboard-text'>name:{{name}}</div>
    <div class='dashboard-text'>role:<span v-for='role in roles' :key='role'>{{role}}</span></div>
    <el-tooltip :content="'服务器状态: ' + switchValue" placement="top">
      <el-switch
        v-model="switchValue"
        on-color="#13ce66"
        off-color="#ff4949"
        on-value="开启"
        off-value="关闭"
        on-text="on"
        off-text="off"
        @change="switchChange">
      </el-switch>
    </el-tooltip>
    <icon-svg icon-class="setting"></icon-svg> -->
    <div class="overview">
      <p class="title"><icon-svg icon-class="vertical"></icon-svg>综述</p>
      <div class="card-group">
        <el-card class="card-list">
          <p><icon-svg class="line-card" icon-class="server"></icon-svg> 服务器：{{allServer}}</p>
        </el-card>
        <el-card class="card-list">
          <p><icon-svg class="line-card" icon-class="running"></icon-svg> 运行中：{{running}}</p>
        </el-card>
        <el-card class="card-list">
          <p><icon-svg class="line-card" icon-class="alarm"></icon-svg> 报警中：{{alarm}}</p>
        </el-card>
      </div>
    </div>
    <div class="detail">
      <p class="title"><icon-svg icon-class="vertical"></icon-svg>详情</p>
        <el-card class="bigCard">
          <div slot="header" class="clearfix">
            <span class="line"><icon-svg icon-class="running"></icon-svg> 运行中：{{ running }}</span>
          </div>
          <div v-for="(server, index) in runningServers" :key="index" class="running item">
            <router-link to="serverConfiguration/server"><icon-svg icon-class="on"></icon-svg>{{ server.ip }}</router-link>
          </div>
        </el-card>
        <el-card class="bigCard">
          <div slot="header" class="clearfix">
            <span class="line"><icon-svg icon-class="stop"></icon-svg> 已停止：{{ stoped }}</span>
          </div>
          <div v-for="(server, index) in stopedServers" :key="index" class="stoped item">
            <router-link to="serverConfiguration/server"><icon-svg icon-class="off"></icon-svg>{{ server.ip }}</router-link>
          </div>
        </el-card>
        <el-card class="bigCard">
          <div slot="header" class="clearfix">
            <span class="line"><icon-svg icon-class="alarm"></icon-svg> 报警中：{{ alarm }}</span>
          </div>
          <div v-for="(server, index) in alarmServers" :key="index" class="stoped item">
            <router-link to="serverConfiguration/server"><icon-svg icon-class="warning"></icon-svg>{{ server.ip }}</router-link>
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
      allServer: 13,
      running: 2,
      alarm: 1,
      stoped: 11,
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
          ip: '192.168.11.13'
        },
        {
          ip: '192.168.11.13'
        },
        {
          ip: '192.168.11.13'
        },
        {
          ip: '192.168.11.13'
        },
        {
          ip: '192.168.11.13'
        },
        {
          ip: '192.168.11.13'
        },
        {
          ip: '192.168.11.13'
        },
        {
          ip: '192.168.11.13'
        },
        {
          ip: '192.168.11.13'
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
    switchChange() {

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
