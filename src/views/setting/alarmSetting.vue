<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>报警设置</h4>
    <el-tabs>
      <el-tab-pane label="报警规则" v-if="createRuleStatus === 0">
        <el-table :data="allalarmRules" height="500">
          <el-table-column width="100" prop="company" label="规则名称"></el-table-column>
          <el-table-column width="100" prop="business" label="状态"></el-table-column>
          <el-table-column width="100" prop="voiceprintDataName" label="启用"></el-table-column>
          <el-table-column width="150" prop="backupName" label="监控项"></el-table-column>
          <el-table-column width="100" prop="backupTime" label="规则描述"></el-table-column>
          <el-table-column width="100" prop="backupDate" label="通知对象"></el-table-column>
          <el-table-column width="150" prop="backupNum" label="通知方式"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button @click="handleOnOff(scope)" type="text" size="small">{{ scope.row.onOff }}</el-button>
              <el-button type="text" size="small">编辑</el-button>
              <el-button @click="deleteDialog(scope)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="删除提示" :visible.sync="deleteDialogConfirm" size="tiny">
          <span>是否删除该备份规则？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogConfirm = false">取 消</el-button>
            <el-button type="primary" @click="deletealarmRule()">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="创建报警规则" v-if="createRuleStatus === 1">
        <h4>
          <icon-svg icon-class="vertical"></icon-svg>创建规则</h4>
        <el-form :model="alarmRuleData" label-width="130px">
          <h5>
            <icon-svg size="big" icon-class="one"></icon-svg>选择对象</h5>
          <el-form-item>
            <el-transfer class="transfer" v-model="checkedVoiceprintDb" filterable :titles="['选择范围', '选择对象', '已选择']" :button-texts="['移除', '添加']" @change="handleChange" :data="allVoiceprintDb">
            </el-transfer>
          </el-form-item>
          <h5>
            <icon-svg size="big" icon-class="one"></icon-svg>设置报警规则</h5>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="联系人设置">
      </el-tab-pane>
      <el-tab-pane label="报警历史">
      </el-tab-pane>
      <el-tab-pane disabled>
        <template slot="label">
          <el-button size="small" @click="createRule">{{ createOrBackRule }}</el-button>
        </template>
      </el-tab-pane>
    </el-tabs>
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
      createRuleStatus: 0,
      allalarmRules: [],
      createOrBackRule: '创建报警规则',
      deleteDialogConfirm: false
    }
  },
  methods: {
    createRule() {
      if (this.createRuleStatus === 0) {
        this.createRuleStatus = 1
        this.createOrBackRule = '返回规则列表'
      } else {
        this.createRuleStatus = 0
        this.createOrBackRule = '创建报警规则'
      }
    },
    deleteDialog(scope) {
      this.deleteDialogConfirm = true
    },
    deletealarmRule() {
      this.deleteDialogConfirm = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
