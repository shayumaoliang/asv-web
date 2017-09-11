<template>
  <div class="dashboard-container">
    <div class="overview">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>声纹库列表</h4>
      <!-- <el-menu unique-opened mode="vertical" class="el-menu" @open="handleOpen" @close="handleClose">
                    <el-submenu index="1">
                      <template slot="title">
                        <i class="el-icon-menu"></i>平安集团</template>
                      <el-submenu index="1-1">
                        <template slot="title">
                          平安银行
                          <el-button class="button-mini" type="primary" icon="delete" size="mini"></el-button>
                          <el-button class="button-mini" type="primary" icon="edit" size="mini"></el-button>
                          <el-button class="button-mini" type="primary" icon="plus" size="mini"></el-button>
                        </template>
                        <el-submenu index="1-1-1">
                          <template slot="title">
                            贷款业务
                            <el-button class="button-mini" type="primary" icon="delete" size="mini"></el-button>
                            <el-button class="button-mini" type="primary" icon="edit" size="mini"></el-button>
                            <el-button class="button-mini" type="primary" icon="plus" size="mini"></el-button>
                          </template>
                          <el-menu-item index="1-1-1-1">
                            声纹库
                            <el-button class="button-m" type="primary" icon="delete" size="mini"></el-button>
                            <el-button class="button-m" type="primary" icon="edit" size="mini"></el-button>
                            <el-button class="button-m" type="primary" icon="plus" size="mini"></el-button>
                          </el-menu-item>
                          <el-menu-item index="1-1-1-2">
                            声纹库1
                            <el-button class="button-m" type="primary" icon="delete" size="mini"></el-button>
                            <el-button class="button-m" type="primary" icon="edit" size="mini"></el-button>
                            <el-button class="button-m" type="primary" icon="plus" size="mini"></el-button>
                          </el-menu-item>
                        </el-submenu>
                        <el-submenu index="1-1-2">
                          <template slot="title">
                            借款业务
                            <el-button class="button-mini" type="primary" icon="delete" size="mini"></el-button>
                            <el-button class="button-mini" type="primary" icon="edit" size="mini"></el-button>
                            <el-button class="button-mini" type="primary" icon="plus" size="mini"></el-button>
                          </template>
                          <el-menu-item index="1-1-2-1">
                            声纹库
                            <el-button class="button-m" type="primary" icon="delete" size="mini"></el-button>
                            <el-button class="button-m" type="primary" icon="edit" size="mini"></el-button>
                            <el-button class="button-m" type="primary" icon="plus" size="mini"></el-button>
                          </el-menu-item>
                        </el-submenu>
                      </el-submenu>
                    </el-submenu>
                  </el-menu> -->
      <h4>
        <icon-svg icon-class="homepage"></icon-svg>平安集团</h4>
      <el-tree :data="data" :props="defaultProps" accordion @node-click="handleNodeClick">
      </el-tree>
    </div>
    <div class="detail">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>声纹库详情</h4>
      <el-form label-width="120px" label-position="left" :model="voiceprintData">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button class="button-backpu" type="primary" @click="startBackup">备份</el-button>
          </div>
          <div class="form">
            <el-form-item label="子公司">
              {{ '平安银行' }}
            </el-form-item>
            <el-form-item label="业务">
              {{ '贷款' }}
            </el-form-item>
            <el-form-item label="声纹库">
              {{ voiceprintName }}
            </el-form-item>
            <el-form-item label="声纹库标识符">
              {{ '0000000000' }}
            </el-form-item>
            <el-form-item label="声纹库规模">
              {{ '1000' }}
            </el-form-item>
          </div>
          <el-dialog size="tiny" title="备份声纹库" :visible.sync="backup">
            <el-input disabled v-model="backupName">
              <template slot="prepend">备份名称</template>
            </el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="backup = false">取 消</el-button>
              <el-button type="primary" @click="handleBackup">确 定</el-button>
            </span>
          </el-dialog>
        </el-card>
      </el-form>
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
      voiceprintName: '一号备份库',
      backup: false,
      backupName: null,
      backupNum: null,
      cancelBackup: false,
      voiceprintData: {},
      // voiceprntDatabase: [
      //   {
      //     companyName: '平安银行',
      //     business: [
      //       {
      //         businessName: '贷款',
      //         database: [
      //           '一号',
      //           '二号'
      //         ]
      //       },
      //       {
      //         businessName: '借款',
      //         database: [
      //           '一号',
      //           '二号'
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     companyName: '不安银行',
      //     business: [
      //       {
      //         businessName: '贷款',
      //         database: [
      //           '一号',
      //           '二号'
      //         ]
      //       },
      //       {
      //         businessName: '借款',
      //         database: [
      //           '一号',
      //           '二号'
      //         ]
      //       }
      //     ]
      //   }
      // ],
      data: [
        {
          id: 1,
          label: '平安银行',
          children: [{
            id: 2,
            label: '贷款业务',
            children: [{
              id: 3,
              label: '一号库'
            }, {
              id: 5,
              label: '二号库'
            }]
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    startBackup() {
      this.backup = true
    },
    handleBackup() {
      this.backup = false
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }, handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 5px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.el-menu {
  width: 100%
}

.button-mini {
  float: right;
  margin-right: 5%;
  margin-top: 5%;
}

.button-m {
  float: right;
  margin-right: 0px;
  margin-top: 5%;
}

.detail {
  float: left;
  width: 68%;
  height: auto;
}

.overview {
  margin-bottom: 5px;
  width: 30%;
  float: left;
  height: auto;
}

.form {
  margin-left: 5%;
}

.button-backpu {
  float: left;
  margin-left: 5%;
}
.box-card {
  margin-top: 10px;
}
</style>
