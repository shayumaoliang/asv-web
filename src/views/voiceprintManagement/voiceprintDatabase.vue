<template>
  <div class="dashboard-container">
    <div class="overview">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>声纹库列表</h4>
      <!-- <h4>
                <icon-svg icon-class="homepage"></icon-svg>平安集团</h4>
          <el-tree :data="voiceprintDb" :props="defaultProps" accordion @node-click="handleNodeClick" :render-content="renderContent">
          </el-tree> -->
      <el-menu unique-opened mode="vertical" class="el-menu" @open="handleOpen" @close="handleClose" @select="handleSelect">
        <el-submenu index="0">
          <template slot="title">
            <i class="el-icon-menu"></i>平安集团</template>
          <div v-for="(company, index) of companys" :key="index">
            <el-submenu :index="`0-${index}`">
              <template slot="title">
                {{ company.companyName }}
                <el-button class="button-mini" type="primary" icon="delete" size="mini" @click="deleteCompany(index)"></el-button>
                <el-button class="button-mini" type="primary" icon="edit" size="mini" @click="editCompany(index)"></el-button>
                <el-button class="button-mini" type="primary" icon="plus" size="mini" @click="addCompany(index)"></el-button>
              </template>
              <div v-for="(business, businessIndex) of companys[index].business" :key="businessIndex">
                <el-submenu :index="`0-${index}-${businessIndex}`">
                  <template slot="title">
                    {{ business.businessName }}
                    <el-button class="button-mini" type="primary" icon="delete" size="mini" @click="deleteBusiness(businessIndex)"></el-button>
                    <el-button class="button-mini" type="primary" icon="edit" size="mini" @click="editBusiness(businessIndex)"></el-button>
                    <el-button class="button-mini" type="primary" icon="plus" size="mini" @click="addBusiness(businessIndex)"></el-button>
                  </template>
                  <div v-for="(voiceprintDb, dbIndex) of companys[index].business[businessIndex].voiceprintDb" :key="dbIndex">
                    <el-menu-item :index="`0-${index}-${businessIndex}-${dbIndex}`">
                      {{ voiceprintDb.voiceprintDataName }}
                      <el-button class="button-m" type="primary" icon="delete" size="mini" @click="deleteDb(dbIndex)"></el-button>
                      <el-button class="button-m" type="primary" icon="edit" size="mini" @click="editDb(dbIndex)"></el-button>
                      <el-button class="button-m" type="primary" icon="plus" size="mini" @click="addDb(dbIndex)"></el-button>
                    </el-menu-item>
                  </div>
                </el-submenu>
              </div>
            </el-submenu>
          </div>
        </el-submenu>
      </el-menu>
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
const id = 1000
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
      index: 2,
      voiceprintName: '一号备份库',
      backup: false,
      backupName: null,
      backupNum: null,
      cancelBackup: false,
      voiceprintData: {},
      companys: [
        {
          companyName: '平安银行',
          business: [
            {
              businessName: '贷款',
              voiceprintDb: [
                {
                  voiceprintDataName: '一号库'
                },
                {
                  voiceprintDataName: '二号库'
                }
              ]
            }
          ]
        },
        {
          companyName: '普惠',
          business: [
            {
              businessName: '借款',
              voiceprintDb: [
                {
                  voiceprintDataName: '三号库'
                },
                {
                  voiceprintDataName: '八号库'
                }
              ]
            }
          ]
        }
      ],
      allBusiness: [
        {
          businessName: '贷款业务'
        },
        {
          businessName: '借款业务'
        }
      ],
      voiceprintDb: [{
        id: 1,
        label: '平安集团',
        children: [{
          id: 4,
          label: '平安银行',
          children: [{
            id: 9,
            label: '贷款业务',
            children: [{
              id: 6,
              label: '三号库'
            }]
          }, {
            id: 10,
            label: '借款业务',
            children: [{
              id: 6,
              label: '三号库'
            }]
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  // computed: {
  //   indexOfCompanys() {
  //     return '1' + '-' + 'index'
  //   },
  //   indexOfBusiness() {
  //     return '1' + '-' + 'index' + 'businessIndex'
  //   },
  //   indexOfDb() {
  //     return '1' + '-' + 'index' + 'businessIndex' + 'dbIndex'
  //   }
  // },
  methods: {
    async getAllcompany() {
      const res = await this.$http.get('http://192.168.1.16:9090/api/getallcompanys')
      console.log(res.data)
    },
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
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    deleteCompany(index) {

    },
    editCompany(index) {

    },
    addCompany(index) {

    },
    deleteBusiness(businessIndex) {

    },
    editBusiness(businessIndex) {

    },
    addBusiness(businessIndex) {

    },
    deleteDb(dbIndex) {

    },
    editDb(dbIndex) {

    },
    addDb(dbIndex) {

    }
    // handleNodeClick(data) {
    //   console.log(data)
    // },
    // append(store, data) {
    //   store.append({ id: id++, label: 'testtest', children: [] }, data)
    //   console.log(data)
    // },

    // remove(store, data) {
    //   store.remove(data)
    // },

    // renderContent(h, { node, data, store }) {
    //   return (
    //     <span>
    //       <span>
    //         <span>{node.label}</span>
    //       </span>
    //       <span style='float: right; margin-right: 20px'>
    //         <el-button size='mini' on-click={() => this.append(store, data)}>修改</el-button>
    //         <el-button size='mini' on-click={() => this.append(store, data)}>添加</el-button>
    //         <el-button size='mini' on-click={() => this.remove(store, data)}>删除</el-button>
    //       </span>
    //     </span>)
    // }
  },
  async mounted() {
    await this.getAllcompany()
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
  // margin-top: 60px;
}
</style>
