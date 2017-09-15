<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>场景配置</h4>
    <el-card class="view">
      <el-form label-width="120px" label-position="left" :model="voiceprintData">

      </el-form>
    </el-card>
    <el-card class="view">
      <el-form label-width="120px" label-position="left" :model="voiceprintData">

      </el-form>
    </el-card>
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
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 8px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.view {
  width: 45%;
  float: left;
  margin-right: 5%;
}
</style>
