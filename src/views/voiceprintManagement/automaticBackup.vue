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
          <el-table-column width="150" prop="backupStatus" label="备份规则启用状态"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button @click="handleOnOff(scope)" type="text" size="small">{{ scope.row.onOff }}</el-button>
              <el-button type="text" size="small">编辑</el-button>
              <el-button @click="handkeDeleteBackupRuleConfirm(scope)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-dialog title="删除提示" :visible.sync="deleteBackupRuleConfirm" size="tiny">
        <span>是否删除该备份规则？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteBackupRuleConfirm = false">取 消</el-button>
          <el-button type="primary" @click="deleteBackupRule()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="删除提示" :visible.sync="deleteBackupConfirm" size="tiny">
        <span>是否删除该备份？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteBackupConfirm = false">取 消</el-button>
          <el-button type="primary" @click="handleDeleteBackup()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="确认回滚到该备份点？" :visible.sync="rollBackDialog" size="tiny">
        <span>此操作不可撤销，对应声纹库将恢复到此备份点状态，请谨慎！！！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rollBackDialog = false">取 消</el-button>
          <el-button type="primary" @click="rollBack()">确 定</el-button>
        </span>
      </el-dialog>
      <el-tab-pane label="查看备份" @click="showAllBackup">
        <el-table :data="allBackup" height="500">
          <el-table-column width="100" prop="company" label="公司"></el-table-column>
          <el-table-column width="100" prop="business" label="业务"></el-table-column>
          <el-table-column width="150" prop="voiceprintDataName" label="声纹库"></el-table-column>
          <el-table-column width="150" prop="backupName" label="备份名称"></el-table-column>
          <el-table-column width="200" prop="backupTime" label="备份时间"></el-table-column>
          <el-table-column width="100" prop="backupType" label="备份类型"></el-table-column>
          <el-table-column width="100" prop="backupStatus" label="备份状态"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" size="small" @click="rollBackConfirm(scope)">回滚</el-button>
              <el-button @click="handkeDeleteBackupConfirm(scope)" type="text" size="small">删除</el-button>
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
          <el-input style="width: 89%;" v-model="backupData.backupName"></el-input>
        </el-form-item>
        <el-form-item label="备份时间">
          <el-time-select v-model="backupData.backupTime" :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '08:00'
                    }" placeholder="请选择备份时间">
          </el-time-select>
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
          <el-transfer class="transfer" v-model="checkedVoiceprintDb" filterable :titles="['所有声纹库', '已选声纹库']" :button-texts="['移除', '添加']" @change="handleChange" :data="allVoiceprintDb">
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
const qs = require('qs')
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
      rollBackDialog: false,
      deleteBackupConfirm: false,
      deleteBackupRuleConfirm: false,
      newBackup: false,
      backupRule: {},
      backupName: null,
      backupData: {
        backupName: null,
        backupTime: null,
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
      noBackupRuleDb: [],
      scope: null
    }
  },
  methods: {
    rollBackConfirm(scope) {
      this.scope = scope
      this.rollBackDialog = true
    },
    async rollBack() {
      const res = await this.$http.get(this.$apiUrl + '/admin/' + this.scope.row.company + '/' + this.scope.row.business + '/' + this.scope.row.voiceprintDataName + '/rollback?backup_name=' + this.scope.row.backupName)
      if (res.data.code === 0) {
        await this.$message({
          type: 'success',
          showClose: true,
          message: '成功回滚'
        })
        this.rollBackDialog = false
      } else {
        await this.$message({
          type: 'error',
          showClose: true,
          message: '有问题'
        })
      }
    },
    async handleOnOff(scope) {
      if (scope.row.onOff === '停止') {
        const res = await this.$http.get(this.$apiUrl + '/admin/' + scope.row.company + '/' + scope.row.business + '/' + scope.row.voiceprintDataName + '/stopautobackuprule')
        if (res.data.code === 0) {
          // await this.$message({
          //   type: 'success',
          //   showClose: true,
          //   message: '已停止使用该备份规则'
          // })
          location.reload()
        }
      } else {
        const res = await this.$http.get(this.$apiUrl + '/admin/' + scope.row.company + '/' + scope.row.business + '/' + scope.row.voiceprintDataName + '/startautobackuprule')
        if (res.data.code === 0) {
          // await this.$message({
          //   type: 'success',
          //   showClose: true,
          //   message: '已开启使用该备份规则'
          // })
          location.reload()
        }
      }
    },
    // handleClose(done) {
    //   this.$confirm('确认放弃删除？')
    //     .then(_ => {
    //       done()
    //     })
    //     .catch(_ => { })
    // },
    handkeDeleteBackupConfirm(scope) {
      this.deleteBackupConfirm = true
      this.scope = scope
    },
    handkeDeleteBackupRuleConfirm(scope) {
      this.deleteBackupRuleConfirm = true
      this.scope = scope
    },
    async handleDeleteBackup() {
      const scope = this.scope
      try {
        const res = await this.$http.get(this.$apiUrl + '/admin/' + scope.row.company + '/' + scope.row.business + '/' + scope.row.voiceprintDataName + '/deletebackup?backup_name=' + scope.row.backupName)
        if (res.data.code === 0) {
          // await this.$message({
          //   type: 'success',
          //   showClose: true,
          //   message: '成功删除该备份规则'
          // })
          // this.deleteBackupConfirm = false
          location.reload()
        } else {
          await this.$message({
            type: 'error',
            showClose: true,
            message: '操作失败'
          })
          this.deleteBackupConfirm = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    async deleteBackupRule() {
      const scope = this.scope
      try {
        const res = await this.$http.get(this.$apiUrl + '/admin/' + scope.row.company + '/' + scope.row.business + '/' + scope.row.voiceprintDataName + '/deletebackuprule')
        if (res.data.code === 0) {
          // await this.$message({
          //   type: 'success',
          //   showClose: true,
          //   message: '成功删除该备份规则'
          // })
          // this.deleteBackupRuleConfirm = false
          location.reload()
        } else {
          await this.$message({
            type: 'error',
            showClose: true,
            message: '操作失败'
          })
          this.deleteBackupRuleConfirm = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showAllBackupRule() {
      const res = await this.$http.get(this.$apiUrl + '/api/autobackups')
      for (let i = 0; i < res.data.autoBackuprRuleInfos.length; i++) {
        const backupRule = {}
        backupRule['company'] = res.data.autoBackuprRuleInfos[i].company_name
        backupRule['business'] = res.data.autoBackuprRuleInfos[i].business_name
        backupRule['voiceprintDataName'] = res.data.autoBackuprRuleInfos[i].lib_name
        backupRule['backupName'] = res.data.autoBackuprRuleInfos[i].auto_backup_rule_name
        backupRule['backupTime'] = res.data.autoBackuprRuleInfos[i].auto_backup_start_time
        backupRule['backupDate'] = res.data.autoBackuprRuleInfos[i].auto_backup_repeat_weekday
        backupRule['backupNum'] = res.data.autoBackuprRuleInfos[i].auto_backup_max_duplicates
        if (res.data.autoBackuprRuleInfos[i].auto_backup_run_status === '运行中') {
          backupRule['backupStatus'] = '运行中'
          backupRule['onOff'] = '停止'
        } else {
          backupRule['backupStatus'] = '暂停中'
          backupRule['onOff'] = '开启'
        }
        this.allBackupRules.push(backupRule)
      }
    },
    async showAllBackup() {
      const res = await this.$http.get(this.$apiUrl + '/api/backups')
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
      this.newBackup = true
      const allVoiceprintDb = []
      const res = await this.$http.get(this.$apiUrl + '/api/noautobackuplibs')
      for (let i = 0; i < res.data.noAutobacpRuleLibs.length; i++) {
        const voiceprintDb = {}
        voiceprintDb['key'] = i
        voiceprintDb['label'] = res.data.noAutobacpRuleLibs[i]
        allVoiceprintDb.push(voiceprintDb)
      }
      this.allVoiceprintDb = allVoiceprintDb
    },
    async createNewBackup() {
      if (this.backupData.copyNum && this.backupData.backupDate && this.backupData.backupName && this.backupData.backupTime && this.checkedVoiceprintDb.length > 0) {
        for (const i of this.checkedVoiceprintDb) {
          const dbName = this.allVoiceprintDb[i].label
          const res = await this.$http({
            method: 'POST',
            url: this.$apiUrl + '/admin/createautobackuprule',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({
              auto_backup_rule_name: this.backupData.backupName,
              auto_backup_rule_start_time: this.backupData.backupTime,
              auto_backup_rule_weekday: this.backupData.backupDate,
              auto_backup_rule_duplicates: this.backupData.copyNum,
              auto_backup_rule_lib_name: dbName
            })
          })
        }
        location.reload()
      } else {
        this.$message({
          showClose: true,
          message: '请确认各项是否都有填选完整',
          type: 'error'
        })
      }
    },
    handleChange(value, direction, movedKeys) {
      // console.log(value, direction, movedKeys)
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

.transfer {
  font-size: 10px;
}
</style>
