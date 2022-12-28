<template>
  <div v-if="!power">当前用户没有权限,请用管理员账号登录</div>
  <div v-if="power">
    用户管理
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        fixed
        prop="date"
        label="Date"
        width="150"
        column-key="userid"
      />
      <el-table-column prop="username" label="username" width="120" />
      <el-table-column prop="password" label="password" width="120" />
      <el-table-column prop="status" label="status" width="120">
        <template #default="scope">
          <span v-if="scope.row.status === 'checkPending'">审核中</span>
          <span v-if="scope.row.status === 'agree'">已同意</span>
          <span v-if="scope.row.status === 'disagree'">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="300">
        <template #default="scope">
          <el-popconfirm
            width="220"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="你确定执行此操作吗?"
            @confirm="handleAgree(scope.row.userid)"
          >
            <template #reference>
              <el-button type="primary" size="small">同意</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            width="220"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="你确定执行此操作吗?"
            @confirm="handleDisAgree(scope.row.userid)"
          >
            <template #reference>
              <el-button type="warning" size="small">不同意</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            width="220"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="你确定执行此操作吗?"
            @confirm="handleDelete(scope.row.userid)"
          >
            <template #reference>
              <el-button size="small" type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import apis from '@src/apis'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

onMounted(() => {
  // 获取表格数据
  getTableData()
})

let power = sessionStorage.getItem('username') === 'sys' ? true : false

const getTableData = () => {
  axios.get(apis.manageUser).then((res) => {
    const { success = false, data } = res
    if (success) {
      tableData.value = data
    }
  })
}
const tableData = ref([])

const handleAgree = (userid) => {
  console.log('Agree', userid)
  let params = { userid: userid, status: 'agree' }
  axios.post(apis.updateUserStatus, params).then((res) => {
    console.log('审核状态', res)
    const { success = false } = res
    if (success) {
      ElMessage({
        message: '操作成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '操作失败',
        type: 'error',
      })
    }
    getTableData()
  })
}

const handleDisAgree = (userid) => {
  console.log('Disagree', userid)
  let params = { userid: userid, status: 'disagree' }
  axios.post(apis.updateUserStatus, params).then((res) => {
    console.log('审核状态', res)
    const { success = false } = res
    if (success) {
      ElMessage({
        message: '操作成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '操作失败',
        type: 'error',
      })
    }
    getTableData()
  })
}

const handleDelete = (userid) => {
  console.log('Delete', userid)
  let params = { userid: userid}
  axios.post(apis.deleteUser, params).then((res)=> {
    const { success = false } = res
    if (success) {
      ElMessage({
        message: '操作成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '操作失败',
        type: 'error',
      })
    }
    getTableData()
  })
}
</script>

<style lang="less" scoped></style>
