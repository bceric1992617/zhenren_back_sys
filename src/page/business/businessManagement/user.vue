<template>
<div class="content-box">
  <div class="container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="商户编号：">
          <el-input v-model="listQuery.protocolName" placeholder="请输入" class="filter-item"  />
        </el-form-item>
        <el-form-item label="商户名称：">
          <el-input v-model="listQuery.protocolName" placeholder="请输入" class="filter-item"  />
        </el-form-item>
        <el-form-item label="商户账号：">
          <el-input v-model="listQuery.protocolName" placeholder="请输入" class="filter-item"  />
        </el-form-item>

      
      </el-form>
      <el-button  class="filter-item" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button  class="filter-item" @click="reset">
        重置
      </el-button>
      <el-button class="filter-item" type="primary" @click="1">
        新增
      </el-button>

    <div class="table-container">
      <el-table ref="Table1"
                :data="list"
                style="width: 100%;"
                border>
        <el-table-column label="序号" align="center"  width="50px">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="用户ID" align="center">
          <template slot-scope="scope">{{scope.row.sex}}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.age}}</template>
        </el-table-column>
        <el-table-column label="所属商户" align="center">
          <template slot-scope="scope">{{scope.row.nation}}</template>
        </el-table-column>
        <el-table-column label="币种" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="可用余额" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="累计投注额" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="累计盈亏" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="注单数量" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="联系方式" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="商户维护人" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="入驻时间" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="商户状态" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="">
            <el-button type="text" @click="handleUpdate()">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="text" @click="handleUpdate()">
              <i class="el-icon-document"></i>
            </el-button>


          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="list.length > 0" class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,20,50,100]"
        :total="total">
      </el-pagination>
    </div>

    <!-- 编辑页面或新增 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-steps :active="active" finish-status="success" class="float-l w-100">
        <el-step title="基本信息"></el-step>
        <el-step title="商户信息"></el-step>
        <el-step title="技术参数"></el-step>
      </el-steps>
      <el-form class="m-t-20 w-100 float-l" ref="dataForm" :rules="rules" :model="modiArgs" label-position="right">
        <div v-if="active  == 0">
          <el-form-item class="float-l w-input" label-width="130px"  label="协议名称：" prop="protocolName">
            <el-input  v-model="modiArgs.protocolName" placeholder="请输入协议名称"  />
          </el-form-item>
          <el-form-item class="float-l w-input" label-width="130px"  label="C端默认语言：" prop="protocolName">
            <el-select class="w-100" v-model="modiArgs.status"  clearable>
              <el-option v-for="(item,k) in $common.langeType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>

          <el-form-item class="float-l w-input" label-width="130px"  label="商户账号：" prop="protocolName">
            <el-input  v-model="modiArgs.protocolName" placeholder="请输入商户账号"  />
          </el-form-item>
          <el-form-item class="float-l w-input" label-width="130px"  label="商户密码：" prop="protocolName">
            <el-input   v-model="modiArgs.protocolName" placeholder="请输入商户密码"  />
          </el-form-item>

          <el-form-item class="float-l w-input" label-width="130px"  label="商户名称：" prop="protocolName">
            <el-input  v-model="modiArgs.protocolName" placeholder="请输入商户名称"  />
          </el-form-item>
          <el-form-item class="float-l w-input" label-width="130px"  label="邮箱地址：" prop="protocolName">
            <el-input   v-model="modiArgs.protocolName" placeholder="请输入邮箱地址"  />
          </el-form-item>

          <div v-for="item,k in contactInfoList" :key="k">
            <el-form-item class="float-l w-input" label-width="130px"  label="商务联系人：" prop="protocolName">
              <el-input  v-model="modiArgs.protocolName" placeholder="请输入商务联系人"  />
            </el-form-item>
            <el-form-item class="float-l w-input" label-width="130px"  label="商务方式：" prop="protocolName">
              <el-input   v-model="modiArgs.protocolName" placeholder="请输入商务方式"  />
            </el-form-item>
            <p v-if="k == 0" @click="addContactInfo" class="float-l p-10" > 
              <i class="el-icon-plus"></i>  
            </p>
            <p v-else @click="delContactInfo(k)" class="float-l p-10"> 
              <i class="el-icon-close"></i>    
            </p>
          </div>

          <el-form-item class="float-l w-input" label-width="130px"  label="国家：" >
            <el-input  v-model="modiArgs.protocolName" placeholder="请输入国家"  />
          </el-form-item>
          <el-form-item class="float-l w-input" label-width="130px"  label="省市区：" >
            <el-input   v-model="modiArgs.protocolName" placeholder="请输入省市区"  />
          </el-form-item>

          <el-form-item class="float-l w-100" label-width="130px"  label="详细地址：">
            <el-input :rows="4" type="textarea" v-model="modiArgs.content" placeholder="请输入详细地址" class="w-50" />
          </el-form-item>


        </div>
        <div v-else-if="active  == 1">
          <el-form-item class="float-l w-input-30" label-width="130px"  label="商户等级：" prop="protocolName">
            <el-select class="w-100" v-model="modiArgs.status"  clearable placeholder="请选择商户等级">
              <el-option v-for="(item,k) in $common.currencyType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="内外部商户：" prop="protocolName">
            <el-select class="w-100" v-model="modiArgs.status"  clearable placeholder="请选择内外部商户">
              <el-option v-for="(item,k) in $common.commercialType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="结算币种：" prop="protocolName">
            <el-select class="w-100" v-model="modiArgs.status"  clearable placeholder="请选择结算币种">
              <el-option v-for="(item,k) in $common.currencyType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>

          <el-form-item class="float-l w-input-30" label-width="130px"  label="平台费率(%)：" prop="protocolName">
            <el-input  v-model="modiArgs.protocolName" placeholder="请输入平台费率" type="number"  />
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="计算标准：" prop="protocolName">
            <el-select class="w-100" v-model="modiArgs.status"  clearable placeholder="请选择计算标准">
              <el-option v-for="(item,k) in $common.calculateType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="缴纳周期：" prop="protocolName">
            <el-select class="w-100" v-model="modiArgs.status"  clearable placeholder="请选择缴纳周期">
              <el-option v-for="(item,k) in $common.paymentType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>

          <el-form-item class="float-l w-input-30" label-width="130px"  label="会员费：">
            <el-input  v-model="modiArgs.protocolName" placeholder="请输入会员费"   />
          </el-form-item>
          <el-form-item class="float-l  w-input-30" label-width="130px"  label="缴纳周期：">
            <el-select class="w-100" v-model="modiArgs.status"  clearable placeholder="请选择缴纳周期">
              <el-option v-for="(item,k) in $common.paymentType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l  w-input-30" style="height:40px">
          </el-form-item>

          <el-form-item class="float-l w-input-30" label-width="130px"  label="技术服务费：">
            <el-input  v-model="modiArgs.protocolName" placeholder="请输入技术服务费"   />
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="缴纳周期：">
            <el-select class="w-100" v-model="modiArgs.status"  clearable placeholder="请选择缴纳周期">
              <el-option v-for="(item,k) in $common.paymentType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l  w-input-30" style="height:40px">
          </el-form-item>

          <!-- <el-form-item class="float-l w-input-30" label-width="130px"  label="商户有效期：">
            <el-date-picker
            class="w-100"
            v-model="listQuery.timerange"
            type="datetimerange"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item> -->
          <el-form-item class="float-l w-input-30" label-width="130px"  label="商户维护人：">
            <el-input  v-model="modiArgs.protocolName" placeholder="请输入商户维护人"   />
          </el-form-item>
          <el-form-item class="float-l  w-input-30" style="height:40px">
          </el-form-item>

          <el-form-item class="float-l w-100" label="合作协议文件：" label-width="130px">
            <el-upload
              class="float-l avatar-uploader"
              action="/file/manyFileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="$common.beforeAvatarUpload"
              :headers="header"
              >
            <img v-if="uploadImg" :src="uploadImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

        </div>
        <div v-else-if="active  == 2">
          <el-form-item class="w-50" label-width="130px"  label="钱包产品类型：" prop="protocolName">
            <el-select class="w-100" v-model="modiArgs.status"  clearable>
              <el-option v-for="(item,k) in $common.walletProductType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="w-100" label-width="130px"  label="IP白名单：" prop="protocolName">
            <el-input :rows="4" type="textarea" v-model="modiArgs.content" placeholder="（多个IP白名单以英文“,”分割）" class="w-50" />
          </el-form-item>
        </div>




      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        
        <el-button v-if="active != 0" @click="last" type="primary">
          上一步
        </el-button>

        <el-button v-if="active != 2" @click="next" type="primary">
          下一步
        </el-button>

        <el-button v-if="active == 2" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>

      </div>
    </el-dialog>
    

  </div>
