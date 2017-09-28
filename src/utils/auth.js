import Cookies from 'js-cookie'

const TokenKey = 'Authorization'
const Role = 'Role'
const User = 'User'
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
export function setUser(user) {
  return Cookies.set(User, user)
}
export function getUser() {
  return Cookies.get(User)
}
export function removeToken() {
  Cookies.remove(TokenKey)
  Cookies.remove(User)
  return Cookies.remove(Role)
}
