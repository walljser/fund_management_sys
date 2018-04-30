<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">基金管理系统</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios'
import storage from '@/utils/storage'
import { get as doLogin } from '@/services/admin'
//import NProgress from 'nprogress'
export default {
  data() {
    return {
      logining: false,
      ruleForm2: {
        account: '',
        checkPass: ''
      },
      rules2: {
        account: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
        ],
        checkPass: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
        ]
      },
      checked: false
    };
  },
  methods: {
    async handleSubmit2(ev) {
      const res = await doLogin(this.ruleForm2.account, this.ruleForm2.checkPass)
      console.log(res)
      if (res.resultcode === 0) {
        const {
          token,
          userNo
        } = res.data
        storage.setSession('userNo', userNo)
        storage.setSession('token', token)
        if (this.checked === true) {
          storage.setLocal('fundmanagement_account', this.ruleForm2.account)
          storage.setLocal('fundmanagement_pass', this.ruleForm2.checkPass)
        } else {
          storage.removeLocal('fundmanagement_account')
          storage.removeLocal('fundmanagement_pass')
        }
        this.$router.push({ path: '/table' })
      } else {
        this.$message(res.message)
      }
    }
  },
  created() {
    const account = storage.getLocal('fundmanagement_account')
    const pass = storage.getLocal('fundmanagement_pass')
    if (account && pass) {
      this.ruleForm2.account = account
      this.ruleForm2.checkPass = pass
      this.checked = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
