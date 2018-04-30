import Login from '@/views/Login.vue'
import NotFound from '@/views/404.vue'
import Home from '@/views/Home.vue'
import Main from '@/views/Main.vue'
import Table from '@/views/nav1/Table.vue'
import user from '@/views/nav2/user.vue'
import types from '@/views/nav1/type'
import userRecord from '@/views/nav2/userRecord.vue'
import echarts from '@/views/charts/echarts.vue'
import feature from '@/views/feature'
import fundRecord from '@/views/nav1/fundRecord'

let routes = [{
    path: '/login',
    component: Login,
    name: 'login',
    hidden: true
  }, {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  //{ path: '/main', component: Main },
  {
    path: '/',
    component: Home,
    name: '基金管理',
    iconCls: 'el-icon-message', //图标样式class
    children: [{
      path: '/main',
      component: Main,
      name: 'home',
      hidden: true
    }, {
      path: '/table',
      component: Table,
      name: '基金列表'
    }, {
      path: '/fundRecord',
      component: fundRecord,
      name: '基金交易记录'
    }, {
      path: '/fundTypes',
      component: types,
      name: '基金类型管理'
    }]
  }, {
    path: '/',
    component: Home,
    name: '客户管理',
    iconCls: 'fa fa-address-card',
    leaf: false, //只有一个节点
    children: [{
      path: '/user',
      component: user,
      name: '客户列表'
    }, {
      path: '/userRecord',
      component: userRecord,
      name: '客户交易记录'
    }]
  }, {
    path: '/',
    component: Home,
    name: '统计中心',
    leaf: true,
    iconCls: 'fa fa-bar-chart',
    children: [{
      path: '/echarts',
      component: echarts,
      name: '数据统计'
    }]
  }, {
    path: '*',
    hidden: true,
    redirect: {
      path: '/404'
    }
  }, {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-database',
    leaf: true,
    children: [{
      path: '/advertisment',
      component: feature,
      name: '广告管理'
    }]
  }
];

export default routes;
