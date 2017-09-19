<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="报警规则" v-if="createRuleStatus === 0" name="alarmRule">
        <el-table :data="allalarmRules" height="500">
          <el-table-column width="100" prop="ruleName" label="规则名称"></el-table-column>
          <el-table-column width="100" prop="status" label="状态"></el-table-column>
          <el-table-column width="100" prop="onOff" label="启用"></el-table-column>
          <el-table-column width="150" prop="alarmTerm" label="监控项"></el-table-column>
          <el-table-column width="100" prop="ruleDescription" label="规则描述"></el-table-column>
          <el-table-column width="100" prop="notifyPerson" label="通知对象"></el-table-column>
          <el-table-column width="150" prop="notifyWay" label="通知方式"></el-table-column>
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
      <el-tab-pane label="创建报警规则" v-if="createRuleStatus === 1" name="createAlarmRule">
        <el-form :model="alarmRuleData" label-width="100px">
          <!-- <div>
            <h3 class="title-text">①选择服务器
              <el-button class="title-button" type="primary" @click="createAlarmDone">填写完毕，创建报警规则</el-button>
            </h3>

          </div>
          <el-form-item label-width="20px">
            <el-transfer class="transfer" filterable :titles="['所有服务器', '已选服务器']" :button-texts="['移除', '添加']">
            </el-transfer>
          </el-form-item> -->
           <el-button class="title-button" type="primary" @click="createAlarmDone">填写完毕，创建报警规则</el-button>
          <h3>①设置报警规则</h3>
          <el-button class="add-button" size="small" @click="createAlarmRule">添加监控规则</el-button>
          <el-form-item v-for="(rule, index) of rules" :key="index" v-model="rules" label-width="20px">
            <el-card class="card-list">
              <el-form-item label="规则名称">
                <el-input class="rule-select" size="small" v-model="rule.name"></el-input>
                <el-button class="delete-button" size="small" @click="deleteAlarmRule(index)">删除此条规则</el-button>
              </el-form-item>
              <el-form-item label="规则描述">
                <el-select class="rule-select" size="small" v-model="rule.alarmTerm" placeholder="请选择监测项">
                  <el-option v-for="item in alarmTerms" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select class="rule-select" size="small" v-model="rule.alarmTimes" placeholder="请选择监测时间段">
                  <el-option v-for="item in alarmTims" :key="item.value" :label="item.label" :value="item.value">
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
      <el-tab-pane label="联系人设置" name="contacts">
        <el-button class="add-button" type="primary" @click="createContactConfirm">新建联系人</el-button>
        <el-table :data="allContactData">
          <el-table-column width="300" prop="name" label="联系人姓名"></el-table-column>
          <el-table-column width="300" prop="phone" label="手机号码"></el-table-column>
          <el-table-column width="300" prop="email" label="邮箱"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" @click="editContactDialog(scope)">编辑</el-button>
              <el-button type="text" @click="deleteContactDialog(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="添加联系人" :visible.sync="addContactDialog" size="tiny">
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
        <el-dialog title="编辑联系人信息" :visible.sync="editContactConfirm" size="tiny">
          <el-form :model="editContactData" label-width="50px">
            <el-form-item label="姓名">
              <el-input v-model="editContactData.name"></el-input>
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
        <el-dialog title="删除联系人" :visible.sync="deleteContactConfirm" size="tiny">
          <span>删除后不可恢复，请谨慎操作。</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteContactConfirm = false">取 消</el-button>
            <el-button type="primary" @click="deleteContact">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="报警历史" name="alarmHistory">
        <el-table :data="alarmHistory" height="500">
          <el-table-column width="200" prop="ruleName" label="报警服务器"></el-table-column>
          <el-table-column width="200" prop="status" label="报警时间"></el-table-column>
          <el-table-column width="200" prop="onOff" label="报警项"></el-table-column>
        </el-table>
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
      alarmHistory: [],
      createContactData: {},
      addContactDialog: false,
      editContactConfirm: false,
      deleteContactConfirm: false,
      scope: null,
      selectedRule: [],
      createRuleStatus: 0,
      allalarmRules: [],
      alarmRuleData: {},
      editContactData: {},
      allContactData: [
        {
          name: '张三',
          phone: '110',
          email: '110@110.com'
        }
      ],
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
          label: 'CPU 占用率'
        },
        {
          value: 'memory',
          label: '内存占用率'
        }
      ],
      alarmTims: [
        {
          value: '60',
          label: '一分钟'
        },
        {
          value: '300',
          label: '五分钟'
        },
        {
          value: '600',
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
      ]
    }
  },
  methods: {
    editContactDialog(scope) {
      this.scope = scope
      this.editContactConfirm = true
      this.editContactData.name = scope.row.name
      this.editContactData.phone = scope.row.phone
      this.editContactData.email = scope.row.email
    },
    editContact() {
      const index = this.scope.$index
      if (this.editContactData.name) {
        if (this.editContactData.phone) {
          if (this.editContactData.email) {
            this.allContactData[index].name = this.editContactData.name
            this.allContactData[index].phone = this.editContactData.phone
            this.allContactData[index].email = this.editContactData.email
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
      this.deleteDialogConfirm = true
    },
    deletealarmRule() {
      this.deleteDialogConfirm = false
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
    createAlarmDone() {
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
                          this.allalarmRules.push(
                            {
                              ruleName: this.rules[i].name,
                              alarmTerm: this.rules[i].alarmTerm,
                              ruleDescription: ''
                            }
                          )
                          this.createRuleStatus = 0
                          this.createOrBackRule = '创建报警规则'
                          this.activeTab = 'alarmRule'
                          this.$message(
                            {
                              showClose: true,
                              type: 'success',
                              message: '创建成功'
                            }
                          )
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
    addContact() {
      if (this.createContactData.name) {
        if (this.createContactData.phone) {
          if (this.createContactData.email) {
            this.allContactData.push(
              {
                name: this.createContactData.name,
                phone: this.createContactData.phone,
                email: this.createContactData.email
              }
            )
            this.addContactDialog = false
            this.$message(
              {
                showClose: true,
                type: 'success',
                message: '添加联系人 ' + this.createContactData.name + ' 成功'
              }
            )
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
    deleteContactDialog(scope) {
      this.scope = scope
      this.deleteContactConfirm = true
    },
    deleteContact() {
      this.allContactData.splice(this.scope.$index, 1)
      this.deleteContactConfirm = false
      this.$message(
        {
          showClose: true,
          type: 'success',
          message: '删除联系人 ' + this.scope.row.name + ' 成功'
        }
      )
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
  margin-right: 10%;
}
</style>
