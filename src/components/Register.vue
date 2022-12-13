<!-- 注册 -->
<template>
  <div class="register-form">
    <div class="register-text">注册页面</div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      size="default"
      status-icon
    >
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="用户密码:" prop="password">
        <el-input v-model="ruleForm.password" />
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm(ruleFormRef)" type="primary">注册</el-button>
        <el-button @click="gotoLogin">去登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive,ref } from 'vue'
import axios from 'axios'
import apis from '@src/apis'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';

const router = useRouter()

const ruleFormRef = ref()
const ruleForm = reactive({
  username: '',
  password: '',
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名!', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码!', trigger: 'blur' }],
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      axios.post(apis.register, ruleForm).then((res) => {
        const { success=false,msg = '' } = res
        if (success) {
          ElMessage({
            message: msg,
            type: 'success',
          })
          router.push('/login')
        } else {
          ElMessage({
            message: msg,
            type: 'error',
          })
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const gotoLogin = ()=> {
  router.push('/login')
}
</script>

<style lang="less" scoped>
.register-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 30%;
  width: 100%;
  height: 100%;
  background-image: url('../assets/image/login_background.png');
  // background-color: #2d3a4b;
  background-size: cover;
  .register-text {
    font-size: 20px;
    color: orange;
    margin-bottom: 20px;
  }
}
</style>
