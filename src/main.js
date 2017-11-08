import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // 权限
import IEcharts from 'vue-echarts-v3/src/full.vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import Iview from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(VueAxios, axios)
Vue.component(IEcharts.name, IEcharts)

Vue.use(ElementUI)
Vue.use(Iview)

import config from '../config'
Vue.prototype.$apiUrl = process.env.NODE_ENV === 'development'
? JSON.parse(config.dev.env.BASE_API)
: JSON.parse(config.build.env.BASE_API)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
