<template>
  <div class="dashboard-container">
    <!-- <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                                  <el-submenu>
                                    <template slot="title">
                                      <i class="el-icon-menu"></i>平安集团
                                    </template>
                                    <div v-for="(voiceprntData, index) of voiceprntDatabase" :key="index">
                                      <el-menu-item-group>
                                          <template slot="title">
                                            {{ voiceprntData.companyName }}
                                            <el-button class="button-mini" type="primary" icon="delete" size="mini"></el-button>
                                            <el-button class="button-mini" type="primary" icon="edit" size="mini"></el-button>
                                            <el-button class="button-mini" type="primary" icon="plus" size="mini"></el-button>
                                          </template>
                                          <div v-for="(business, index) of voiceprntDatabase[index].business" :key="index">
                                            <el-menu-item-group>
                                                <template slot="title">
                                                  {{ business['businessName'] }}
                                                  <el-button class="button-mini" type="primary" icon="delete" size="mini"></el-button>
                                                  <el-button class="button-mini" type="primary" icon="edit" size="mini"></el-button>
                                                  <el-button class="button-mini" type="primary" icon="plus" size="mini"></el-button>
                                                </template>
                                                <el-menu-item-group>
                                                  <template slot="title">
                                                    {{ voiceprntData.business.database }}
                                                    <el-button class="button-mini" type="primary" icon="delete" size="mini"></el-button>
                                                    <el-button class="button-mini" type="primary" icon="edit" size="mini"></el-button>
                                                    <el-button class="button-mini" type="primary" icon="plus" size="mini"></el-button>
                                                  </template>
                                                </el-menu-item-group>
                                            </el-menu-item-group>
                                          </div>
                                      </el-menu-item-group>
                                    </div>
                                  </el-submenu>
                                </el-menu> -->
    <div class="overview">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>声纹库列表</h4>
      <el-menu unique-opened='true' mode="vertical" class="el-menu" @open="handleOpen" @close="handleClose">
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
      </el-menu>
    </div>
    <div class="detail">
      <h4>
        <icon-svg icon-class="vertical"></icon-svg>声纹库详情</h4>
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
      voiceprntDatabase: [
        {
          companyName: '平安银行',
          business: [
            {
              businessName: '贷款',
              database: [
                '一号',
                '二号'
              ]
            },
            {
              businessName: '借款',
              database: [
                '一号',
                '二号'
              ]
            }
          ]
        },
        {
          companyName: '不安银行',
          business: [
            {
              businessName: '贷款',
              database: [
                '一号',
                '二号'
              ]
            },
            {
              businessName: '借款',
              database: [
                '一号',
                '二号'
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
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
  margin-right: 1%;
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
</style>
