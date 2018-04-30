export default {
  setLocal(name, content) {
    if (!name) return
    if (typeof content !== 'String')
      content = JSON.stringify(content)
    window.localStorage.setItem(name, content)
  },
  getLocal(name) {
    if (!name) return
    return JSON.parse(window.localStorage.getItem(name))
  },
  removeLocal(name) {
    if (!name) return
    return window.localStorage.removeItem(name)
  },
  setSession(name, content) {
    if (!name) return
    if (typeof content !== 'String')
      content = JSON.stringify(content)
    window.sessionStorage.setItem(name, content)
  },
  getSession(name) {
    if (!name) return
    return JSON.parse(window.sessionStorage.getItem(name))
  },
  removeSession(name) {
    if (!name) return
    return window.sessionStorage.removeItem(name)
  }
}
