<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click.native.prevent="handleAdd">添加基金类型</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="types"
      highlight-current-row
      v-loading="loading"
      style="width: 100%;"
    >
      <el-table-column prop="fundTypeId" label="基金号" width="130" sortable />
      <el-table-column prop="fundTypeName" label="基金类型名称" width="200" sortable />
      <el-table-column prop="fundTypeDescribe" label="基金类型描述" width="400" sortable />
      <el-table-column label="操作" prop="active">
        <template scope="scope">
          <el-button type="danger" size="small" @click="handleRemoveStatus(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增界面-->
    <el-dialog title="添加基金" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="基金类型名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="基金类型描述" prop="desc">
          <el-input type="textarea" v-model="addForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native.prevent="addSubmit('addForm')" :loading="addLoading">添加</el-button>
      </div>
    </el-dialog>

  </section>
</template>
<script type="text/ecmascript-6">
import {
  get as getFundTypeList,
  remove as removeFundType,
  add as addFundType
} from '@/services/fundTypes'
import storage from '@/utils/storage'
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (value.length > 10) {
        callback(new Error('名称不能超过10个字符'))
      } else {
        callback()
      }
    }
    var validateDesc = (rule, value, callback) => {
      if (value.length > 50) {
        callback(new Error('名称不能超过50个字符'))
      } else {
        callback()
      }
    }
    return {
      filters: {
        name: ''
      },
      loading: false,
      types: [
      ],
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addForm: {
        name: '',
        desc: ''
      },
      addFormRules: {
        name: [{
          required: true,
          message: '请输入基金名',
          trigger: 'blur'
        }, {
          validator: validateName,
          trigger: 'blur'
        }],
        desc: [{
          required: true,
          message: '请输入基金描述',
          trigger: 'blur'
        }, {
          validator: validateDesc,
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    //获取用户列表
    async getTypes () {
      this.loading = true
      const res = await getFundTypeList()
      if (res.resultcode === 0) {
        this.types = res.data.fundTypes
        this.loading = false
      } else {
        this.loading = false
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    async handleRemoveStatus(index, row) {
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      const typeId = row.fundTypeId
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removeFundType({adminId, typeId , token})
        if (res.resultcode === 0) {
          this.$message({
            message: '删除基金类型成功',
            type: 'success'
          })
          this.getTypes()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        desc: ''
      }
    },
    addSubmit(formName) {
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确认添加基金类型?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.addLoading = true
            const res = await addFundType({ adminId, name: this.addForm.name, desc: this.addForm.desc, token})
            if (res.resultcode === 0) {
              this.addLoading = false
              this.addFormVisible = false
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.getTypes()
            } else {
              this.$message({
                type: 'success',
                message: res.message
              })

            }
          }).catch(() => {
          })
        }
      })

    }
  },
  mounted() {
    this.getTypes();
  }
};

</script>

<style lang="scss">
@import "~@/assets/scss/_vars.scss";

.el-table .frozen-row {
  background-color: #F7BA2A;
}
</style>