</div>
</template>

<script>
import * as API from '@/api/upload'


export default {


  data(){
    return{
      header: {
        authorization : localStorage.getItem("token")
      },
      uploadImg: "",
      active: 1,
      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        protocolName: "",
        timerange : ''
      },
      modiArgs: {
        protocolName: '',
        status: '',
      },
      dialogStatus: '',
      dialogFormVisible: false,
      list: [],
      total: 0,
      listLoading: true,
      rules: {
        protocolName: [{ required: true, message: '必填', trigger: 'blur' }],
        payAddress: [{ required: true, message: '必填', trigger: 'blur' }],
      },
      textMap: {
        update: '编辑',
        create: '新增',
      },
      contactInfoList : [1]
    }
  },
  created() {
    this.fetchData();
  },
  methods:{
    addContactInfo() {
      this.contactInfoList.push(1)
    },
    delContactInfo(k) {
      this.contactInfoList.splice(k,1)
    },

    handleAvatarSuccess(res) { // 上传返回
      if(res.code == 403) {
        this.$message({
          type: 'error',
          message: res.message
        })
        this.$router.push("/login")
        return
      }

      if(res.code == 0) {
        this.$message({
          type: 'success',
          message: res.message
        })
        if(res.data.keyList[0].substr(0,1) == '/') {
          res.data.keyList[0] = res.data.keyList[0].substr(1)
        }
        this.modiArgs.iconKey = res.data.keyList[0]
        this.uploadImg = res.data.urlList[0]
      } else {
        this.$message({
          type: 'error',
          message: res.message
        })
        
      }
    },

    last() {
      this.active = this.active < 0 ? 0 : --this.active;


    },
    next() {
      this.active = this.active > 2 ? 2 : ++this.active;


    },
    handleSizeChange(val) {  // 改变列表显示条数
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {  // 改变列表显示页数
      this.listQuery.pageNum = val;
      this.getList();
    },


    handleFilter() { //搜索
      this.listQuery.page = 1
      this.fetchData()
    },
    reset() {
      this.$common.resetArgs(this.listQuery)
      this.listQuery.pageNum = 1
      this.fetchData()  
    },

    handleUpdate() { //添加
      this.active = 0;
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleCreate() { //添加
      this.active = 0;
      this.dialogStatus = 'create'
      this.dialogFormVisible = true


    },


    fetchData() {
      this.listLoading = true
      // API.getUSDTReceipt(this.listQuery).then(res => {
      //   this.listLoading = false
      //   if(res.code == 0) {
      //     this.list = res.data.records
      //     this.total = res.data.total
      //   }
      // })

      // this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
    },
  }
}
</script>

<style scoped>


</style>




