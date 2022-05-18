<template>
<div class="content-box">
  <div class="container">
      <div class="headContent">
        <p class="title">用户基本信息</p>
        <p>
          <span>用户名：</span>
          <span>123</span>
        </p>
        <p>
          <span>可用余额：</span>
          <span>123</span>
        </p>
        <p>
          <span>注册时间：</span>
          <span>123</span>
        </p>
        <p>
          <span>累计登录次数：</span>
          <span>123</span>
        </p>
        <p>
          <span>用户ID：</span>
          <span>123</span>
        </p>
        <p>
          <span>累计投注额：</span>
          <span>123</span>
        </p>
        <p>
          <span>注单数量：</span>
          <span>123</span>
        </p>
        <p>
          <span>最后登录时间：</span>
          <span>123</span>
        </p>
        <p>
          <span>用户币种：</span>
          <span>123</span>
        </p>
        <p>
          <span>累计盈利：</span>
          <span>123</span>
        </p>
        <p>
          <span>所属商户：</span>
          <span>123</span>
        </p>
        <p>
          <span>最后投注时间：</span>
          <span>123</span>
        </p>



      </div>

      <div class="changeTab">
        <p :class="active == 1 ? 'active' : ''" @click="changeTabActive(1)">账变记录</p>
        <p :class="active == 2 ? 'active' : ''" @click="changeTabActive(2)">注单记录</p>
      </div>
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="账变类型：">
          <el-input v-model="listQuery.protocolName" placeholder="请输入" class="filter-item"  />
        </el-form-item>
        <el-form-item label="账变时间：">
          <el-date-picker
          v-model="listQuery.timerange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注单号：">
          <el-input v-model="listQuery.protocolName" placeholder="请输入" class="filter-item"  />
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
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="账变类型" align="center">
          <template slot-scope="scope">{{scope.row.sex}}</template>
        </el-table-column>
        <el-table-column label="交易来源" align="center">
          <template slot-scope="scope">{{scope.row.age}}</template>
        </el-table-column>
        <el-table-column label="账变金额" align="center">
          <template slot-scope="scope">{{scope.row.nation}}</template>
        </el-table-column>
        <el-table-column label="账变前余额" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="账变后余额" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="账变时间" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="注单号" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
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
import * as API from '@/api/upload'


export default {


  data(){
    return{
      active: 1, //1账变记录 2注单记录
      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        protocolName: "",
        timerange : ''
      },
      list: [],
      total: 0,
      listLoading: true,
    }
  },
  created() {
    this.fetchData();
  },
  methods:{
    changeTabActive(type) {
      this.active = type
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
.changeTab {
  float:left;
  width:100%;
  margin-bottom: 15px;
  margin-top:60px;
}
.changeTab p {
  float:left;
  margin-right:20px;
  font-size:16px;
  cursor:pointer
}

.active {
  font-weight: 600;
  font-size: 18px !important;
  text-decoration: underline;
}

.headContent {
   width: 100%;
   float:left;
}

.headContent .title {
  width: 100%;
  font-size:16px;
  font-weight: 600;

}

.headContent p {
  float: left;
  width:25%;
  margin-top:5px
}
</style>




