<template>
  <div class="dashboard-container">
    <div class="overview">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>声纹库列表</h4>
      <el-menu unique-opened mode="vertical" @open="handleOpen" @close="handleClose" @select="getCurrentDb">
        <el-submenu index="0">
          <template slot="title">
            <i class="el-icon-menu"></i>&nbsp&nbsp&nbsp平安集团
          </template>
          <div v-for="(company, index) of companys" :key="index">
            <el-submenu :index="`0-${index}`">
              <template slot="title">
                <icon-svg icon-class="company"></icon-svg>&nbsp&nbsp&nbsp{{ company.company_name }}
              </template>
              <div v-for="(business, businessIndex) of companys[index].businesses" :key="businessIndex">
                <el-submenu :index="`0-${index}-${businessIndex}`">
                  <template slot="title">
                    <icon-svg icon-class="business"></icon-svg>&nbsp&nbsp&nbsp{{ business.business_name }}
                  </template>
                  <div v-for="(voiceprintDb, dbIndex) of companys[index].businesses[businessIndex].libs" :key="dbIndex">
                    <el-menu-item :index="`0-${index}-${businessIndex}-${dbIndex}`">
                      <icon-svg icon-class="server"></icon-svg>&nbsp&nbsp&nbsp{{ voiceprintDb.lib_name }}
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
        <icon-svg icon-class="vertical"></icon-svg>{{ '详情' }}</h4>
      <el-form label-width="120px" label-position="left" :model="voiceprintData">
        <el-card v-if="showDb === true" class="box-card">
          <div v-if="getRole()" slot="header" class="clearfix">
            <el-button size="small" class="button-backpu" type="primary" @click="startBackup">备份</el-button>
            <el-button size="small" class="button-backpu" type="primary" @click="editVoiceprintDbConfirm">{{ '修改' }}</el-button>
            <el-button size="small" class="button-backpu" type="primary" @click="deleteVoiceprintDbConfirm">{{ '删除' }}</el-button>
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
            <el-form-item label="场景">
              {{ voiceprintData.scene }}
            </el-form-item>
            <el-form-item label="声纹库标识符">
              {{ voiceprintData.uid }}
            </el-form-item>
            <el-form-item label="声纹库规模">
              {{ voiceprintData.DbCount }}
            </el-form-item>
          </div>
        </el-card>
      </el-form>
      <el-form label-width="120px" label-position="left">
        <el-card v-if="showCompanys === true" class="box-card">
          <div v-if="getRole()" slot="header" class="clearfix">
            <el-button size="small" class="button-backpu" type="primary" @click="addBusinessConfirm">{{ '添加公司子项' }}</el-button>
            <el-button size="small" class="button-backpu" type="primary" @click="editCompanyConfirm">{{ '修改该项名称' }}</el-button>
            <el-button size="small" class="button-backpu" type="primary" @click="deleteCompanyConfirm">{{ '删除该项' }}</el-button>
          </div>
          <div class="form">
            <el-form-item label="公司">
              <strong> {{ currentCompanyName }}</strong>
            </el-form-item>
            <el-form-item label="业务">
              <div v-for="(bussiness, index) of allBusiness" :key="index">
                <strong> {{ bussiness.business_name }}</strong>
              </div>
            </el-form-item>
          </div>
        </el-card>
      </el-form>
      <el-form label-width="120px" label-position="left">
        <el-card v-if="showBusiness === true" class="box-card">
          <div v-if="getRole()" slot="header" class="clearfix">
            <el-button size="small" class="button-backpu" type="primary" @click="addVioceprintDbConfirm">{{ '添加声纹库' }}</el-button>
            <el-button size="small" class="button-backpu" type="primary" @click="editBusinessConfirm">{{ '修改该项名称' }}</el-button>
            <el-button size="small" class="button-backpu" type="primary" @click="deleteBusinessConfirm">{{ '删除该项' }}</el-button>

          </div>
          <div class="form">
            <el-form-item label="业务">
              <strong> {{ currentBusinessName }}</strong>
            </el-form-item>
            <el-form-item label="声纹库">
              <div v-for="(voiceprintDb, index) of allVioceprintDb" :key="index">
                <strong> {{ voiceprintDb.lib_name }}</strong>
              </div>
            </el-form-item>
          </div>
        </el-card>
      </el-form>
      <el-form label-width="90px" label-position="left">
        <el-card v-if="showGroup === true" class="box-card">
          <div v-if="getRole()" slot="header" class="clearfix">
            <el-button size="small" class="button-backpu" type="primary" @click="addCompanyConfirm">{{ '添加集团子项' }}</el-button>
          </div>
          <div class="form">
            <el-form-item label="集团">
              <strong> {{ '平安集团' }}</strong>
            </el-form-item>
            <el-form-item label="公司">
              <div v-for="(company, index) of companys" :key="index">
                <strong> {{ company.company_name }}</strong>
              </div>
            </el-form-item>
          </div>
        </el-card>
        <el-dialog size="tiny" title="添加集团子项" :visible.sync="addCompanyDialog">
          <el-input v-model="addCompanyData">
            <template slot="prepend">公司名称</template>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCompanyDialog = false">取 消</el-button>
            <el-button type="primary" @click="addCompany">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog size="tiny" title="添加公司子项" :visible.sync="addBusinessDialog">
          <el-input v-model="addBusinessData">
            <template slot="prepend">业务名称</template>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addBusinessDialog = false">取 消</el-button>
            <el-button type="primary" @click="addBusiness">确 定</el-button>
          </span>
        </el-dialog>
        <el-form label-width="100px" :model="addVioceprintDbData">
          <el-dialog size="tiny" title="添加声纹库" :visible.sync="addVioceprintDbDialog">
            <el-form-item label="声纹库名称">
              <el-input class="center-input" v-model="addVioceprintDbData.name">
              </el-input>
            </el-form-item>
            <el-form-item label="声纹库标识符">
              <el-input class="center-input" v-model="addVioceprintDbData.uid">
              </el-input>
            </el-form-item>
            <el-form-item label="场景">
              <el-select class="center-input" v-model="addVioceprintDbData.scene" placeholder="请选择场景">
                <el-option v-for="(scene, index) in scenes" :key="index" :label="scene.name" :value="scene.name">
                </el-option>
              </el-select>
            </el-form-item>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addVioceprintDbDialog = false">取 消</el-button>
              <el-button type="primary" @click="addVioceprintDb">确 定</el-button>
            </span>
          </el-dialog>
        </el-form>
        <el-dialog size="tiny" title="修改" :visible.sync="editCompanyDialog">
          <el-input v-model="editCompanyData">
            <template slot="prepend">公司名称</template>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editCompanyDialog = false">取 消</el-button>
            <el-button type="primary" @click="editCompany">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog size="tiny" title="修改" :visible.sync="editBusinessDialog">
          <el-input v-model="editBusinessData">
            <template slot="prepend">业务名称</template>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editBusinessDialog = false">取 消</el-button>
            <el-button type="primary" @click="editBusiness">确 定</el-button>
          </span>
        </el-dialog>
        <el-form label-width="100px" :model="editVioceprintDbData">
          <el-dialog size="tiny" title="修改声纹库" :visible.sync="editVioceprintDbDialog">
            <el-form-item label="声纹库名称">
              <el-input class="center-input" v-model="editVioceprintDbData.name">
              </el-input>
            </el-form-item>
            <el-form-item label="声纹库标识符">
              <el-input class="center-input" v-model="editVioceprintDbData.uid">
              </el-input>
            </el-form-item>
            <el-form-item label="场景">
              <el-select class="center-input" v-model="editVioceprintDbData.scene" placeholder="请选择场景">
                <el-option v-for="(scene, index) in scenes" :key="index" :label="scene.name" :value="scene.name">
                </el-option>
              </el-select>
            </el-form-item>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editVioceprintDbDialog = false">取 消</el-button>
              <el-button type="primary" @click="editVoiceprintDb">确 定</el-button>
            </span>
          </el-dialog>
        </el-form>
        <el-dialog size="tiny" title="删除" :visible.sync="deleteCompanyConDialog">
          <span>一旦删除，将无法恢复，请谨慎操作</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteCompanyConDialog = false">取 消</el-button>
            <el-button type="primary" @click="deleteCompany">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog size="tiny" title="删除" :visible.sync="deleteBusinessDialog">
          <span>一旦删除，将无法恢复，请谨慎操作</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteBusinessDialog = false">取 消</el-button>
            <el-button type="primary" @click="deleteBusiness">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog size="tiny" title="删除" :visible.sync="deleteVoiceprintDbDialog">
          <span>一旦删除，将无法恢复，请谨慎操作</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteVoiceprintDbDialog = false">取 消</el-button>
            <el-button type="primary" @click="deleteVoiceprintDb">确 定</el-button>
          </span>
        </el-dialog>
      </el-form>
      <el-dialog size="tiny" title="备份声纹库" :visible.sync="backup">
        <el-input disabled v-model="voiceprintData.backupName">
          <template slot="prepend">备份名称</template>
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="backup = false">取 消</el-button>
          <el-button type="primary" @click="handleBackup">确 定</el-button>
        </span>
      </el-dialog>
    </div>
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
      addBusinessData: null,
      companyIndex: null,
      businessIndex: null,
      dbIndex: null,
      addCompanyData: null,
      addVioceprintDbData: {
        name: null,
        uid: null,
        scene: null
      },
      editBusinessData: null,
      editCompanyData: null,
      editVioceprintDbData: {
        name: null,
        uid: null,
        scene: null
      },
      addCompanyDialog: false,
      addBusinessDialog: false,
      addVioceprintDbDialog: false,
      editCompanyDialog: false,
      editBusinessDialog: false,
      editVioceprintDbDialog: false,
      deleteBusinessDialog: false,
      deleteCompanyConDialog: false,
      deleteVoiceprintDbDialog: false,
      showGroup: true,
      showCompanys: false,
      showBusiness: false,
      showDb: false,
      dbOpration: false,
      voiceprintName: '一号备份库',
      backup: false,
      backupName: null,
      backupNum: null,
      cancelBackup: false,
      voiceprintData: {},
      companyId: null,
      businessId: null,
      vioceprintDbId: null,
      companys: [],
      allBusiness: [],
      allVioceprintDb: [],
      currentCompanyName: null,
      currentBusinessName: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      scenes: []
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
    async getAllcompany() {
      try {
        this.companys = []
        const res = await this.$http.get(this.$apiUrl + '/api/getallcompanys')
        const allCompanys = res.data.companys
        if (res.data.code === 0) {
          this.companys = allCompanys
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          message: e,
          type: 'error'
        })
      }
    },
    async getCurrentDb(key) {
      this.showDb = true
      this.showBusiness = false
      const any = key.split('-')
      const companyIndex = Number(any[1])
      const businessIndex = Number(any[2])
      const dbIndex = Number(any[3])
      this.dbIndex = dbIndex
      const companyName = this.companys[companyIndex].company_name
      const businessName = this.companys[companyIndex].businesses[businessIndex].business_name
      const db = this.companys[companyIndex].businesses[businessIndex].libs[dbIndex].lib_name
      const res = await this.$http.get(this.$apiUrl + '/lib/' + companyName + '/' + businessName + '/' + db)
      const voiceprintData = {}
      voiceprintData.companyName = companyName
      voiceprintData.businessName = businessName
      voiceprintData.DbName = db
      voiceprintData.scene = res.data.scene
      voiceprintData.uid = res.data.libNodeId
      voiceprintData.DbCount = res.data.count
      voiceprintData.id = res.data.lib_id
      this.voiceprintData = voiceprintData
    },
    async startBackup() {
      const res = await this.$http({
        method: 'GET',
        headers: { 'Authorization': this.token },
        url: this.$apiUrl + '/admin/' + this.voiceprintData.companyName + '/' + this.voiceprintData.businessName + '/' + this.voiceprintData.DbName + '/createbackupname'
      })
      this.voiceprintData.backupName = res.data.backup_name
      this.backup = true
    },
    async handleBackup() {
      try {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/' + this.voiceprintData.companyName + '/' + this.voiceprintData.businessName + '/' + this.voiceprintData.DbName + '/manualbackup?backup_name=' + this.voiceprintData.backupName
        })
        if (res.data.code === 0) {
          this.backup = false
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
    openOrclose(key, keyPath) {
      if (key !== '0') {
        if (keyPath.length === 2) {
          const any = key.split('-')
          const companyIndex = Number(any[1])
          this.companyIndex = companyIndex
          this.currentCompanyName = this.companys[companyIndex].company_name
          this.companyId = this.companys[companyIndex].id
          this.allBusiness = this.companys[companyIndex].businesses
          this.showCompanys = true
          this.showBusiness = false
          this.showDb = false
        } else {
          if (keyPath.length === 3) {
            const any = key.split('-')
            const companyIndex = Number(any[1])
            this.companyIndex = companyIndex
            const businessIndex = Number(any[2])
            this.businessIndex = businessIndex
            this.allBusiness = this.companys[companyIndex].businesses
            this.currentBusinessName = this.allBusiness[businessIndex].business_name
            this.businessId = this.allBusiness[businessIndex].id
            this.allVioceprintDb = this.allBusiness[businessIndex].libs
            this.showBusiness = true
            this.showDb = false
          }
          this.showCompanys = false
        }
        this.showGroup = false
      } else {
        this.showBusiness = false
        this.showCompanys = false
        this.showDb = false
        this.showGroup = true
      }
    },
    handleOpen(key, keyPath) {
      this.openOrclose(key, keyPath)
    },
    handleClose(key, keyPath) {
      this.openOrclose(key, keyPath)
    },
    addCompanyConfirm() {
      this.addCompanyDialog = true
    },
    async addCompany() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/createcompany',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token
          },
          data: qs.stringify({
            company_name: this.addCompanyData
          })
        })
        if (res.data.code === 0) {
          await this.getAllcompany()
          const index = this.companys.length - 1
          this.companyId = this.companys[index].id
          this.addCompanyDialog = false
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    editCompanyConfirm() {
      this.editCompanyData = this.currentCompanyName
      this.editCompanyDialog = true
    },
    async editCompany() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/updatecompany',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
          data: qs.stringify({
            company_id: this.companyId,
            company_name: this.editCompanyData
          })
        })
        if (res.data.code === 0) {
          this.getAllcompany()
          this.currentCompanyName = this.editCompanyData
          // this.companys[this.companyIndex].company_name = this.editCompanyData
          this.editCompanyDialog = false
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    deleteCompanyConfirm() {
      if (this.allBusiness) {
        if (this.allBusiness.length !== 0) {
          this.$message({
            showClose: true,
            message: '其子项不为空，无法删除',
            type: 'error'
          })
        } else {
          this.deleteCompanyConDialog = true
        }
      }
    },
    async deleteCompany() {
      try {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/deletecompany?company_name=' + this.currentCompanyName
        })
        if (res.data.code === 0) {
          // this.companys.splice(this.companyIndex, 1)
          this.getAllcompany()
          this.deleteCompanyConDialog = false
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    addBusinessConfirm() {
      this.addBusinessDialog = true
    },
    async addBusiness() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/' + this.currentCompanyName + '/createbusiness',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
          data: qs.stringify({
            business_name: this.addBusinessData
          })
        })
        if (res.data.code === 0) {
          this.getAllcompany()
          const index = this.companys[this.companyIndex].businesses.length - 1
          this.businessId = this.companys[this.companyIndex].businesses[index].id
          this.addBusinessDialog = false
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          message: e,
          type: 'error'
        })
      }
    },
    editBusinessConfirm() {
      this.editBusinessData = this.currentBusinessName
      this.editBusinessDialog = true
    },
    async editBusiness() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/' + this.currentCompanyName + '/updatebusiness',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
          data: qs.stringify({
            business_id: this.businessId,
            business_name: this.editBusinessData
          })
        })
        if (res.data.code === 0) {
          this.getAllcompany()
          // this.currentBusinessName = this.editBusinessData
          this.companys[this.companyIndex].businesses[this.businessIndex].business_name = this.editBusinessData
          this.editBusinessDialog = false
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    deleteBusinessConfirm() {
      if (this.allVioceprintDb) {
        if (this.allVioceprintDb.length !== 0) {
          this.$message({
            showClose: true,
            message: '其子项不为空，无法删除',
            type: 'error'
          })
        } else {
          this.deleteBusinessDialog = true
        }
      }
    },
    async deleteBusiness() {
      try {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/' + this.currentCompanyName + '/deletebusiness?business_name=' + this.currentBusinessName
        })
        if (res.data.code === 0) {
          this.getAllcompany()
          // this.companys[this.companyIndex].businesses.splice(this.businessIndex, 1)
          this.deleteBusinessDialog = false
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getScenes() {
      this.scenes = []
      try {
        const res = await this.$http.get(this.$apiUrl + '/api/allscenes')
        if (res.data.code === 0) {
          const scenes = res.data.scenes
          for (let i = 0; i < scenes.length; i++) {
            const scene = {}
            scene.name = scenes[i].scene_name
            this.scenes.push(scene)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    async addVioceprintDbConfirm() {
      await this.getScenes()
      this.addVioceprintDbDialog = true
    },
    async addVioceprintDb() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/' + '/' + this.currentCompanyName + '/' + this.currentBusinessName + '/createasvlib',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
          data: qs.stringify({
            lib_name: this.addVioceprintDbData.name,
            lib_nodeid: this.addVioceprintDbData.uid,
            lib_scene: this.addVioceprintDbData.scene
          })
        })
        if (res.data.code === 0) {
          await this.getAllcompany()
          // const index = this.companys[this.companyIndex].businesses[this.businessIndex].libs.length - 1
          // this.businessIndex = this.companys[this.companyIndex].businesses[index].libs.id
          this.addVioceprintDbDialog = false
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    async editVoiceprintDbConfirm() {
      await this.getScenes()
      this.editVioceprintDbData.name = this.voiceprintData.DbName
      this.editVioceprintDbData.scene = this.voiceprintData.scene
      this.editVioceprintDbData.uid = this.voiceprintData.uid
      this.editVioceprintDbDialog = true
    },
    async editVoiceprintDb() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/' + this.voiceprintData.companyName + '/' + this.voiceprintData.businessName + '/updateasvlib',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.token },
          data: qs.stringify({
            lib_id: this.voiceprintData.id,
            lib_name: this.editVioceprintDbData.name,
            lib_nodeid: this.editVioceprintDbData.uid,
            lib_scene: this.editVioceprintDbData.scene
          })
        })
        if (res.data.code === 0) {
          this.voiceprintData.DbName = this.editVioceprintDbData.name
          this.voiceprintData.scene = this.editVioceprintDbData.scene
          this.voiceprintData.uid = this.editVioceprintDbData.uid
          this.editVioceprintDbDialog = false
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    deleteVoiceprintDbConfirm() {
      this.deleteVoiceprintDbDialog = true
    },
    async deleteVoiceprintDb() {
      try {
        const res = await this.$http({
          method: 'GET',
          headers: { 'Authorization': this.token },
          url: this.$apiUrl + '/admin/' + this.voiceprintData.companyName + '/' + this.voiceprintData.businessName + '/deleteasvlib?lib_name=' + this.voiceprintData.DbName
        })
        if (res.data.code === 0) {
          await this.getAllcompany()
          this.deleteVoiceprintDbDialog = false
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
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

.detail {
  float: left;
  width: 58%;
  height: auto;
}

.overview {
  margin-bottom: 5px;
  width: 20%;
  float: left;
  height: auto;
}

.form {
  margin-left: 5%;
}

.button-backpu {
  float: left;
  margin-left: 10px;
}

.box-card {
  min-height: 100%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.clearfix {
  height: 20px;
}

.center-input {
  width: 80%;
}
</style>
