<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>自动备份设置</h4>
    <el-tabs>
      <el-tab-pane label="自动备份设置">
        <el-table :data="allBackupRules" height="500">
          <el-table-column width="120" prop="company" label="公司"></el-table-column>
          <el-table-column width="120" prop="business" label="业务"></el-table-column>
          <el-table-column prop="voiceprintDataName" label="声纹库"></el-table-column>
          <el-table-column width="150" prop="backupName" label="备份名称"></el-table-column>
          <el-table-column width="100" prop="backupTime" label="备份时间"></el-table-column>
          <el-table-column width="100" prop="backupDate" label="备份日期"></el-table-column>
          <el-table-column width="150" prop="backupNum" label="备份最大副本数量"></el-table-column>
          <el-table-column width="150" prop="backupStatus" label="备份规则启用状态"></el-table-column>
          <el-table-column v-if="getRole()" label="操作">
            <template scope="scope">
              <el-button @click="handleOnOff(scope)" type="text" size="small">{{ scope.row.onOff }}</el-button>
              <el-button type="text" size="small" @click="editBackupConfirm(scope)">编辑</el-button>
              <el-button @click="handkeDeleteBackupRuleConfirm(scope)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-dialog title="删除提示" :visible.sync="deleteBackupRuleConfirm" size="tiny">
        <span>是否删除该备份规则？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteBackupRuleConfirm = false">取 消</el-button>
          <el-button type="primary" @click="deleteBackupRule()" v-loading="NewBackUpLoading">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="删除提示" :visible.sync="deleteBackupConfirm" size="tiny">
        <span>是否删除该备份？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteBackupConfirm = false">取 消</el-button>
          <el-button type="primary" @click="handleDeleteBackup()" v-loading="NewBackUpLoading">确 定</el-button>
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
          <el-table-column width="180" prop="company" label="公司"></el-table-column>
          <el-table-column width="180" prop="business" label="业务"></el-table-column>
          <el-table-column width="180" prop="voiceprintDataName" label="声纹库"></el-table-column>
          <el-table-column prop="backupName" label="备份名称"></el-table-column>
          <el-table-column width="200" prop="backupTime" label="备份时间"></el-table-column>
          <el-table-column width="100" prop="backupType" label="备份类型"></el-table-column>
          <el-table-column width="100" prop="backupStatus" label="备份状态"></el-table-column>
          <el-table-column v-if="getRole()" label="操作">
            <template scope="scope">
              <el-button type="text" size="small" @click="rollBackConfirm(scope)" v-loading.fullscreen.lock="rollBackLoading" element-loading-text="正在回滚，请勿进行其他操作">回滚</el-button>
              <el-button @click="handkeDeleteBackupConfirm(scope)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="getRole()" disabled>
        <template slot="label">
          <el-button size="small" @click="createBackup">创建新的自动备份规则</el-button>
        </template>
      </el-tab-pane>
    </el-tabs>
    <Modal title="创建声纹库备份规则" v-model="newBackup" :styles="{top: '20px'}" width="1000">
      <el-form :model="backupData" label-width="130px">
        <el-form-item label="备份名称">
          <el-input class="time-select" v-model="backupData.backupName"></el-input>
        </el-form-item>
        <el-form-item label="备份时间">
          <el-time-select class="time-select" v-model="backupData.backupTime" :picker-options="{
                                                                  start: '00:00',
                                                                  step: '00:30',
                                                                  end: '08:00'
                                                                }" placeholder="请选择备份时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="备份日期">
          <el-select class="time-select" v-model="backupData.backupDate" placeholder="请选择备份日期">
            <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备份最大副本数量">
          <el-select class="time-select" v-model="backupData.copyNum" placeholder="请选择保留最大副本数量">
            <el-option v-for="item in copyOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择备份对象">
          <Transfer :data="allVoiceprintDb" :target-keys="targetKeys" :list-style="listStyle" :render-format="render3" :operations="['移除','添加']" :titles="['无备份规则声纹库', '已选声纹库 ']" @on-change="handleChange3">
          </Transfer>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newBackup = false">取 消</el-button>
        <el-button type="primary" @click="createNewBackup" v-loading="NewBackUpLoading">确 定</el-button>
      </span>
    </Modal>
    <el-dialog size="tiny" title="修改声纹库备份规则" :visible.sync="editBackupDialog">
      <el-form :model="editBackupData" label-width="130px">
        <el-form-item label="备份名称">
          <el-input class="time-select" disabled v-model="editBackupData.backupName"></el-input>
        </el-form-item>
        <el-form-item label="备份时间">
          <el-time-select class="time-select" v-model="editBackupData.backupTime" :picker-options="{
                                                            start: '00:00',
                                                            step: '00:30',
                                                            end: '08:00'
                                                          }" placeholder="请选择备份时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="备份日期">
          <el-select class="time-select" v-model="editBackupData.backupDate" placeholder="请选择备份日期">
            <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备份最大副本数量">
          <el-select class="time-select" v-model="editBackupData.copyNum" placeholder="请选择保留最大副本数量">
            <el-option v-for="item in copyOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBackupDialog = false">取 消</el-button>
        <el-button type="primary" @click="editBackupRule">确 定</el-button>
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
      'roles',
      'token'
    ])
  },
  data() {
    return {
      NewBackUpLoading: false,
      targetKeys: [],
      listStyle: {
        width: '300px',
        height: '300px'
      },
      editBackupData: {
        backupName: null,
        backupTime: null,
        backupDate: null,
        copyNum: null,
        checkedVoiceprintDb: []
      },
      rollBackLoading: null,
      rollBackDialog: false,
      deleteBackupConfirm: false,
      editBackupDialog: false,
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
      checkedVoiceprintDb: null,
      allCheckedVoiceprintDb: [],
      dateOptions: [
        {
          value: 1,
          label: '周一'
        },
        {
          value: 2,
          label: '周二'
        },
        {
          value: 3,
          label: '周三'
        },
        {
          value: 4,
          label: '周四'
        },
        {
          value: 5,
          label: '周五'
        },
        {
          value: 6,
          label: '周六'
        },
        {
          value: 7,
          label: '周日'
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
    getRole() {
      if (this.roles === 'admin') {
        return true
      } else {
        return false
      }
    },
    rollBackConfirm(scope) {
      this.scope = scope
      this.rollBackDialog = true
    },
    async rollBack() {
      try {
        this.rollBackLoading = true
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/' + this.scope.row.company + '/' + this.scope.row.business + '/' + this.scope.row.voiceprintDataName + '/rollback?backup_name=' + this.scope.row.backupName
        })
        if (res.data.code === 0) {
          await this.$message({
            type: 'success',
            showClose: true,
            message: '成功回滚'
          })
          // this.showAllBackup()
          this.rollBackLoading = false
          this.rollBackDialog = false
        } else {
          await this.$message({
            type: 'error',
            showClose: true,
            message: res.data.msg
          })
          this.rollBackLoading = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    async handleOnOff(scope) {
      if (scope.row.onOff === '停止') {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/' + scope.row.company + '/' + scope.row.business + '/' + scope.row.voiceprintDataName + '/stopautobackuprule'
        })
        if (res.data.code === 0) {
          scope.row.onOff = '开启'
          scope.row.backupStatus = '暂停中'
          this.$message({
            type: 'success',
            showClose: true,
            message: '成功停用该备份规则'
          })
          // location.reload()
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: res.data.msg
          })
        }
      } else {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/' + scope.row.company + '/' + scope.row.business + '/' + scope.row.voiceprintDataName + '/startautobackuprule'
        })
        if (res.data.code === 0) {
          scope.row.onOff = '停止'
          scope.row.backupStatus = '运行中'
          this.$message({
            type: 'success',
            showClose: true,
            message: '成功启用该备份规则'
          })
          // location.reload()
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: res.data.msg
          })
        }
      }
    },
    handkeDeleteBackupConfirm(scope) {
      this.deleteBackupConfirm = true
      this.scope = scope
    },
    async editBackupConfirm(scope) {
      this.scope = scope
      console.log(this.scope)
      // const allVoiceprintDb = []
      // const res = await this.$http.get(this.$apiUrl + '/api/noautobackuplibs')
      // for (let i = 0; i < res.data.noAutobackupRuleLibs.length; i++) {
      //   const voiceprintDb = {}
      //   voiceprintDb['key'] = i
      //   voiceprintDb['label'] = res.data.noAutobackupRuleLibs[i]
      //   allVoiceprintDb.push(voiceprintDb)
      // }
      // this.allVoiceprintDb = allVoiceprintDb
      this.editBackupData.dbName = scope.row.voiceprintDataName
      this.editBackupData.company = scope.row.company
      this.editBackupData.business = scope.row.business
      // this.allVoiceprintDb.push({
      //   key: res.data.noAutobackupRuleLibs.length,
      //   label: this.editBackupData.company + '/' + this.editBackupData.business + '/' + this.editBackupData.dbName
      // })
      this.editBackupData.backupName = scope.row.backupName
      this.editBackupData.backupTime = scope.row.backupTime
      this.editBackupData.backupDate = scope.row.backupDate
      this.editBackupData.copyNum = Number(scope.row.backupNum)
      // this.editBackupData.checkedVoiceprintDb = [res.data.noAutobackupRuleLibs.length]
      this.editBackupDialog = true
    },
    async editBackupRule() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/updateautobackuprule ',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
          data: qs.stringify({
            auto_backup_rule_name: this.editBackupData.backupName,
            auto_backup_rule_start_time: this.editBackupData.backupTime,
            auto_backup_rule_weekday: this.editBackupData.backupDate,
            auto_backup_rule_duplicates: this.editBackupData.copyNum,
            lib_name: this.editBackupData.dbName,
            company_name: this.editBackupData.company,
            business_name: this.editBackupData.business
          })
        })
        if (res.data.code === 0) {
          // this.allBackupRules[this.scope.$index] = {
          //   backupTime: this.editBackupData.backupTime,
          //   backupDate: this.editBackupData.backupDate,
          //   backupNum: this.editBackupData.copyNum
          // }
          // this.allBackupRules[this.scope.$index].backupTime = this.editBackupData.backupTime
          // if (this.editBackupData.backupDate === 1) {
          //   this.allBackupRules[this.scope.$index].backupDate = '周一'
          // } else {
          //   if (this.editBackupData.backupDate === 2) {
          //     this.allBackupRules[this.scope.$index].backupDate = '周二'
          //   } else {
          //     if (this.editBackupData.backupDate === 3) {
          //       this.allBackupRules[this.scope.$index].backupDate = '周三'
          //     } else {
          //       if (this.editBackupData.backupDate === 4) {
          //         this.allBackupRules[this.scope.$index].backupDate = '周四'
          //       } else {
          //         if (this.editBackupData.backupDate === 5) {
          //           this.allBackupRules[this.scope.$index].backupDate = '周五'
          //         } else {
          //           if (this.editBackupData.backupDate === 6) {
          //             this.allBackupRules[this.scope.$index].backupDate = '周六'
          //           } else {
          //             this.allBackupRules[this.scope.$index].backupDate = '周日'
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
          // this.allBackupRules[this.scope.$index].backupDate = this.editBackupData.backupDate
          // this.allBackupRules[this.scope.$index].backupNum = this.editBackupData.copyNum
          this.showAllBackupRule()
          this.editBackupDialog = false
          this.$message({
            type: 'success',
            showClose: true,
            message: '修改成功'
          })
          // location.reload()
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: res.data.msg
          })
        }
      } catch (e) {
        this.$message({
          type: 'error',
          showClose: true,
          message: e
        })
      }
    },
    handkeDeleteBackupRuleConfirm(scope) {
      this.deleteBackupRuleConfirm = true
      this.scope = scope
    },
    async handleDeleteBackup() {
      this.NewBackUpLoading = true
      const scope = this.scope
      try {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/' + scope.row.company + '/' + scope.row.business + '/' + scope.row.voiceprintDataName + '/deletebackup?backup_name=' + scope.row.backupName
        })
        if (res.data.code === 0) {
          this.NewBackUpLoading = false
          this.showAllBackup()
          // this.allBackup.splice(scope.$index, 1)
          this.$message({
            type: 'success',
            showClose: true,
            message: '删除成功'
          })
          this.deleteBackupConfirm = false
        } else {
          await this.$message({
            type: 'error',
            showClose: true,
            message: res.data.msg
          })
          this.deleteBackupConfirm = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    async deleteBackupRule() {
      this.NewBackUpLoading = true
      const scope = this.scope
      try {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/' + scope.row.company + '/' + scope.row.business + '/' + scope.row.voiceprintDataName + '/deletebackuprule'
        })
        if (res.data.code === 0) {
          this.NewBackUpLoading = false
          // this.allBackupRules.splice(scope.$index, 1)
          this.showAllBackupRule()
          this.$message({
            type: 'success',
            showClose: true,
            message: '删除成功'
          })
          this.deleteBackupRuleConfirm = false
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: res.data.msg
          })
          this.deleteBackupRuleConfirm = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showAllBackupRule() {
      this.allBackupRules = []
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
      this.allBackup = []
      const res = await this.$http.get(this.$apiUrl + '/api/backups')
      if (res.data.code === 0) {
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
      } else {
        this.$message({
          showClose: true,
          message: res.data.msg,
          type: 'error'
        })
      }
    },
    async createBackup() {
      this.newBackup = true
      this.targetKeys = []
      const allVoiceprintDb = []
      this.allVoiceprintDb = []
      const res = await this.$http.get(this.$apiUrl + '/api/noautobackuplibs')
      for (let i = 0; i < res.data.noAutobackupRuleLibs.length; i++) {
        const voiceprintDb = {}
        voiceprintDb['key'] = i
        voiceprintDb['label'] = res.data.noAutobackupRuleLibs[i]
        allVoiceprintDb.push(voiceprintDb)
      }
      this.allVoiceprintDb = allVoiceprintDb
    },
    async createNewBackup() {
      if (this.backupData.copyNum && this.backupData.backupDate && this.backupData.backupName && this.backupData.backupTime && this.targetKeys.length > 0) {
        this.NewBackUpLoading = true
        for (const i of this.targetKeys) {
          const dbName = this.allVoiceprintDb[i].label
          const res = await this.$http({
            method: 'POST',
            url: this.$apiUrl + '/admin/createautobackuprule',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
            data: qs.stringify({
              auto_backup_rule_name: this.backupData.backupName,
              auto_backup_rule_start_time: this.backupData.backupTime,
              auto_backup_rule_weekday: this.backupData.backupDate,
              auto_backup_rule_duplicates: this.backupData.copyNum,
              auto_backup_rule_lib_name: dbName
            })
          })
          if (res.data.code === 0) {
            this.showAllBackupRule()
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            this.NewBackUpLoading = false
            this.newBackup = false
            // location.reload()
          }
        }
      } else {
        this.$message({
          showClose: true,
          message: '请确认各项是否都有填选完整',
          type: 'error'
        })
      }
    },
    handleChange(value, label) {
      console.log(value, label)
    },
    // getTargetKeys() {
    //   return this.allVoiceprintDb.map(item => item.key)
    // },
    handleChange3(newTargetKeys, direction, moveKeys) {
      console.log(newTargetKeys, direction, moveKeys)
      this.targetKeys = newTargetKeys
    },
    render3(item) {
      return item.label
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
  font-size: 5px;
}

.el-checkbox__label {
  font-size: 5px;
  padding-left: 0px;
}

.time-select {
  width: 47%;
}

.el-form-item {
  margin: 8px;
}
</style>
