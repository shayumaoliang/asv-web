<template>
  <div class="dashboard-container">
    <div class="overview">
      <p><icon-svg icon-class="vertical"></icon-svg>服务器列表</p>
      <el-card></el-card>
    </div>
    <div class="detail">
      <p><icon-svg icon-class="vertical"></icon-svg>详情</p>
        <el-card class="bigCard">
          <p><icon-svg icon-class="server"></icon-svg> 服务器：{{allServer}}</p>
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
      allServer: 100,
      running: 10,
      alarm: 1
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
.detail {
  margin-top: 10px;
  float: left;
  width: 100%
}
.bigCard {
  width: 93%;
  height: 500px;
}
</style>
