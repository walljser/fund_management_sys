<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="交易号">
          <el-input v-model="filters.transId" placeholder="交易号"></el-input>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="filters.transType" placeholder="请选择">
            <el-option label="全部" value=""/>
            <el-option label="申购" value="申购"/>
            <el-option label="赎回" value="赎回"/>
            <el-option label="存款" value="存款"/>
            <el-option label="取款" value="取款"/>
            <el-option label="转账" value="转账"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户账号">
          <el-input v-model="filters.clientId" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item label="对方账号">
          <el-input v-model="filters.targetId" placeholder="对方账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="groupSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="userRecords"
      highlight-current-row
      v-loading="loading"
      style="width: 100%;"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="transId" label="交易号" width="100" sortable />
      <el-table-column prop="clientUser.clientName" label="姓名" width="120" sortable />
      <el-table-column prop="clientUser.clientId" label="用户账号" sortable />
      <el-table-column prop="targetId" label="目标账户" sortable>
      </el-table-column>
      </el-table-column>
      <el-table-column prop="transType" label="交易类型" width="120" sortable>
      </el-table-column>
      <el-table-column prop="transPrice" label="金额" sortable
        :formatter="amountFormatter"
      >
      </el-table-column>
      <el-table-column prop="createDate" label="日期" width="130" sortable
        :formatter="dateFormatter"
      >
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
import { get as getUserRecordList } from '@/services/order'
import storage from '@/utils/storage'


export default {
  data() {
    return {
      filters: {
        transId: '',
        transType: '',
        clientId: '',
        targetId: ''
      },
      loading: false,
      userRecords: [
      ],
      pageSize: 5,
      currentPage: 1,
      total: 5
    }
  },
  methods: {
    //获取用户交易记录列表
    async getuserRecords (pageNo = 1) {
      this.loading = true
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      const res = await getUserRecordList({
        pageNo,
        transId: this.filters.transId,
        transType: this.filters.transType,
        clientId: this.filters.clientId,
        targetId: this.filters.targetId,
        token,
        adminId
      })
      if (res.resultcode === 0) {
        this.loading = false
        this.userRecords = res.data.listHelper
        this.total = res.data.total
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
    },
    dateFormatter(row, column) {
      if (row.createDate)
        return row.createDate.slice(0, 10)
      else
        return row.createDate
    },
    amountFormatter(row, column) {
      if (row.transPrice)
        return row.transPrice.toFixed(2) + ' 元'
      else
        return row.transPrice
    },
    groupSearch() {
      this.getuserRecords(this.currentPage)
    }
  },
  watch: {
    currentPage(val) {
      this.getuserRecords(val)
    }
  },
  mounted() {
    this.getuserRecords()
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
</style>
