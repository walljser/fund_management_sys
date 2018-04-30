<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="用户账号">
          <el-input v-model="filters.clientId" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="filters.clientName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="filters.sex" placeholder="请选择">
            <el-option label="全部" value=""/>
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="激活状态">
          <el-select v-model="filters.status" placeholder="请选择">
            <el-option label="全部" value=""/>
            <el-option label="正常" value="true"/>
            <el-option label="冻结" value="false"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="groupSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="loading"
      style="width: 100%;"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="clientId" label="账号" sortable />
      <el-table-column prop="clientName" label="姓名" width="120" sortable>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="90" sortable>
      </el-table-column>
      <el-table-column prop="balance" label="余额 （元）" :formatter="formatBalance" sortable>
      </el-table-column>
      <el-table-column prop="email" label="邮箱号" sortable>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="130" sortable>
      </el-table-column>
      <el-table-column prop="active" label="账号状态" :formatter="formatStatus" width="130" sortable>
      </el-table-column>
      <el-table-column label="操作" prop="active">
        <template scope="scope">
          <el-button :type="scope.row.active == true ? 'primary' : 'danger'" size="small" @click="handleUpdateStatus(scope.$index, scope.row)">{{scope.row.active | filterStatusButton}}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        style="float:right;">
      </el-pagination>
    </el-col>

  </section>
</template>
<script type="text/ecmascript-6">
import { get as getUserList, update as updateUser } from '@/services/users'
import storage from '@/utils/storage'
export default {
  data() {
    return {
      filters: {
        clientId: '',
        clientName: '',
        sex: '',
        status: ''
      },
      loading: false,
      users: [
      ],
      pageSize: 5,
      currentPage: 1,
      total: 5
    }
  },
  methods: {
    groupSearch() {
      this.getUsers(this.currentPage)
    },
    //获取用户列表
    async getUsers (pageNo = 1) {
      this.loading = true
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      const res = await getUserList({
        clientId: this.filters.clientId,
        clientName: this.filters.clientName,
        sex: this.filters.sex,
        status: this.filters.status,
        adminId,
        token,
        pageNo
      })
      if (res.resultcode === 0) {
        this.loading = false
        this.users = res.data.listHelper
      }
      this.total = res.data.total
    },
    formatBalance(row, column) {
      return row.balance.toFixed(2)
    },
    //性别显示转换
    formatSex: function (row, column) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
    },
    formatStatus(row, column) {
      return row.active === true ? '正常' : '冻结'
    },
    async handleUpdateStatus(index, row) {
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      const clientId = row.clientId
      const active = row.active
      if (active === true) {
        const res = await updateUser({ adminId, clientId, active: 'false', token })
        if (res.resultcode === 0) {
          this.$message({
            message: '账户冻结成功',
            type: 'success'
          })
          this.getUsers(this.currentPage)
        } else if (res.resultcode === -2) {
          this.$message({
            message: '您的登录已过期，请重新登录',
            type: 'error'
          })
          this.$router.push({ name: 'login' })
        } else {
          this.$message({
            message: res.message,
            type: 'info'
          })
        }
      } else {
        const res = await updateUser({ adminId, clientId, active: 'true', token })
        if (res.resultcode === 0) {
          this.$message({
            message: '账户激活成功',
            type: 'success'
          })
          this.getUsers(this.currentPage)
        } else if (res.resultcode === -2) {
          this.$message({
            message: '您的登录已过期，请重新登录',
            type: 'error'
          })
          this.$router.push({ name: 'login' })
        } else {
          this.$message({
            message: res.message,
            type: 'info'
          })
        }
      }
    },
    tableRowClassName(row, index) {
      if (row.active === false) {
        return 'frozen-row';
      }
      return '';
    },
    handleCurrentChange(value) {
      this.currentPage = value
    }
  },
  watch: {
    currentPage(val) {
      this.getUsers(val)
    }
  },
  mounted() {
    this.getUsers()
  },
  filters: {
    filterStatusButton(val) {
      return val === true ? '冻结' : '激活'
    }
  }
};

</script>

<style lang="scss">
@import "~@/assets/scss/_vars.scss";

.el-table .frozen-row {
  background-color: #F7BA2A;
}
.el-table .fund-frozen-row {
  background-color: #F7BA2A;
}
</style>
