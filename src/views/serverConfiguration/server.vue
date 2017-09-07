<template>
  <div class="dashboard-container">
    <h1>服务器详情</h1>
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
      switchValue: ''
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
</style>
