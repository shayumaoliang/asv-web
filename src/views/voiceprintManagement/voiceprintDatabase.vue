<template>
  <div class="dashboard-container">
    <div class="overview">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>声纹库列表</h4>
      <el-menu mode="vertical" @open="handleOpen" @close="handleClose" @select="getCurrentDb">
        <el-submenu index="0">
          <template slot="title">
            <i class="el-icon-menu"></i>平安集团
            <el-button class="button-mini" type="primary" icon="plus" size="mini" @click="addCompany"></el-button>
          </template>
          <div v-for="(company, index) of companys" :key="company.company_name">
            <el-submenu :index="`${index}`">
              <template slot="title">
                {{ company.company_name }}
                <i>
                  <el-button class="button-mini" type="primary" icon="delete" size="mini" @click="deleteCompany(index)"></el-button>
                </i>
                <!-- <el-button class="button-m" type="primary" icon="edit" size="mini" @click="editCompany(index)"></el-button> -->
                <el-button class="button-m" type="primary" icon="plus" size="mini" @click="addBusiness(index)"></el-button>
              </template>
              <div v-for="(business, businessIndex) of companys[index].businesses" :key="businessIndex">
                <el-submenu :index="`${index}-${businessIndex}`">
                  <template slot="title">
                    {{ business.business_name }}
                    <i>
                      <el-button class="button-mini" type="primary" icon="delete" size="mini" @click="deleteBusiness(businessIndex)"></el-button>
                    </i>
                    <!-- <el-button class="button-m" type="primary" icon="edit" size="mini" @click="editBusiness(businessIndex)"></el-button> -->
                    <el-button class="button-m" type="primary" icon="plus" size="mini" @click="addDb(businessIndex)"></el-button>
                  </template>
                  <div v-for="(voiceprintDb, dbIndex) of companys[index].businesses[businessIndex].libs" :key="voiceprintDb">
                    <el-menu-item :index="`${index}-${businessIndex}-${dbIndex}`">
                      {{ voiceprintDb }}
                      <i>
                        <el-button class="button-m" type="primary" icon="delete" size="mini" @click="deleteDb(dbIndex)"></el-button>
                      </i>
                      <!-- <el-button class="button-m" type="primary" icon="edit" size="mini" @click="editDb(dbIndex)"></el-button>
                      <el-button class="button-m" type="primary" icon="plus" size="mini" @click="addDb(dbIndex)"></el-button> -->
                    </el-menu-item>
                  </div>
                </el-submenu>
              </div>
            </el-submenu>
          </div>
        </el-submenu>
      </el-menu>
    </div>
    <!-- <el-dialog size="tiny" title="备份声纹库" :visible.sync="dbOpration">
      <el-input disabled v-model="voiceprintData.backupName">
        <template slot="prepend">备份名称</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backup = false">取 消</el-button>
        <el-button type="primary" @click="handleBackup">确 定</el-button>
      </span>
    </el-dialog> -->
    <div class="detail">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>声纹库详情</h4>
      <el-form v-if="voiceprintData.length !== 0" label-width="120px" label-position="left" :model="voiceprintData">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button class="button-backpu" type="primary" @click="startBackup">备份</el-button>
          </div>
          <div class="form">
            <el-form-item label="子公司">
              {{ voiceprintData.companyName }}
            </el-form-item>
            <el-form-item label="业务">
              {{ voiceprintData.businessName }}
            </el-form-item>
            <el-form-item label="声纹库">
              {{ voiceprintData.DbName }}
            </el-form-item>
            <el-form-item label="声纹库标识符">
              {{ voiceprintData.DbId }}
            </el-form-item>
            <el-form-item label="声纹库规模">
              {{ voiceprintData.DbCount }}
            </el-form-item>
          </div>
          <el-dialog size="tiny" title="备份声纹库" :visible.sync="backup">
            <el-input disabled v-model="voiceprintData.backupName">
              <template slot="prepend">备份名称</template>
            </el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="backup = false">取 消</el-button>
              <el-button type="primary" @click="handleBackup">确 定</el-button>
            </span>
          </el-dialog>
        </el-card>
      </el-form>
      <el-card v-if="voiceprintData.length === 0"></el-card>
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
      index: 2,
      dbOpration: false,
      voiceprintName: '一号备份库',
      backup: false,
      backupName: null,
      backupNum: null,
      cancelBackup: false,
      voiceprintData: {},
      companys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    async getAllcompany() {
      const res = await this.$http.get(this.$apiUrl + '/api/getallcompanys')
      const allCompanys = res.data.companys
      this.companys = allCompanys
    },
    async getCurrentDb(key) {
      const any = key.split('-')
      const conmpantIndex = Number(any[0])
      const businessIndex = Number(any[1])
      const dbIndex = Number(any[2])
      const companyName = this.companys[conmpantIndex].company_name
      const businessName = this.companys[conmpantIndex].businesses[businessIndex].business_name
      const db = this.companys[conmpantIndex].businesses[businessIndex].libs[dbIndex]
      const res = await this.$http.get(this.$apiUrl + '/lib/' + companyName + '/' + businessName + '/' + db)
      const voiceprintData = {}
      voiceprintData.companyName = companyName
      voiceprintData.businessName = businessName
      voiceprintData.DbName = db
      voiceprintData.DbId = res.data.libNodeId
      voiceprintData.DbCount = res.data.count
      this.voiceprintData = voiceprintData
    },
    async startBackup() {
      const res = await this.$http.get(this.$apiUrl + '/admin/' + this.voiceprintData.companyName + '/' + this.voiceprintData.businessName + '/' + this.voiceprintData.DbName + '/createbackupname')
      this.voiceprintData.backupName = res.data.backup_name
      console.log(res)
      this.backup = true
    },
    async handleBackup() {
      try {
        const res = await this.$http.get(this.$apiUrl + '/admin/' + this.voiceprintData.companyName + '/' + this.voiceprintData.businessName + '/' + this.voiceprintData.DbName + '/manualbackup')
        this.backup = false
        if (res.data.code === 0) {
          this.$message({
            showClose: true,
            message: '成功开始备份',
            type: 'success'
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          message: e,
          type: 'success'
        })
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
      this.dbOpration = true
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      this.dbOpration = true
    },
    deleteCompany(index) {

    },
    editCompany(index) {

    },
    addCompany() {
      this.dbOpration = true
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
      this.dbOpration = true
    }
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
  width: 100%;
  min-height: 100%;
}

.button-mini {
  float: right;
  margin-right: 13px;
  margin-top: 5%;
}

.button-m {
  float: right;
  margin-right: 1px;
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
  min-height: 100%;
}
</style>
