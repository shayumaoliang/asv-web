<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>自动备份设置</h4>
    <el-tabs>
      <el-tab-pane label="自动备份设置">
        <el-table :data="allBackupRules" height="500">
          <el-table-column width="100" prop="company" label="公司"></el-table-column>
          <el-table-column width="100" prop="business" label="业务"></el-table-column>
          <el-table-column width="100" prop="voiceprintDataName" label="声纹库"></el-table-column>
          <el-table-column width="150" prop="backupName" label="备份名称"></el-table-column>
          <el-table-column width="100" prop="backupTime" label="备份时间"></el-table-column>
          <el-table-column width="100" prop="backupDate" label="备份日期"></el-table-column>
          <el-table-column width="150" prop="backupNum" label="备份最大副本数量"></el-table-column>
          <el-table-column width="100" prop="backupStatus" label="备份状态"></el-table-column>
          <el-table-column prop="command" label="操作">
            <template scope="scope">
              <el-button @click="handleOnOff(scope)" type="text" size="small">{{ scope.row.onOff }}</el-button>
              <el-button type="text" size="small">编辑</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="查看备份" @click="showAllBackup">
        <el-table :data="allBackup" height="500">
          <el-table-column width="100" prop="company" label="公司"></el-table-column>
          <el-table-column width="100" prop="business" label="业务"></el-table-column>
          <el-table-column width="150" prop="voiceprintDataName" label="声纹库"></el-table-column>
          <el-table-column width="150" prop="backupName" label="备份名称"></el-table-column>
          <el-table-column width="200" prop="backupTime" label="备份时间"></el-table-column>
          <el-table-column width="100" prop="backupType" label="备份类型"></el-table-column>
          <el-table-column width="100" prop="backupStatus" label="备份状态"></el-table-column>
          <el-table-column prop="command" label="操作">
            <template scope="scope">
              <el-button type="text" size="small">回滚</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane disabled>
        <template slot="label">
          <el-button size="small" @click="createBackup">创建新的自动备份规则</el-button>
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="创建声纹库备份规则" :visible.sync="newBackup">
      <el-form :model="backupData" label-width="130px">
        <el-form-item label="备份名称">
          <el-input v-model="backupData.backupName"></el-input>
        </el-form-item>
        <el-form-item label="备份时间">
          <el-time-picker v-model="backupData.backupTime" placeholder="请选择备份时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="备份日期">
          <el-select v-model="backupData.backupDate" clearable placeholder="请选择备份日期">
            <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备份最大副本数量">
          <el-select v-model="backupData.copyNum" clearable placeholder="请选择保留最大副本数量">
            <el-option v-for="item in copyOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备份对象">
          <el-transfer v-model="checkedVoiceprintDb" filterable :titles="['所有声纹库', '已选声纹库']" :button-texts="['移除', '添加']" @change="handleChange" :data="allVoiceprintDb">
          </el-transfer>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newBackup = false">取 消</el-button>
        <el-button type="primary" @click="createNewBackup">确 定</el-button>
      </span>
    </el-dialog>
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
      newBackup: false,
      backupRule: {

      },
      backupName: null,
      backupData: {
        backupName: null,
        backupTime: new Date(),
        backupDate: null,
        copyNum: null
      },
      allVoiceprintDb: [],
      checkedVoiceprintDb: [],
      dateOptions: [
        {
          value: 1,
          label: '星期一'
        },
        {
          value: 2,
          label: '星期二'
        },
        {
          value: 3,
          label: '星期三'
        },
        {
          value: 4,
          label: '星期四'
        },
        {
          value: 5,
          label: '星期五'
        },
        {
          value: 6,
          label: '星期六'
        },
        {
          value: 7,
          label: '星期日'
        }
      ],
      copyOptions: [
        {
          value: 1,
          label: '一份'
        },
        {
          value: 2,
          label: '两份'
        },
        {
          value: 3,
          label: '三份'
        }
      ],
      allBackupRules: [],
      allBackup: [],
      noBackupRuleDb: []
    }
  },
  methods: {
    handleOnOff(scope) {
      if (scope.row.onOff === '关闭') {
        this.$message({
          type: 'success',
          showClose: true,
          message: '已关闭备份'
        })
      } else {
        this.$message({
          type: 'success',
          showClose: true,
          message: '已开启备份'
        })
      }
    },
    async showAllBackupRule() {
      const res = await this.$http.get('http://192.168.1.16:9090/api/autobackups')
      for (let i = 0; i < res.data.autoBackuprRuleInfos.length; i++) {
        const backupRule = {}
        backupRule['company'] = res.data.autoBackuprRuleInfos[i].company_name
        backupRule['business'] = res.data.autoBackuprRuleInfos[i].business_name
        backupRule['voiceprintDataName'] = res.data.autoBackuprRuleInfos[i].lib_name
        backupRule['backupName'] = res.data.autoBackuprRuleInfos[i].auto_backup_rule_name
        backupRule['backupTime'] = res.data.autoBackuprRuleInfos[i].auto_backup_start_hour
        backupRule['backupDate'] = res.data.autoBackuprRuleInfos[i].auto_backup_repeat_weekday
        backupRule['backupNum'] = res.data.autoBackuprRuleInfos[i].auto_backup_max_duplicates
        if (res.data.autoBackuprRuleInfos[i].auto_backup_run_status === '运行中') {
          backupRule['backupStatus'] = '运行中'
          backupRule['onOff'] = '关闭'
        } else {
          backupRule['backupStatus'] = '暂停中'
          backupRule['onOff'] = '开启'
        }
        this.allBackupRules.push(backupRule)
      }
    },
    async showAllBackup() {
      const res = await this.$http.get('http://192.168.1.16:9090/api/backups')
      for (let i = 0; i < res.data.allbackups.length; i++) {
        const backup = {}
        backup['company'] = res.data.allbackups[i].company_name
        backup['business'] = res.data.allbackups[i].business_name
        backup['voiceprintDataName'] = res.data.allbackups[i].lib_name
        backup['backupName'] = res.data.allbackups[i].backup_name
        backup['backupTime'] = res.data.allbackups[i].backup_time
        backup['backupType'] = res.data.allbackups[i].backup_type
        backup['backupStatus'] = res.data.allbackups[i].backup_status
        this.allBackup.push(backup)
      }
    },
    async createBackup() {
      const allVoiceprintDb = []
      const res = await this.$http.get('http://192.168.1.16:9090/api/noautobackuplibs')
      for (let i = 0; i < res.data.noAutobacpRuleLibs.length; i++) {
        const voiceprintDb = {}
        voiceprintDb['key'] = i
        voiceprintDb['label'] = res.data.noAutobacpRuleLibs[i]
        allVoiceprintDb.push(voiceprintDb)
      }
      this.allVoiceprintDb = allVoiceprintDb
      this.newBackup = true
    },
    createNewBackup() {
      this.newBackup = false
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    }
  },
  async mounted() {
    await this.showAllBackupRule()
    await this.showAllBackup()
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
