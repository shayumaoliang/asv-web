import { login } from '@/api/login'
import { getToken, getRole, setToken, setRole, removeToken, getUser, setUser } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userName: getUser(),
    name: '',
    roles: getRole()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    // SET_AVATAR: (state, avatar) => {
    //   state.avatar = avatar
    // },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          // console.log(response)
          // const data = response.data
          setToken(response.token)
          setUser(response.user)
          commit('SET_TOKEN', response.token)
          commit('SET_NAME', response.user)
          if (response.admin === true) {
            commit('SET_ROLES', 'admin')
            setRole('admin')
          } else {
            commit('SET_ROLES', 'nonAdmin')
            setRole('nonAdmin')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.token).then(response => {
    //       const data = response.data
    //       commit('SET_ROLES', data.user)
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        removeToken()
        resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
