<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="报警规则" v-if="createRuleStatus === 0" name="alarmRule">
        <div class="table-view">
          <el-table :data="allalarmRules" height="500">
            <el-table-column width="200" prop="ruleName" label="规则名称"></el-table-column>
            <el-table-column width="100" prop="status" label="状态"></el-table-column>
            <el-table-column width="150" prop="alarmTerm" label="监控项"></el-table-column>
            <el-table-column width="150" prop="maxAlarmNum" label="最大报警次数"></el-table-column>
            <el-table-column prop="ruleDescription" label="规则描述"></el-table-column>
            <el-table-column width="100" prop="notifyPerson" label="通知对象"></el-table-column>
            <el-table-column width="100" prop="notifyWay" label="通知方式"></el-table-column>
            <el-table-column v-if="getRole()" label="操作">
              <template scope="scope">
                <el-button @click="handleRuleOnOff(scope)" type="text" size="small">{{ scope.row.ruleOnOff }}</el-button>
                <el-button type="text" size="small" @click="editRuleConfirm(scope)">编辑</el-button>
                <el-button @click="deleteDialog(scope)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog width="30%" title="删除提示" :visible.sync="deleteDialogConfirm">
          <span>是否删除该备份规则？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogConfirm = false">取 消</el-button>
            <el-button type="danger" @click="deletealarmRuleDone()">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="创建报警规则" v-if="createRuleStatus === 1" name="createAlarmRule">
        <el-form :model="alarmRuleData" label-width="120px">
          <el-button class="title-button" type="success" @click="createAlarmDone" size="small">填写完毕，创建报警规则</el-button>
          <h3>①设置报警规则</h3>
          <el-button class="add-button" size="small" @click="createAlarmRule">添加监控规则</el-button>
          <el-form-item label-width="20px">
            <el-card class="card-list">
              <el-form-item label="是否创建即启用" class="short-item">
                <el-radio-group v-model="alarmRuleData.onOff">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="最大报警次数" class="short-item">
                <el-input size="small" placeholder="推荐 3 次" class="num-input" v-model="alarmRuleData.maxAlarmNum"></el-input>
              </el-form-item>
            </el-card>
          </el-form-item>
          <el-form-item v-for="(rule, index) of rules" :key="index" v-model="rules" label-width="20px">
            <el-card class="card-list">
              <el-form-item label="规则名称">
                <el-input class="rule-select" size="small" v-model="rule.name"></el-input>
                <el-button class="delete-button" size="small" type="danger" @click="deleteAlarmRule(index)">删除此条规则</el-button>
              </el-form-item>
              <el-form-item label="规则描述">
                <el-select class="rule-select" size="small" v-model="rule.alarmTerm" placeholder="请选择监测项">
                  <el-option v-for="item in alarmTerms" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select class="rule-select" size="small" v-model="rule.alarmTimes" placeholder="请选择监测时间段">
                  <el-option v-for="item in alarmTimes" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select class="rule-select" size="small" v-model="rule.alarmExtremum" placeholder="请选择监测值">
                  <el-option v-for="item in alarmExtremums" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                  </el-option>
                </el-select>
                <el-select class="rule-select" size="small" v-model="rule.alarmContrast" placeholder="请选择对比方法">
                  <el-option v-for="item in alarmContrasts" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-input class="rule-input" size="small" v-model="rule.threshold" placeholder="阈值：0-100的数字">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-card>
          </el-form-item>
          <h3>②设置报警接方式</h3>
          <el-form-item label-width="20px">
            <el-card class="card-list">
              <el-checkbox-group v-model="checkContectInfo">
                <el-checkbox v-for="(contactInfo, index) of allContactInfo" :label="contactInfo" :key="index" :disabled="contactInfo === '短信'">{{ contactInfo }}</el-checkbox>
              </el-checkbox-group>
            </el-card>
          </el-form-item>
          <h3>③设置报警接收人</h3>
          <el-form-item label-width="20px">
            <el-card class="card-list">
              <el-checkbox-group v-model="checkContect">
                <el-checkbox v-for="(contact, index) of allContactData" :label="contact.name" :key="index">{{ contact.name }}</el-checkbox>
              </el-checkbox-group>
            </el-card>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-dialog title="编辑报警规则" :visible.sync="editRuleDialog">
        <el-form :model="editRuleData" label-width="120px">
          <h4>①编辑报警规则</h4>
          <el-form-item label-width="20px">
            <el-card class="card-list">
              <el-form-item label="是否修改即启用" class="edit-item">
                <el-radio-group v-model="editRuleData.onOff">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="最大报警次数" class="edit-item">
                <el-input size="small" class="num-input" v-model="editRuleData.maxAlarmNum"></el-input>
              </el-form-item>
            </el-card>
          </el-form-item>
          <el-form-item v-model="rules" label-width="20px">
            <el-card class="card-list">
              <el-form-item label="规则名称">
                <el-input disabled class="rule-edit-input" size="small" v-model="editRuleData.ruleName"></el-input>
              </el-form-item>
              <el-form-item label="规则描述">
                <el-select class="rule-edit-select" size="small" v-model="editRuleData.alarmTerm" placeholder="请选择监测项">
                  <el-option v-for="item in alarmTerms" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select class="rule-edit-select" size="small" v-model="editRuleData.alarmTimes" placeholder="请选择监测周期">
                  <el-option v-for="item in alarmTimes" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select class="rule-edit-select" size="small" v-model="editRuleData.alarmExtremum" placeholder="请选择监测值">
                  <el-option v-for="item in alarmExtremums" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                  </el-option>
                </el-select>
                <el-select class="rule-edit-select" size="small" v-model="editRuleData.alarmContrast" placeholder="请选择对比方法">
                  <el-option v-for="item in alarmContrasts" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-input class="rule-edit-input" size="small" v-model="editRuleData.threshold" placeholder="阈值：0-100的数字">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-card>
          </el-form-item>
          <h4>②编辑报警接方式</h4>
          <el-form-item label-width="20px">
            <el-card class="card-list">
              <el-checkbox-group v-model="editRuleData.notifyWay">
                <el-checkbox v-for="(contactInfo, index) of allContactInfo" :label="contactInfo" :key="index" :disabled="contactInfo === '短信'">{{ contactInfo }}</el-checkbox>
              </el-checkbox-group>
            </el-card>
          </el-form-item>
          <h4>③编辑报警接收人</h4>
          <el-form-item label-width="20px">
            <el-card class="card-list">
              <el-checkbox-group v-model="editRuleData.notifyPerson">
                <el-checkbox v-for="(contact, index) of allContactData" :label="contact.name" :key="index">{{ contact.name }}</el-checkbox>
              </el-checkbox-group>
            </el-card>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRuleDialog = false">取 消</el-button>
          <el-button type="primary" @click="editAlarmRule">确 定</el-button>
        </span>
      </el-dialog>
      <el-tab-pane label="联系人设置" name="contacts">
        <el-button v-if="getRole()" class="add-button" type="primary" @click="createContactConfirm" size="small">新建联系人</el-button>
        <el-table :data="allContactData">
          <el-table-column width="300" prop="name" label="联系人姓名"></el-table-column>
          <el-table-column width="300" prop="phone" label="手机号码"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column v-if="getRole()" label="操作">
            <template scope="scope">
              <el-button type="text" @click="editContactDialog(scope)">编辑</el-button>
              <el-button type="text" @click="deleteContactDialog(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog width="30%" title="添加联系人" :visible.sync="addContactDialog">
          <el-form :model="createContactData" label-width="50px">
            <el-form-item label="姓名">
              <el-input v-model="createContactData.name"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="createContactData.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="createContactData.email"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addContactDialog = false">取 消</el-button>
            <el-button type="primary" @click="addContact">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog width="30%" title="编辑联系人信息" :visible.sync="editContactConfirm">
          <el-form :model="editContactData" label-width="50px">
            <el-form-item label="姓名">
              <el-input disabled v-model="editContactData.name"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="editContactData.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="editContactData.email"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editContactConfirm = false">取 消</el-button>
            <el-button type="primary" @click="editContact()">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog width="30%" title="删除联系人" :visible.sync="deleteContactConfirm">
          <span>删除后不可恢复，请谨慎操作。</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteContactConfirm = false">取 消</el-button>
            <el-button type="primary" @click="deleteContact">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="报警历史" name="alarmHistory">
        <div class="table-view">
          <el-date-picker class="data-picker" v-model="dataRange" type="daterange" align="right" placeholder="选择时间范围查看报警记录" :picker-options="pickerOptions" @change="checkDataRange">
          </el-date-picker>
          <el-table :data="alarmHistory" height="500">
            <el-table-column width="200" prop="alarmServer" label="报警服务器"></el-table-column>
            <el-table-column width="200" prop="alarmTime" label="报警时间"></el-table-column>
            <el-table-column width="100" prop="alarmDuration" label="持续时间"></el-table-column>
            <el-table-column width="100" prop="alarmRuleName" label="规则名称"></el-table-column>
            <el-table-column width="120" prop="notifyPerson" label="通知对象"></el-table-column>
            <el-table-column width="120" prop="notifyWay" label="通知方式"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="getRole()" disabled>
        <template slot="label">
          <el-button size="small" @click="createRule">{{ createOrBackRule }}</el-button>
        </template>
      </el-tab-pane>
    </el-tabs>
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
      editRuleDialog: false,
      editRuleData: {
        notifyWay: [],
        notifyPerson: [],
        ruleName: null,
        alarmTerm: null,
        alarmExtremum: null,
        alarmTimes: null,
        alarmContrast: null,
        threshold: null,
        onOff: null,
        maxAlarmNum: null
      },
      dataRange: [],
      alarmHistory: [],
      createContactData: {},
      addContactDialog: false,
      editContactConfirm: false,
      deleteContactConfirm: false,
      scope: null,
      selectedRule: [],
      createRuleStatus: 0,
      allalarmRules: [],
      alarmRuleData: {
        onOff: true,
        maxAlarmNum: 3
      },
      editContactData: {},
      allContactData: [],
      createOrBackRule: '创建报警规则',
      deleteDialogConfirm: false,
      activeTab: 'alarmRule',
      checkContect: [],
      checkContectInfo: [],
      allContactInfo: ['邮件', '短信'],
      rules: [
        {
          name: null,
          alarmTerm: null,
          alarmTimes: null,
          alarmExtremum: null,
          alarmContrast: null,
          threshold: null
        }
      ],
      alarmTerms: [
        {
          value: 'cpu',
          label: 'CPU使用率'
        },
        {
          value: 'memory',
          label: '内存使用率'
        }
      ],
      alarmTimes: [
        {
          value: 60,
          label: '一分钟'
        },
        {
          value: 300,
          label: '五分钟'
        },
        {
          value: 600,
          label: '十分钟'
        }
      ],
      alarmExtremums: [
        {
          value: 'max',
          label: '最大值'
        },
        {
          value: 'min',
          label: '最小值'
        },
        {
          value: 'avg',
          label: '平均值'
        },
        {
          value: 'all',
          label: '所有值',
          disabled: true
        },
        {
          value: 'sum',
          label: '值总和',
          disabled: true
        },
        {
          value: 'diff',
          label: '同比',
          disabled: true
        },
        {
          value: 'padiff',
          label: '环比',
          disabled: true
        }
      ],
      alarmContrasts: [
        {
          value: '=',
          label: '等于'
        },
        {
          value: '!=',
          label: '不等于'
        },
        {
          value: '<',
          label: '小于'
        },
        {
          value: '<=',
          label: '小于等于'
        },
        {
          value: '>',
          label: '大于'
        },
        {
          value: '>=',
          label: '大于等于'
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
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
    timetrans(time) {
      const date = new Date(time * 1000)
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
      const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return Y + M + D + h + m + s
    },
    async showAllAlarmHistory() {
      try {
        const res = await this.$http.get(this.$apiUrl + '/api/allwarningnotes')
        if (res.data.code === 0) {
          const alarmRecords = res.data.warning_notes
          for (let i = 0; i < alarmRecords.length; i++) {
            const record = {}
            record.alarmServer = alarmRecords[i].client_ip
            record.alarmTime = this.timetrans(alarmRecords[i].notify_time)
            // record.alarmDuration = alarmRecords[i].
            record.alarmRuleName = alarmRecords[i].warning_name
            record.notifyPerson = alarmRecords[i].notified_body
            if (alarmRecords[i].notify_way === 'EMAIL') {
              record.notifyWay = '邮箱'
            } else {
              if (alarmRecords[i].notify_way === 'MSM') {
                record.notifyWay = '短信'
              }
            }
            if (alarmRecords[i].notify_status === true) {
              record.status = '已通知'
            } else {
              if (alarmRecords[i].notify_status === false) {
                record.status = '未通知'
              }
            }
            this.alarmHistory.push(record)
          }
        } else {
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: res.data.msg
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    async handleRuleOnOff(scope) {
      if (scope.row.ruleOnOff === '启用') {
        try {
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/admin/startwarning?warning_name=' + scope.row.ruleName,
            headers: { 'Authorization': this.token }
          })
          if (res.data.code === 0) {
            // location.reload()
            this.showAllAlarmRules()
            this.$message(
              {
                showClose: true,
                type: 'success',
                message: '成功启用'
              }
            )
          }
        } catch (e) {
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: e
            }
          )
        }
      } else {
        if (scope.row.ruleOnOff === '关闭') {
          try {
            const res = await this.$http({
              method: 'GET',
              url: this.$apiUrl + '/admin/stopwarning?warning_name=' + scope.row.ruleName,
              headers: { 'Authorization': this.token }
            })
            if (res.data.code === 0) {
              // location.reload()
              this.showAllAlarmRules()
              this.$message(
                {
                  showClose: true,
                  type: 'success',
                  message: '成功关闭'
                }
              )
            }
          } catch (e) {
            this.$message(
              {
                showClose: true,
                type: 'error',
                message: e
              }
            )
          }
        }
      }
    },
    async showAllAlarmRules() {
      this.allalarmRules = []
      try {
        const res = await this.$http.get(this.$apiUrl + '/api/allwarnings')
        if (res.data.code === 0) {
          const rules = res.data.warnings
          for (let i = 0; i < rules.length; i++) {
            const rule = {
              notifyPerson: []
            }
            rule.ruleName = rules[i].warning_name
            // rule.status = '启用'
            if (rules[i].metrics === 'mem.memused.percent') {
              rule.alarmTerm = '内存使用率'
            } else {
              if (rules[i].metrics === 'cpu.busy') {
                rule.alarmTerm = 'CPU使用率'
              }
            }
            rule.ruleDescription = rules[i].description
            if (rules[i].notified_bodies.length !== 0) {
              for (let I = 0; I < rules[i].notified_bodies.length; I++) {
                rule.notifyPerson[I] = rules[i].notified_bodies[I].body_name
              }
            } else {
              rule.notifyPerson = []
            }
            if (rules[i].notify_way === 'EMAIL') {
              rule.notifyWay = '邮件'
            } else {
              rule.notifyWay = ''
            }
            rule.alarmTimes = rules[i].monitor_duration
            rule.alarmExtremum = rules[i].func
            rule.alarmContrast = rules[i].operator
            rule.threshold = rules[i].right_value
            if (rules[i].is_disable === true) {
              rule.status = '启用'
              rule.ruleOnOff = '关闭'
            } else {
              rule.status = '未启用'
              rule.ruleOnOff = '启用'
            }
            // rule.status = rules[i].is_disable
            rule.maxAlarmNum = rules[i].max_step
            this.allalarmRules.push(rule)
          }
        } else {
          console.log(res.data.code)
        }
      } catch (e) {
        console.log(e)
      }
    },
    editRuleConfirm(scope) {
      this.scope = scope
      console.log(scope.row)
      this.editRuleData.ruleName = scope.row.ruleName
      if (scope.row.alarmTerm === 'CPU使用率') {
        this.editRuleData.alarmTerm = 'cpu'
      } else {
        if (scope.row.alarmTerm === '内存使用率') {
          this.editRuleData.alarmTerm = 'memory'
        }
      }
      this.editRuleData.threshold = scope.row.threshold
      this.editRuleData.alarmContrast = scope.row.alarmContrast
      this.editRuleData.alarmExtremum = scope.row.alarmExtremum
      this.editRuleData.alarmTimes = scope.row.alarmTimes
      // if (scope.row.alarmTimes === 60) {
      //   this.editRuleData.alarmTimes = '一分钟'
      // } else {
      //   if (scope.row.alarmTimes === 300) {
      //     this.editRuleData.alarmTimes = '五分钟'
      //   } else {
      //     if (scope.row.alarmTimes === 600) {
      //       this.editRuleData.alarmTimes = '十分钟'
      //     }
      //   }
      // }
      this.editRuleData.notifyWay[0] = scope.row.notifyWay
      this.editRuleData.notifyPerson = scope.row.notifyPerson
      this.editRuleData.maxAlarmNum = Number(scope.row.maxAlarmNum)
      if (scope.row.status === '启用') {
        this.editRuleData.onOff = true
      } else {
        this.editRuleData.onOff = false
      }
      this.editRuleDialog = true
    },
    async editAlarmRule() {
      try {
        if (!this.editRuleData.ruleName) {
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: '规则名称不能为空'
            }
          )
        } else {
          if (!this.editRuleData.maxAlarmNum) {
            this.$message(
              {
                showClose: true,
                type: 'error',
                message: '最大报警次数不能为空'
              }
            )
          } else {
            if (this.editRuleData.maxAlarmNum === 0) {
              this.$message(
                {
                  showClose: true,
                  type: 'error',
                  message: '最大报警次数不能为零'
                }
              )
            } else {
              console.log(this.editRuleData.maxAlarmNum)
              if (Number.isInteger(Number(this.editRuleData.maxAlarmNum)) === false) {
                this.$message(
                  {
                    showClose: true,
                    type: 'error',
                    message: '最大报警次数必须为数字'
                  }
                )
              } else {
                const ruleName = this.editRuleData.ruleName
                let alarmTerm
                if (this.editRuleData.alarmTerm === 'memory') {
                  alarmTerm = 'mem.memused.percent'
                } else {
                  if (this.editRuleData.alarmTerm === 'cpu') {
                    alarmTerm = 'cpu.busy'
                  }
                }
                const alarmExtremum = this.editRuleData.alarmExtremum
                const alarmTimes = this.editRuleData.alarmTimes
                const alarmContrast = this.editRuleData.alarmContrast
                const threshold = this.editRuleData.threshold
                let notifyWay
                if (this.editRuleData.notifyWay[0] === '邮件') {
                  notifyWay = 'EMAIL'
                } else {
                  if (this.editRuleData.notifyWay[0] === '短信') {
                    notifyWay = 'SMS'
                  }
                }
                const res = await this.$http({
                  method: 'POST',
                  url: this.$apiUrl + '/admin/updatewarning',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
                  data: qs.stringify(
                    {
                      warning_name: ruleName,
                      metrics: alarmTerm,
                      func: alarmExtremum,
                      monitor_duration: alarmTimes,
                      operator: alarmContrast,
                      right_value: threshold,
                      notify_way: notifyWay,
                      notified_body_names: this.editRuleData.notifyPerson,
                      notified_body_num: this.editRuleData.notifyPerson.length,
                      is_enable: this.editRuleData.onOff,
                      max_step: this.editRuleData.maxAlarmNum
                    }
                  )
                })
                if (res.data.code === 0) {
                  this.editRuleDialog = false
                  this.showAllAlarmRules()
                  this.$message(
                    {
                      showClose: true,
                      type: 'success',
                      message: '修改成功'
                    }
                  )
                } else {
                  this.$message(
                    {
                      showClose: true,
                      type: 'error',
                      message: res.data.msg
                    }
                  )
                  this.editRuleDialog = false
                }
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    editContactDialog(scope) {
      this.scope = scope
      this.editContactConfirm = true
      this.editContactData.name = scope.row.name
      this.editContactData.phone = scope.row.phone
      this.editContactData.email = scope.row.email
    },
    async editContact() {
      const index = this.scope.$index
      if (this.editContactData.name) {
        if (this.editContactData.phone) {
          if (this.editContactData.email) {
            const res = await this.$http({
              method: 'POST',
              url: this.$apiUrl + '/admin/updatenotifiedbody',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
              data: qs.stringify(
                {
                  body_name: this.editContactData.name,
                  email: this.editContactData.email,
                  phone_number: this.editContactData.phone
                }
              )
            })
            if (res.data.code === 0) {
              // this.allContactData[index].name = this.editContactData.name
              // this.allContactData[index].phone = this.editContactData.phone
              // this.allContactData[index].email = this.editContactData.email
              this.showAllContact()
              this.editContactConfirm = false
              this.$message(
                {
                  showClose: true,
                  type: 'success',
                  message: '修改成功'
                }
              )
            } else {
              this.$message(
                {
                  showClose: true,
                  type: 'error',
                  message: res.data.msg
                }
              )
            }
          } else {
            this.$message(
              {
                showClose: true,
                type: 'error',
                message: '联系人邮箱不能为空'
              }
            )
          }
        } else {
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: '联系人电话号码不能为空'
            }
          )
        }
      } else {
        this.$message(
          {
            showClose: true,
            type: 'error',
            message: '联系人姓名不能为空'
          }
        )
      }
    },
    createRule() {
      if (this.createRuleStatus === 0) {
        this.createRuleStatus = 1
        this.createOrBackRule = '返回报警规则列表'
        this.activeTab = 'createAlarmRule'
      } else {
        this.createRuleStatus = 0
        this.createOrBackRule = '创建报警规则'
        this.activeTab = 'alarmRule'
      }
    },
    deleteDialog(scope) {
      this.scope = scope
      this.deleteDialogConfirm = true
    },
    async deletealarmRuleDone() {
      try {
        const res = await this.$http({
          method: 'GET',
          url: this.$apiUrl + '/admin/deletewarning?warning_name=' + this.scope.row.ruleName,
          headers: {
            'Authorization': this.token
          }
        })
        if (res.data.code === 0) {
          // this.allalarmRules.splice(this.scope.$index, 1)
          this.showAllAlarmRules()
          this.deleteDialogConfirm = false
          this.$message(
            {
              showClose: true,
              type: 'success',
              message: '删除成功'
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    createAlarmRule() {
      this.rules.push({
        name: null,
        alarmTerm: null,
        alarmTimes: null,
        alarmExtremum: null,
        alarmContrast: null,
        threshold: null
      })
    },
    deleteAlarmRule(index) {
      this.rules.splice(index, 1)
    },
    async createAlarmDone() {
      try {
        for (const i in this.rules) {
          if (!this.rules[i].name) {
            this.$message(
              {
                showClose: true,
                type: 'error',
                message: '规则名称不能为空'
              }
            )
          } else {
            if (!this.rules[i].alarmTerm) {
              this.$message(
                {
                  showClose: true,
                  type: 'error',
                  message: '监控项不能为空'
                }
              )
            } else {
              if (!this.rules[i].alarmTimes) {
                this.$message(
                  {
                    showClose: true,
                    type: 'error',
                    message: '报警监控周期不能为空'
                  }
                )
              } else {
                if (!this.rules[i].alarmExtremum) {
                  this.$message(
                    {
                      showClose: true,
                      type: 'error',
                      message: '监控项的值不能为空'
                    }
                  )
                } else {
                  if (!this.rules[i].alarmContrast) {
                    this.$message(
                      {
                        showClose: true,
                        type: 'error',
                        message: '监控项值与阈值对比方法不能为空'
                      }
                    )
                  } else {
                    if (!this.rules[i].threshold) {
                      this.$message(
                        {
                          showClose: true,
                          type: 'error',
                          message: '监控项阈值不能为空'
                        }
                      )
                    } else {
                      if (this.checkContectInfo.length !== 0) {
                        if (this.checkContect.length !== 0) {
                          if (!this.alarmRuleData.maxAlarmNum) {
                            this.$message(
                              {
                                showClose: true,
                                type: 'error',
                                message: '最大报警次数不能为空'
                              }
                            )
                          } else {
                            if (this.alarmRuleData.maxAlarmNum === '0') {
                              this.$message(
                                {
                                  showClose: true,
                                  type: 'error',
                                  message: '最大报警次数不能为 0'
                                }
                              )
                            } else {
                              if (Number.isInteger(Number(this.alarmRuleData.maxAlarmNum)) === false) {
                                this.$message(
                                  {
                                    showClose: true,
                                    type: 'error',
                                    message: '最大报警次数必须为数字'
                                  }
                                )
                              } else {
                                let notifyWay
                                if (this.checkContectInfo[0] === '邮件') {
                                  notifyWay = 'EMAIL'
                                } else {
                                  if (this.checkContectInfo[0] === '短信') {
                                    notifyWay = 'SMS'
                                  }
                                }
                                const threshold = this.rules[i].threshold
                                const alarmContrast = this.rules[i].alarmContrast
                                const alarmTimes = this.rules[i].alarmTimes
                                let alarmTerm
                                if (this.rules[i].alarmTerm === 'cpu') {
                                  alarmTerm = 'cpu.busy'
                                } else {
                                  if (this.rules[i].alarmTerm === 'memory') {
                                    alarmTerm = 'mem.memused.percent'
                                  }
                                }
                                const alarmExtremum = this.rules[i].alarmExtremum
                                const name = this.rules[i].name
                                const res = await this.$http({
                                  method: 'POST',
                                  url: this.$apiUrl + '/admin/createwarning',
                                  headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
                                  data: qs.stringify(
                                    {
                                      warning_name: name,
                                      metrics: alarmTerm,
                                      func: alarmExtremum,
                                      monitor_duration: alarmTimes,
                                      operator: alarmContrast,
                                      right_value: threshold,
                                      notify_way: notifyWay,
                                      notified_body_names: this.checkContect,
                                      notified_body_num: this.checkContect.length,
                                      max_step: this.alarmRuleData.maxAlarmNum,
                                      is_enable: this.alarmRuleData.onOff
                                    }
                                  )
                                })
                                if (res.data.code === 0) {
                                  this.createRuleStatus = 0
                                  this.createOrBackRule = '创建报警规则'
                                  this.activeTab = 'alarmRule'
                                  // location.reload()
                                  this.showAllAlarmRules()
                                  this.$message(
                                    {
                                      showClose: true,
                                      type: 'success',
                                      message: '创建成功'
                                    }
                                  )
                                } else {
                                  if (res.data.code === 402) {
                                    this.$message(
                                      {
                                        showClose: true,
                                        type: 'warning',
                                        message: '该规则名已被占用，请更换'
                                      }
                                    )
                                  }
                                  console.log('错了')
                                }
                              }
                            }
                          }
                        } else {
                          this.$message(
                            {
                              showClose: true,
                              type: 'error',
                              message: '请选择报警通知联系人'
                            }
                          )
                        }
                      } else {
                        this.$message(
                          {
                            showClose: true,
                            type: 'error',
                            message: '请选择通知联系人方式'
                          }
                        )
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        this.$message(
          {
            showClose: true,
            type: 'success',
            message: e
          }
        )
      }
    },
    createContactConfirm() {
      this.addContactDialog = true
    },
    async showAllContact() {
      this.allContactData = []
      try {
        const res = await this.$http.get(this.$apiUrl + '/api/allnotifiedbodies')
        if (res.data.code === 0) {
          const contacts = res.data.notified_boides
          for (let i = 0; i < contacts.length; i++) {
            const contact = {}
            contact.name = contacts[i].body_name
            contact.email = contacts[i].email
            contact.phone = contacts[i].phone_number
            this.allContactData.push(contact)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    async addContact() {
      try {
        if (this.createContactData.name) {
          if (this.createContactData.phone) {
            if (this.createContactData.email) {
              const res = await this.$http({
                method: 'POST',
                url: this.$apiUrl + '/admin/createnotifiedbody',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
                data: qs.stringify(
                  {
                    body_name: this.createContactData.name,
                    email: this.createContactData.email,
                    phone_number: this.createContactData.phone
                  }
                )
              })
              if (res.data.code === 0) {
                // this.allContactData.push(
                //   {
                //     name: this.createContactData.name,
                //     phone: this.createContactData.phone,
                //     email: this.createContactData.email
                //   }
                // )
                this.showAllContact()
                this.addContactDialog = false
                this.$message(
                  {
                    showClose: true,
                    type: 'success',
                    message: '添加联系人 ' + this.createContactData.name + ' 成功'
                  }
                )
              } else {
                if (res.data.code === 801) {
                  this.$message(
                    {
                      showClose: true,
                      type: 'error',
                      message: '手机号码格式有误'
                    }
                  )
                } else {
                  console.log('有问题')
                }
              }
            } else {
              this.$message(
                {
                  showClose: true,
                  type: 'error',
                  message: '联系人邮箱不能为空'
                }
              )
            }
          } else {
            this.$message(
              {
                showClose: true,
                type: 'error',
                message: '联系人电话号码不能为空'
              }
            )
          }
        } else {
          this.$message(
            {
              showClose: true,
              type: 'error',
              message: '联系人姓名不能为空'
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    deleteContactDialog(scope) {
      this.scope = scope
      this.deleteContactConfirm = true
    },
    async deleteContact() {
      try {
        const res = await this.$http({
          method: 'GET',
          url: this.$apiUrl + '/admin/deletewarning?warning_name=' + this.scope.row.ruleName,
          headers: { 'Authorization': this.token }
        })
        if (res.data.code === 0) {
          // this.allContactData.splice(this.scope.$index, 1)
          this.deleteContactConfirm = false
          this.$message(
            {
              showClose: true,
              type: 'success',
              message: '删除联系人 ' + this.scope.row.name + ' 成功'
            }
          )
          this.showAllContact()
        } else {
          this.$message(
            {
              showClose: true,
              type: 'erroe',
              message: '有问题'
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    async checkDataRange(date) {
      try {
        this.alarmHistory = []
        if (date.length !== 0) {
          const beginTime = Date.parse(date[0]) / 1000
          const endTime = Date.parse(date[1]) / 1000
          const res = await this.$http.get(this.$apiUrl + '/api/warningnotes_between?begin_time=' + beginTime + '&end_time=' + endTime)
          if (res.data.code === 0) {
            const alarmRecords = res.data.warning_notes
            if (alarmRecords.length === 0) {
              this.alarmHistory = []
            } else {
              for (let i = 0; i < alarmRecords.length; i++) {
                const record = {}
                record.alarmServer = alarmRecords[i].client_ip
                record.alarmTime = this.timetrans(alarmRecords[i].notify_time)
                // record.alarmDuration = alarmRecords[i].
                record.alarmRuleName = alarmRecords[i].warning_name
                record.notifyPerson = alarmRecords[i].notified_body
                if (alarmRecords[i].notify_way === 'EMAIL') {
                  record.notifyWay = '邮箱'
                } else {
                  if (alarmRecords[i].notify_way === 'MSM') {
                    record.notifyWay = '短信'
                  }
                }
                if (alarmRecords[i].notify_status === true) {
                  record.status = '已通知'
                } else {
                  if (alarmRecords[i].notify_status === false) {
                    record.status = '未通知'
                  }
                }
                this.alarmHistory.push(record)
              }
            }
          } else {
            this.$message(
              {
                showClose: true,
                type: 'error',
                message: res.data.msg
              }
            )
          }
        } else {
          this.showAllAlarmHistory()
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  async mounted() {
    await this.showAllAlarmRules()
    this.showAllAlarmHistory()
    this.showAllContact()
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

.rule-select {
  float: left;
  width: 18%;
}

.rule-input {
  float: left;
  width: 22%;
}

.rule-span {
  float: left;
  width: auto;
  margin-right: 4px;
  margin-left: 4px;
}

.card-list {
  width: 85%;
}

.add-button {
  margin-left: 20px;
  margin-bottom: 10px;
}

.delete-button {
  float: right;
  margin-right: 6.1%;
}

.title-line {
  float: left;
}

.title-button {
  float: right;
  margin-right: 15%;
}

.table-view {
  width: 95%;
  display: block
}

.data-picker {
  float: right;
}

.rule-edit-select {
  width: 48.5%;
}

.rule-edit-input {
  width: 98%;
}

.num-input {
  width: 32%;
}

.short-item {
  width: 40%;
  float: left;
  margin-bottom: 2%;
}

.edit-item {
  width: 48%;
  float: left;
  margin-bottom: 2%;
}
</style>
