import fetch from '@/utils/fetch'
const qs = require('qs')

export function login(username, password) {
  return fetch({
    url: '/login',
    // url: '/user/login',
    method: 'post',
    data: qs.stringify({
      username,
      password
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// export function getInfo(token) {
//   return fetch({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  })
}
