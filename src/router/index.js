// import Vue from 'vue'
// import Router from 'vue-router'
// const _import = require('./_import_' + process.env.NODE_ENV)
// // in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

// /* layout */
// import Layout from '../views/layout/Layout'

// /* login */
// const Login = _import('login/index')

// /* dashboard */
// const dashboard = _import('dashboard/index')

// // serverConfiguration
// const server = _import('serverConfiguration/server')
// const authorize = _import('serverConfiguration/authorize')

// // voiceprintManagement
// const voiceprintDatabase = _import('voiceprintManagement/voiceprintDatabase')
// const automaticBackup = _import('voiceprintManagement/automaticBackup')

// // sceneManagement
// const parameterConfiguration = _import('sceneManagement/parameterConfiguration')
// const sceneConfiguration = _import('sceneManagement/sceneConfiguration')

// // setting
// const accountManagement = _import('setting/accountManagement')
// const alarmSetting = _import('setting/alarmSetting')
// const loginLog = _import('setting/loginLog')
// const operationLog = _import('setting/operationLog')
// const technicalSupport = _import('setting/technicalSupport')

// /* error page */
// const Err404 = _import('404')

// Vue.use(Router)

//  /**
//   * icon : the icon show in the sidebar
//   * hidden : if `hidden:true` will not show in the sidebar
//   * redirect : if `redirect:noredirect` will not redirct in the levelbar
//   * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
//   * meta : `{ role: ['admin'] }`  will control the page role
//   **/
// export const constantRouterMap = [
//   { path: '/login', component: Login, hidden: true },
//   { path: '/404', component: Err404, hidden: true },
//   {
//     path: '/',
//     component: Layout,
//     redirect: '/dashboard',
//     name: '服务器概览',
//     hidden: true,
//     children: [{ path: 'dashboard', component: dashboard }]
//   }
// ]

// export default new Router({
//   mode: 'history', // 后端支持可开
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRouterMap
// })

// export const asyncRouterMap = [
//   {
//     path: '/serverConfiguration',
//     component: Layout,
//     redirect: 'noredirect',
//     name: '服务器配置',
//     icon: 'server',
//     children: [
//       { path: 'server', component: server, name: '服务器', icon: 'zujian' },
//       { path: 'authorize', component: authorize, name: '授权', icon: 'zujian' }
//     ]

//   },
//   {
//     path: '/voiceprintManagement',
//     component: Layout,
//     redirect: 'noredirect',
//     name: '声纹库管理',
//     icon: 'tubiao',
//     children: [
//       { path: 'voiceprintDatabase', component: voiceprintDatabase, name: '声纹库', meta: { role: ['admin'] }},
//       { path: 'automaticBackup', component: automaticBackup, name: '自动备份设置', meta: { role: ['admin'] }}
//     ]
//   },
//   {
//     path: '/sceneManagement',
//     component: Layout,
//     redirect: 'noredirect',
//     name: '场景管理',
//     icon: 'zujian',
//     children: [
//       { path: 'parameterConfiguration', component: parameterConfiguration, name: '参数配置', meta: { role: ['admin'] }},
//       { path: 'sceneConfiguration', component: sceneConfiguration, name: '场景配置', meta: { role: ['admin'] }}
//     ]
//   },
//   {
//     path: '/setting',
//     component: Layout,
//     redirect: 'noredirect',
//     name: '设置',
//     icon: 'setting',
//     children: [
//       { path: 'accountManagement', component: accountManagement, name: '账号管理', meta: { role: ['admin'] }},
//       { path: 'alarmSetting', component: alarmSetting, name: '报警设置', meta: { role: ['admin'] }},
//       { path: 'loginLog', component: loginLog, name: '登陆日志', meta: { role: ['admin'] }},
//       { path: 'operationLog', component: operationLog, name: '操作日志', meta: { role: ['admin'] }},
//       { path: 'technicalSupport', component: technicalSupport, name: '技术支持', meta: { role: ['admin'] }}
//     ]
//   },

//   { path: '*', redirect: '/404', hidden: true }
// ]

import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

/* login */
const Login = _import('login/index')

/* dashboard */
const dashboard = _import('dashboard/index')

// serverConfiguration
const server = _import('serverConfiguration/server')
const authorize = _import('serverConfiguration/authorize')

