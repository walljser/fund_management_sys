<template>
	<section>
		<!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="基金号">
          <el-input v-model="filters.fundId" placeholder="基金号"></el-input>
        </el-form-item>
        <el-form-item label="基金名称">
          <el-input v-model="filters.fundName" placeholder="基金名称"></el-input>
        </el-form-item>
        <el-form-item label="基金状态">
          <el-select v-model="filters.status" placeholder="请选择">
            <el-option label="全部" value=""/>
            <el-option label="已上市" value="已上市"/>
            <el-option label="未上市" value="未上市"/>
          </el-select>
        </el-form-item>
        <el-form-item label="基金类型">
          <el-select v-model="filters.typeId" placeholder="请选择">
            <el-option
              v-for="item in fundTypes"
              :key="item.fundTypeId"
              :label="item.fundTypeName"
              :value="item.fundTypeId">
            </el-option>
            <el-option
              label="全部"
              value=""
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="groupSearch">查询</el-button>
          <el-button type="primary" @click="handleAdd">基金上市</el-button>
        </el-form-item>
      </el-form>
    </el-col>

		<!--列表-->
		<el-table
      :data="funds"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
      :row-class-name="tableRowClassName"
    >

			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="fundNo" label="id" width="70" sortable>
			</el-table-column>
			<el-table-column prop="fundName" label="基金名" sortable/>
      <el-table-column prop="rate" label="年转化率" width="130" sortable :formatter="formatRate"/>
      <el-table-column prop="earnings" label="万份收益" width="120" sortable/>
      <el-table-column prop="fundType.fundTypeName" label="类型" width="100" sortable/>
			<el-table-column prop="fundStatus" label="状态" width="90" sortable>
			</el-table-column>
			<el-table-column prop="fundCreateDate" label="成立时间" width="120" sortable>
			</el-table-column>

			<el-table-column label="操作">
				<template scope="scope">
          <el-button type="danger" v-if="scope.row.fundStatus === '未上市'" size="small" @click="frozenOrActive(scope.$index, scope.row)">基金上市</el-button>
          <el-button type="success" v-if="scope.row.fundStatus === '已上市'" size="small" @click="frozenOrActive(scope.$index, scope.row)">基金下市</el-button>
					<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        style="float:right;">
      </el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="基金名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="基金类型">
          <el-select v-model="typeId" placeholder="请选择">
            <el-option
              v-for="item in fundTypes"
              :key="item.fundTypeId"
              :label="item.fundTypeName"
              :value="item.fundTypeId">
            </el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="成立时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.date" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="editForm.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加基金" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="基金名">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="基金类型">
          <el-select v-model="typeId" placeholder="请选择">
            <el-option
              v-for="item in fundTypes"
              :key="item.fundTypeId"
              :label="item.fundTypeName"
              :value="item.fundTypeId">
            </el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.date"></el-date-picker>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="addForm.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import storage from '@/utils/storage'
import axios from 'axios'
import {
  add as addFund,
  get as getFund,
  remove as removeFund,
  update as updateFund,
  batchRemove as batchRemoveFund,
  modifyStatus
} from '@/services/fund'
import { get as getTypes } from '@/services/fundTypes'


