<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>未授权服务器</h4>
    <div v-for="(server, index) of servers" :key="server">
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
              {{ server.memory }}G
            </el-form-item>
            <el-form-item label="操作系统" label-width="80px">
              {{ server.OS }}
            </el-form-item>
            <el-form-item label="磁盘" label-width="80px">
              {{ server.disk }}TB
            </el-form-item>
          </el-form-item>
          <el-form-item label="LOG">
            <el-input
              :disabled="true"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="server.log">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入验证信息" v-model="verification">
              <el-button type="primary" slot="append" @click="authorize">导入</el-button>
            </el-input>
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
      verification: null,
      servers: [
        {
          status: '运行中',
          ip: '192.168.10.10',
          cpu: 8,
          memory: 40,
          OS: 'centos7',
          disk: 12.3,
          log: '天上白玉京，十二楼五城。仙人抚我顶，结发受长生。 误逐世间乐，颇穷理乱情。九十六圣君，浮云挂空名。'
        },
        {
          status: '报警中',
          ip: '192.168.10.10',
          cpu: 8,
          memory: 40,
          OS: 'centos7',
          disk: 12.3,
          log: 'asdfasdfasdfasd'
        },
        {
          status: '已停止',
          ip: '192.168.10.10',
          cpu: 8,
          memory: 40,
          OS: 'centos7',
          disk: 12.3,
          log: 'as'
        },
        {
          status: '运行中',
          ip: '192.168.10.10',
          cpu: 8,
          memory: 40,
          OS: 'centos7',
          disk: 12.3,
          log: '金樽清酒斗十千，玉盘珍馐直万钱。停杯投箸不能食，拔剑四顾心茫然。欲渡黄河冰塞川，将登太行雪暗天。闲来垂钓坐溪上，忽复乘舟梦日边。行路难，行路难，多歧路，今安在。长风破浪会有时，直挂云帆济沧海。'
        }
      ]
    }
  },
  methods: {
    authorize() {
      this.$message({
        type: 'success',
        message: '导入成功!'
      })
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

.servers {
  width: 31%;
  float: left;
  margin-left: 5px;
  margin-bottom: 5px;
}

.log {
  height: 150px;
}
</style>
