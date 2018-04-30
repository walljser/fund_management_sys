import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import axios from 'axios'
import storage from '@/utils/storage'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) =>{
  // NProgress.start();
  if (to.path == '/login') {
    storage.removeSession('userNo')
    storage.removeSession('token')
  }
  let userNo = storage.getSession('userNo')
  let token = storage.getSession('token')
  if (!token && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

axios.interceptors.response.use(function (response) {
  return response.data
}, function(error) {
  return Promise.reject(error)
})

var v = new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')



axios.interceptors.response.use(function (response) {
  if (response.resultcode === -2) {
    v.$message({
      message: '您的登录已过期，请重新登录',
      type: 'error'
    })
    v.$router.push({ name: 'login' })
  } else {
    return response
  }
}, function(error) {
  return Promise.reject(error)
})