export default {
  data() {
    return {
      filters: {
        fundId: '',
        fundName: '',
        status: '',
        typeId: ''
      },
      fundTypes: [],
      funds: [],
      total: 10,
      pageSize: 5,
      currentPage: 1,
      listLoading: false,
      sels: [], //列表选中列
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{
          required: true,
          message: '请输入基金名',
          trigger: 'blur'
        }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: '',
        status: -1,
        date: '',
        desc: '',
        earnings: 0
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{
          required: true,
          message: '请输入基金名',
          trigger: 'blur'
        }]
      },
      //新增界面数据
      addForm: {
        name: '',
        status: -1,
        date: '',
        desc: '',
        earnings: 0
      },
      typeId: 1
    }
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
    },
    formatRate: function(row, column) {
      let rate = (row.rate * 100).toFixed(4)
      return rate + '%'
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getFunds(this.currentPage);
    },

    // 获取基金列表
    async getFunds(currentPage = 1) {
      this.listLoading = false
      const res = await getFund({
        fundId: this.filters.fundId,
        fundName: this.filters.fundName,
        status: this.filters.status,
        typeId: this.filters.typeId,
        currentPage
      })
      this.funds = res.data.listHelper
      if (this.funds) {
        this.funds.map((item) => {
          item.earnings = ((item.rate * 10000) / 365).toFixed(4)
        })
      }
      this.total = res.data.total
    },
    // 获取基金类型
    async getFundTypes() {
      const token = storage.getSession('token')
      const res = await getTypes(token)
      this.fundTypes = res.data.fundTypes
    },
    //删除
    handleDel: function(index, row) {
      const fundNo = row.fundNo
      const adminId = storage.getSession('userNo')
      const token = storage.getSession('token')
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(async () => {
        this.listLoading = true
        const res = await removeFund({adminId, fundNo, token})
        if (res.resultcode === 0) {
          this.listLoading = false
          this.$message({
            message: '刪除成功',
            type: 'success'
          })
          this.getFunds()
        } else {
          this.listLoading = false
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      }).catch(() => {

      });
    },
    groupSearch() {
      this.getFunds(this.currentPage)
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      const {
        fundNo,
        fundName,
        fundStatus,
        fundDescribe,
        fundCreateDate,
        fundType
      } = row
      this.editForm.id = fundNo
      this.editForm.name = fundName
      this.editForm.status = fundStatus
      this.typeId = fundType.fundTypeId
      this.editForm.desc = fundDescribe
      this.editForm.date = fundCreateDate
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        date: '',
        desc: ''
      }
      this.typeId = 1
    },
    //编辑
    editSubmit: function() {
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      this.$confirm('确认提交吗？', '提示', {}).then(async () => {
        this.editLoading = true;
        console.log('here: typeId: ' + this.typeId)
        const res = await updateFund(this.editForm, {adminId, typeId: this.typeId, token})
        if (res.resultcode === 0) {
          this.editLoading = false
          this.editFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getFunds()
        }
      }).catch(() => {

      })
    },
    //新增
    async addSubmit() {
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      console.log(this.addForm)
      try {
        await this.$confirm('确认添加基金吗？', '提示', {})
        this.addLoading = true
        const res = await addFund(this.addForm, {adminId, typeId: this.typeId, token})
        this.addLoading = false
        if (res.resultcode === 0) {
          this.$message('添加基金成功！')
          this.addFormVisible = false
          this.getFunds()
        } else if (res.resultcode === -1 && res.message === '基金名已经存在') {
          this.$message(res.message)
        } else if (res.resultcode === -1 && res.message === '您的token不合法或者过期了，请重新登陆') {
          this.$message('登录已过期，请重新登录，谢谢！')
          storage.removeSession('userNo')
          storage.removeSession('token')
          this.$router.push({
            path: 'login'
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      var fundNos = this.sels.map(item => item.fundNo).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        this.listLoading = true;
        const res = await batchRemoveFund({adminId, fundNos, token})
        console.log(res)
        if (res.resultcode === 0) {
          this.listLoading = false
          this.$message({
            message: '刪除成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.getFunds()
      }).catch(() => {

      });
      this.getFunds()
    },
    // 基金上下市控制
    frozenOrActive(index, row) {
      console.log(row)
      const fundStatus = row.fundStatus === '已上市' ? 'false' : 'true'
      const statusFont = row.fundStatus === '已上市' ? '下市' : '上市'
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      this.$confirm(`确认要 ${statusFont} 此款基金吗?`, '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await modifyStatus({
          adminId,
          fundStatus,
          fundId: row.fundNo,
          token
        })
        if (res.resultcode === 0) {
          this.$message({
            message: `${statusFont} 此款基金成功`,
            type: 'success'
          })
          this.getFunds(this.currentPage)
        } else {
          console.log('here')
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
          message: '已取消此次操作',
          type: 'info'
        })
      })
    },
    tableRowClassName(row, index) {
      if (row.fundStatus === '未上市') {
        return 'fund-frozen-row';
      }
      return '';
    }
  },
  mounted() {
    this.getFunds()
    this.getFundTypes()
  }
}
</script>

<style scoped>

</style>
