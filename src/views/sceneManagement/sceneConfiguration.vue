<template>
  <div class="dashboard-container">
    <h4>
      <icon-svg icon-class="vertical"></icon-svg>场景配置
      <el-button v-if="getRole()" class="add-button" type="primary" size="small" @click="impirtSceneConfir()">导入场景</el-button>
    </h4>
    <el-card class="view" v-for="(scene, index) of scenes" :key="index">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">{{ scene.name }}</span>
        <el-button v-if="getRole()" size="small" class="delete-icon el-icon-delete" @click="deleteSceneConfir(index)">删除</el-button>
      </div>
      <p>{{ scene.description }}</p>
    </el-card>
    <el-form :model="newSenceData" label-width="100px">
      <el-dialog title="导入场景" :visible.sync="impirtSceneDialog" size="tiny">
        </el-form-item>
        <el-form-item label="场景名">
          <el-input v-model="newSenceData.name"></el-input>
        </el-form-item>
        <el-form-item label="模型路径">
          <el-input v-model="newSenceData.modelPath"></el-input>
        </el-form-item>
        <el-form-item label="模型描述">
          <el-input type="textarea" v-model="newSenceData.description"></el-input>
        </el-form-item>
        <span slot="footer" class="dialog-footer">
          <el-button @click="impirtSceneDialog = false">取 消</el-button>
          <el-button type="primary" @click="impirtScene">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
    <el-dialog title="是否删除该场景？" :visible.sync="deleteSceneDialog" size="tiny">
      <span>删除后不可恢复，请谨慎操作。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteSceneDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteScene">确 定</el-button>
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
      impirtSceneDialog: false,
      deleteSceneDialog: false,
      newSenceData: {},
      scenes: [],
      sceneIndex: null
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
    async showAllScenes() {
      try {
        const res = await this.$http.get(this.$apiUrl + '/api/allscenes')
        if (res.data.code === 0) {
          const scenes = res.data.scenes
          for (let i = 0; i < scenes.length; i++) {
            const scene = {}
            scene.name = scenes[i].scene_name
            scene.modelPath = scenes[i].scene_model_path
            scene.description = scenes[i].scene_description
            this.scenes.push(scene)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    impirtSceneConfir(index) {
      this.impirtSceneDialog = true
      console.log(index)
    },
    async impirtScene() {
      try {
        const res = await this.$http({
          method: 'POST',
          url: this.$apiUrl + '/admin/createscene',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: qs.stringify(
            {
              scene_name: this.newSenceData.name,
              scene_model_path: this.newSenceData.modelPath,
              scene_description: this.newSenceData.description
            }
          )
        })
        if (res.data.code === 0) {
          this.scenes.push(
            {
              name: this.newSenceData.name,
              modelPath: this.newSenceData.modelPath,
              description: this.newSenceData.description
            }
          )
          this.impirtSceneDialog = false
          this.$message(
            {
              showClose: true,
              type: 'success',
              message: '创建成功'
            }
          )
        } else {
          if (res.data.code === 702) {
            this.$message(
              {
                showClose: true,
                type: 'error',
                message: '场景名重复了，请更换再尝试创建'
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
        }
      } catch (e) {
        console.log(e)
      }
    },
    deleteSceneConfir(index) {
      this.deleteSceneDialog = true
      this.sceneIndex = index
    },
    async deleteScene() {
      try {
        const res = await this.$http.get(this.$apiUrl + '/admin/deletescene?scenename=' + this.scenes[this.sceneIndex].name)
        if (res.data.code === 0) {
          this.deleteSceneDialog = false
          this.scenes.splice(this.sceneIndex, 1)
          this.$message(
            {
              showClose: true,
              type: 'success',
              message: '删除成功'
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
      } catch (e) {
        console.log(e)
      }
    }
  },
  async mounted() {
    await this.showAllScenes()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 8px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.view {
  width: 31%;
  float: left;
  margin-right: 1%;
}

.add-button {
  float: right;
  margin-right: 80%;
}

.delete-icon {
  float: right;
  margin: 10px;
}
</style>
