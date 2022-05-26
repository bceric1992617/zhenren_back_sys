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
              <el-option v-for="(item,k) in $common.currencyList" :key="k" :label="item" :value="k"/>
            </el-select>
        </el-form-item>

      
      </el-form>
      <el-button  class="filter-item" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button  class="filter-item" @click="$common.resetArgs(listQuery);fetchData()">
        重置
      </el-button>


    <div class="table-container">
      <el-table ref="Table1"
                :data="list"
                style="width: 100%;"
                @sort-change="changeSort"
                border>
        <el-table-column :label="titleList[0]" align="center"  width="50px">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column :label="titleList[1]" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column :label="titleList[2]" align="center">
          <template slot-scope="scope">{{scope.row.nickname}}</template>
        </el-table-column>
        <el-table-column :label="titleList[3]" align="center">
          <template slot-scope="scope">{{scope.row.merchantName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[4]" align="center">
          <template slot-scope="scope">{{$common.currencyList[scope.row.settleCurrency]}}</template>
        </el-table-column>
        <el-table-column :label="titleList[5]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.balance}}</template>
        </el-table-column>
        <el-table-column :label="titleList[6]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.allBetAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[7]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.allProfitLossAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[8]" align="center">
          <template slot-scope="scope">{{scope.row.allBetNum}}</template>
        </el-table-column>

        <el-table-column :label="titleList[9]" align="center">
          <template slot-scope="scope">{{scope.row.lastBetTime}}</template>
        </el-table-column>
        <el-table-column :label="titleList[10]" align="center">
          <template slot-scope="scope">{{scope.row.lastLoginTime}}</template>
        </el-table-column>
        <el-table-column :label="titleList[11]" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="bottom">
              <el-button class="text-20" type="text" @click="$router.push({ path: 'userDetail', query: {rowId : scope.row.id, userId : scope.row.userId , merchantId : scope.row.merchantId} })">
                <i class="el-icon-search"></i>
              </el-button>
            </el-tooltip>

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
        :total="total"

        >
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
      titleList : [
        "序号",
        "用户ID",
        "用户名",
        "所属商户",
        "币种",
        "可用余额",
        "累计投注额",
        "累计盈亏",
        "注单数量",
        "最后投注时间",
        "最后登录时间",
        "操作",
      ],
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

    }
  },
  created() {
    this.$common.getCurrencyList()
    this.fetchData();
    this.getBusinessInfo();
  },
  methods:{
    changeSort(column) {
      this.listQuery.allBetAmountSort = ""
      this.listQuery.allProfitLossAmountSort = ""
      this.listQuery.balanceSort = ""

      var args = {
        "descending" : "desc",
        "ascending" : "asc",
      }

      if(column.column.label == this.titleList[5]) {
        this.listQuery.allBetAmountSort = args[column.order]
      } else if(column.column.label == this.titleList[6]) {
        this.listQuery.allProfitLossAmountSort = args[column.order]
      } else if(column.column.label == this.titleList[7]) {
        this.listQuery.balanceSort = args[column.order]
      }
      
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    handleSizeChange(val) {  // 改变列表显示条数
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {  // 改变列表显示页数
      this.listQuery.pageNum = val;
      this.fetchData();
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


    getBusinessInfo() {
      API.getMerchantList().then(res => {
        this.businessList = res.data
      })
    },
    fetchData() {
      this.listLoading = true
      let args = this.$common.transferToSearchParams(this.listQuery)
      API.getPage(args).then(res => {
        this.listLoading = false
        this.list = res.data.records
      })
    },
  }
}
</script>

<style scoped>


</style>




