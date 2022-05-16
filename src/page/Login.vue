<template>
    <div class="login-wrap">

        <div class="ms-login">
            <div class="ms-title">真人视讯</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="userName">
                    <el-input v-model="param.userName" placeholder="输入账号">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" style="margin-top:25px;">
                    <el-input type="password" placeholder="登录密码" v-model="param.password" @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>

        <el-dialog title="重置密码" :visible.sync="setPWForm" width="650px">
            <el-form  ref="dataForm" :rules="rules" :model="modiArgs" label-position="right">
                <el-form-item  label-width="130px"  label="新密码：" prop="userName">
                    <el-input type="password"  v-model="modiArgs.content" class="w-70" placeholder="请输入新密码"/>
                </el-form-item>
                <el-form-item  label-width="130px"  label="确认新密码：" prop="userName">
                    <el-input type="password"  v-model="modiArgs.content" class="w-70" placeholder="请输入确认新密码"/>
                </el-form-item>
                <el-form-item  label-width="130px"  label="生成谷歌key：" prop="userName">
                    <el-input   v-model="modiArgs.content" class="w-70 m-r-10" placeholder="请输入生成谷歌key"/>
                    <el-button type="text" @click="1">生成key</el-button>
                    <el-button type="text" @click="$common.copyFn(modiArgs.content)">复制</el-button>
                </el-form-item>
                <el-form-item  label-width="130px"  label="谷歌验证码：" prop="userName">
                    <el-input   v-model="modiArgs.content" class="w-70" placeholder="请输入谷歌验证码"/>
                </el-form-item>
            </el-form>
            <div class="w-100 text-c">
                <button class="submitBtn" @click="saveData()">提交</button>
            </div>
            <div class="w-100 notice">  
                <p class="title">温馨提示：</p>
                <p class="text">用户首次进入后台时，为了保证您的账号和财产安全，请自行设置登录密码并妥善保管，请勿将账户信息泄露给他人，以免给您的财产造成不必要的损失！</p>
            </div>
        </el-dialog>

        <googleCode ref="googleCode"></googleCode>

    </div>
</template>

<script>
import * as API from '@/api/login'
import md5 from 'js-md5';
import googleCode from '@/components/googleCode/googleCode'

export default {
    components: {
        googleCode
    },
    data: function() {
        return {
            setPWForm: false,
            // checkGoogleCode: true,
            param: {
                userName: 'baicai',
                password: '123456'
            },
            rules: {
                userName: [{ required: true, message: '必填', trigger: 'blur' }],
                password: [{ required: true, message: '必填', trigger: 'blur' }]
            },
            modiArgs : {
                content : ''
            }
        };
    },
    created() {

    },
    methods: {
        submitForm() {
            // this.$refs.googleCode.dialogFormVisible = true
            // return
            this.$refs.login.validate(valid => {
                if (valid) {
                    var args = {}
                    args.userName = this.param.userName
                    args.password = md5(this.param.userName + this.param.password)

                    API.login(args).then(res => {
                       if(res.code == 0) {
                           localStorage.setItem('ms_username', this.param.userName);
                           localStorage.setItem('token', "Bearer " + res.data.token);
                           this.$router.push('/');
                       }
                    })
                } else {
                    this.$message.error('请输入账号和密码');
                }
            });
        }
    }
};
</script>

<style scoped>


.submitBtn {
    border:none;
    cursor: pointer;
    background-color:#409EFF;
    color:#fff;
    border-radius: 5px;
    line-height:30px;
    height:30px;
    width:150px;
    font-weight: 600;
    
}
.notice p{
    margin-top:10px
}

.notice .text{
    font-size: 12px;
    color: #B8741A
}

.login-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
}
.ms-title {
    width: 100%;
    text-align: center;
    font-size: 22px;
    margin: 25px 0px 15px;
}
.ms-login {
    position: relative;
    width: 450px;
    height: 335px;
    max-width: 90%;
    margin: 275px auto;
    border-radius: 5px;
    background: white;
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    margin-top: 10%;
}
.login-btn button {
    width: 100%;
    height: 36px;
    text-align: center;
    margin-bottom: 10px;
}
</style>
