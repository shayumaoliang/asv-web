import Cookies from 'js-cookie'

const TokenKey = 'Authorization'
const Role = 'Role'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setRole(role) {
  return Cookies.set(Role, role)
}

export function getRole() {
  return Cookies.get(Role)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
