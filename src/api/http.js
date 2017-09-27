import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import { getToken } from '@/utils/auth'

axios.interceptors.request.use(config => {
  NProgress.start()
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))

function checkCode(res) {
  if (res.data.code !== 0) {
    // this.$message(
    //   {
    //     type: 'error',
    //     msg: res.data.message
    //   }
    // )
  }
  return res
}

export default {
  post(url, data) {
    return axios({
      method: 'POST',
      url,
      data: qs.stringify(data),
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded;',
        'Authorization': getToken()
      }
    }).then(checkCode)
  },
  get(url, params) {
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000,
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkCode)
  }
}
