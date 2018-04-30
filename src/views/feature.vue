<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-button type="primary" @click.native.prevent="openAddForm">添加广告</el-button>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="features" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column prop="title" label="主题"     width="100" sortable />
        <el-table-column prop="info1" label="广告项目1" width="230" sortable />
        <el-table-column prop="info2" label="广告项目2" width="230" sortable />
        <el-table-column prop="info3" label="广告项目3" width="230" sortable />
        <el-table-column
          label="操作"
          align="center"
        >
          <template scope="scope">
            <el-button @click="updateFeature(scope.row)" type="primary" size="small">修改</el-button>
            <el-button @click="deleteFeature(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--新增界面-->
    <el-dialog title="添加广告" v-model="addFormVisible" :close-on-click-modal="false">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="项目1" prop="info1">
          <el-input v-model="ruleForm.info1"></el-input>
        </el-form-item>
        <el-form-item label="项目2" prop="info2">
          <el-input v-model="ruleForm.info2"></el-input>
        </el-form-item>
        <el-form-item label="项目3" prop="info3">
          <el-input v-model="ruleForm.info3"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="submitForm('ruleForm')">确认添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

<!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="项目1" prop="info1">
          <el-input v-model="editForm.info1"></el-input>
        </el-form-item>
        <el-form-item label="项目2" prop="info2">
          <el-input v-model="editForm.info2"></el-input>
        </el-form-item>
        <el-form-item label="项目3" prop="info3">
          <el-input v-model="editForm.info3"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="editFeature('editForm')">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script type="text/ecmascript-6">
import {
  get as getFeatureList,
  add as addFeature,
  update as updateFeature,
  remove as removeFeature
} from '@/services/feature'
import storage from '@/utils/storage'
export default {
  data() {
    var validateTitle = function (rule, value, callback) {
      if (value.length !== 2) {
        callback(new Error('广告标题必须是2个字符！'))
      } else {
        callback()
      }
    }
    var validateInfo = function (rule, value, callback) {
      if (value.length < 1 || value.length > 16) {
        callback(new Error('广告项目必须在16个字符以内'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      addLoading: false,
      editLoading: false,
      advs: [
      ],
      features: [],
      addFormVisible: false,
      editFormVisible: false,
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { validator: validateTitle }
        ],
        info1: [
          { required: true, message: '请输入广告项目1', trigger: 'blur' },
          { validator: validateInfo }
        ],
        info2: [
          { required: true, message: '请输入广告项目2', trigger: 'blur' },
          { validator: validateInfo }
        ],
        info3: [
          { required: true, message: '请输入广告项目3', trigger: 'blur' },
          { validator: validateInfo }
        ]
      },
      //新增界面数据
      ruleForm: {
        title: '',
        info1: '',
        info2: '',
        info3: ''
      },
      editForm: {
        id: '',
        title: '',
        info1: '',
        info2: '',
        info3: ''
      }
    }
  },
  methods: {
    updateFeature(row) {
      this.editFormVisible = true
      const {
        title,
        info1,
        info2,
        info3,
        id
      } = row
      this.editForm.id = id
      this.editForm.title = title
      this.editForm.info1 = info1
      this.editForm.info2 = info2
      this.editForm.info3 = info3
    },
    deleteFeature(row) {
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      const featureId = row.id
      this.$confirm('将删除此条广告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removeFeature({adminId, featureId, token})
        console.log(res)
        if (res.resultcode === 0) {
          this.$message({
            message: '广告删除成功',
            type: 'success'
          })
          this.addFormVisible = false
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.getAdvs()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openAddForm() {
      this.addFormVisible = true
      this.ruleForm.title = ''
      this.ruleForm.info1 = ''
      this.ruleForm.info2 = ''
      this.ruleForm.info3 = ''
    },
    //获取广告列表
    async getAdvs () {
      this.loading = true
      const res = await getFeatureList()
      this.loading = false
      this.features = []
      if (res.resultcode === 0) {
        res.data.feature_list.map((item, index) => {
          let featureObj = {}
          featureObj.title = item.title
          item.info.map((value, id) => {
            id++
            featureObj['info' + id] = value
          })
          featureObj.id = item.id
          this.features.push(featureObj)
        })
      }
    },
    // 修改广告信息 按钮
    editFeature(formName) {
      const token = storage.getSession('token')
      const adminId = storage.getSession('userNo')
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.$confirm('是否确认修改广告?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.editLoading = true
            const res = await updateFeature(this.editForm, {adminId, token})
            console.log(res)
            if (res.resultcode === 0) {
              this.$message({
                message: '广告修改成功',
                type: 'success'
              })
              // this.editLoading = false
              this.editFormVisible = false
              this.getAdvs()
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
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const adminId = storage.getSession('userNo')
          const token = storage.getSession('token')
          this.addLoading = true
          const res = await addFeature(this.ruleForm, {adminId, token})
          this.addLoading = false
          if (res.resultcode === 0) {
            this.$message({
              message: '广告添加成功',
              type: 'success'
            })
            this.addFormVisible = false
            this.getAdvs()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.getAdvs();
  }
};

</script>

<style scoped>

</style>