// voiceprintManagement
const voiceprintDatabase = _import('voiceprintManagement/voiceprintDatabase')
const automaticBackup = _import('voiceprintManagement/automaticBackup')

// sceneManagement
const parameterConfiguration = _import('sceneManagement/parameterConfiguration')
const sceneConfiguration = _import('sceneManagement/sceneConfiguration')

// setting
const accountManagement = _import('setting/accountManagement')
const alarmSetting = _import('setting/alarmSetting')
const loginLog = _import('setting/loginLog')
const operationLog = _import('setting/operationLog')
const technicalSupport = _import('setting/technicalSupport')

/* error page */
const Err404 = _import('404')

Vue.use(Router)

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '服务器概览',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  },
  {
    path: '/serverConfiguration',
    component: Layout,
    redirect: 'noredirect',
    name: '服务器配置',
    icon: 'server',
    children: [
      { path: 'server', component: server, name: '服务器', icon: 'zujian' },
      { path: 'authorize', component: authorize, name: '授权', icon: 'zujian' }
    ]

  },
  {
    path: '/voiceprintManagement',
    component: Layout,
    redirect: 'noredirect',
    name: '声纹库管理',
    icon: 'tubiao',
    children: [
      { path: 'voiceprintDatabase', component: voiceprintDatabase, name: '声纹库' },
      { path: 'automaticBackup', component: automaticBackup, name: '自动备份设置' }
    ]
  },
  {
    path: '/sceneManagement',
    component: Layout,
    redirect: 'noredirect',
    name: '场景管理',
    icon: 'zujian',
    children: [
      { path: 'parameterConfiguration', component: parameterConfiguration, name: '参数配置' },
      { path: 'sceneConfiguration', component: sceneConfiguration, name: '场景配置' }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: 'noredirect',
    name: '设置',
    icon: 'setting',
    children: [
      { path: 'accountManagement', component: accountManagement, name: '账号管理' },
      { path: 'alarmSetting', component: alarmSetting, name: '报警设置' },
      { path: 'loginLog', component: loginLog, name: '登陆日志' },
      { path: 'operationLog', component: operationLog, name: '操作日志' },
      { path: 'technicalSupport', component: technicalSupport, name: '技术支持' }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  // base: '/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // { path: 'operationLog', component: operationLog, name: '操作日志', meta: { role: ['admin'] }}
]
// export const asyncRouterMap = [
//   {
//     path: '/serverConfiguration',
//     component: Layout,
//     redirect: 'noredirect',
//     name: '服务器配置',
//     icon: 'server',
//     children: [
//       { path: 'server', component: server, name: '服务器', icon: 'zujian' },
//       { path: 'authorize', component: authorize, name: '授权', icon: 'zujian' }
//     ]

//   },
//   {
//     path: '/voiceprintManagement',
//     component: Layout,
//     redirect: 'noredirect',
//     name: '声纹库管理',
//     icon: 'tubiao',
//     children: [
//       { path: 'voiceprintDatabase', component: voiceprintDatabase, name: '声纹库' },
//       { path: 'automaticBackup', component: automaticBackup, name: '自动备份设置' }
//     ]
//   },
//   {
//     path: '/sceneManagement',
//     component: Layout,
//     redirect: 'noredirect',
//     name: '场景管理',
//     icon: 'zujian',
//     children: [
//       { path: 'parameterConfiguration', component: parameterConfiguration, name: '参数配置' },
//       { path: 'sceneConfiguration', component: sceneConfiguration, name: '场景配置' }
//     ]
//   },
//   {
//     path: '/setting',
//     component: Layout,
//     redirect: 'noredirect',
//     name: '设置',
//     icon: 'setting',
//     children: [
//       { path: 'accountManagement', component: accountManagement, name: '账号管理' },
//       { path: 'alarmSetting', component: alarmSetting, name: '报警设置' },
//       { path: 'loginLog', component: loginLog, name: '登陆日志' },
//       { path: 'operationLog', component: operationLog, name: '操作日志' },
//       { path: 'technicalSupport', component: technicalSupport, name: '技术支持' }
//     ]
//   },

//   { path: '*', redirect: '/404', hidden: true }
// ]
