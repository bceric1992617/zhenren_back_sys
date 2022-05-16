<template>
    <div>
        <el-dialog title="google验证码" width="450px" top="200px" :visible.sync="dialogFormVisible" :show-close="showClo" :close-on-click-modal="false"  >
            <el-input v-model="googleCode" class="w-100" placeholder="请输入google验证码" />
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible = false">
                取消
                </el-button>
                <el-button type="primary" @click="sendCode()">
                确定
                </el-button>
            </div>

        </el-dialog>
    </div>
</template>


<script>
export default {
    data() {
        return {
            googleCode : '',
            showClo:false,
            dialogFormVisible : true,
        }
    },
    methods:{
        changeShowStatus() {
       
        },
        sendCode() {

        },
    },
};
</script>

<style scoped>

</style>