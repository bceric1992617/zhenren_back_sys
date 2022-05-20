<template>
<div class="content-box">
  <div class="container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="用户ID/用户名：">
          <el-input v-model="listQuery.username" placeholder="请输入用户ID/用户名" class="filter-item"  />
        </el-form-item>
        <el-form-item label="商户名称：">
            <el-select 
            class="w-100" 
            v-model="listQuery.idList"  
            placeholder="请输入商户名称"
            multiple
            filterable
            allow-create
            default-first-option
            >
              <el-option v-for="(item,k) in businessList" :key="k" :label="item.merchantName" :value="item.id"/>
            </el-select>
        </el-form-item>
        <el-form-item label="币种：">
            <el-select class="w-100" v-model="listQuery.settleCurrency"  placeholder="请输入币种">
              <el-option v-for="(item,k) in $common.currencyList" :key="k" :label="item" :value="k + 1"/>
            </el-select>
        </el-form-item>

      
      </el-form>
      <el-button  class="filter-item" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button  class="filter-item" @click="reset">
        重置
      </el-button>


    <div class="table-container">
      <el-table ref="Table1"
                :data="list"
                style="width: 100%;"
                border>
        <el-table-column label="序号" align="center"  width="50px">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户ID" align="center">
          <template slot-scope="scope">{{scope.row.userId}}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.merchantCode}}_{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="所属商户" align="center">
          <template slot-scope="scope">{{scope.row.merchantName}}</template>
        </el-table-column>
        <el-table-column label="币种" align="center">
          <template slot-scope="scope">{{$common.currencyList[scope.row.settleCurrency - 1]}}</template>
        </el-table-column>
        <el-table-column label="可用余额" align="center">
          <template slot-scope="scope">{{scope.row.balance}}</template>
        </el-table-column>
        <el-table-column label="累计投注额" align="center">
          <template slot-scope="scope">{{scope.row.allBetAmount}}</template>
        </el-table-column>
        <el-table-column label="累计盈亏" align="center">
          <template slot-scope="scope">{{scope.row.allProfitLossAmount}}</template>
        </el-table-column>
        <el-table-column label="注单数量" align="center">
          <template slot-scope="scope">{{scope.row.allBetNum}}</template>
        </el-table-column>

        <el-table-column label="最后投注时间" align="center">
          <template slot-scope="scope">{{scope.row.lastBetTime}}</template>
        </el-table-column>
        <el-table-column label="最后登录时间" align="center">
          <template slot-scope="scope">{{scope.row.lastLoginTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="">

            <el-button type="text">
              <i class="el-icon-search"></i>
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

  </div>
</div>
</template>

<script>
import * as API from '@/api/businessCenter'


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
        allBetAmountSort: "",
        allProfitLossAmountSort : '',
        balanceSort : '',
        merchantIdList : '',
        merchantIds : [],
        settleCurrency : '',
        username : '',
      },
      modiArgs: {
        protocolName: '',
        status: '',
      },
      dialogStatus: '',
      dialogFormVisible: false,
      businessList: [],
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
    this.getBusinessInfo();
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
      if(this.listQuery.idList.length > 0) {
        var str = ''
        this.listQuery.idList.forEach(v => {
          str += "," + v 
        })
        this.listQuery.merchantIds = str.slice(1)
      }

      this.listQuery.pageNum = 1
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
      let args = this.$common.transferToSearchParams(this.listQuery)
      API.getPage(args).then(res => {
        this.listLoading = false
        if(res.code == 0) {
          this.list = res.data.records
          this.total = res.data.total
        }
      })
    },

    getBusinessInfo() {
      API.getMerchantList().then(res => {
        console.log(res.data)
        this.businessList = res.data
      })
    }
  }
}
</script>

<style scoped>


</style>




