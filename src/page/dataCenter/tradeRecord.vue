<template>
<div class="content-box">
  <div class="container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="账变类型：">
            <el-select v-model="listQuery.status" >
              <el-option v-for="(item,k) in $common.currencyList" :key="k" :label="item" :value="k + 1"/>
            </el-select>
        </el-form-item>
        <el-form-item label="账变时间：">
          <el-date-picker
          v-model="listQuery.protocolName"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="注单号：">
          <el-input v-model="listQuery.protocolName" placeholder="请输入注单号" class="filter-item"  />
        </el-form-item>
        <el-form-item label="用户ID/用户名：">
          <el-input v-model="listQuery.protocolName" placeholder="请输入用户ID/用户名" class="filter-item"  />
        </el-form-item>
        <el-form-item label="商户名称：">
          <el-input v-model="listQuery.protocolName" placeholder="请输入商户名称" class="filter-item"  />
        </el-form-item>



      
      </el-form>
      <el-button  class="filter-item" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button  class="filter-item" @click="reset">
        重置
      </el-button>
      <el-button  class="filter-item" @click="reset">
        导出
      </el-button>


    <div class="table-container">
      <el-table ref="Table1"
                :data="list"
                style="width: 100%;"
                border>
        <el-table-column label="序号" align="center"  width="50px">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="账变时间" align="center">
          <template slot-scope="scope">{{scope.row.sex}}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.age}}</template>
        </el-table-column>
        <el-table-column label="用户ID" align="center">
          <template slot-scope="scope">{{scope.row.nation}}</template>
        </el-table-column>
        <el-table-column label="所属商户" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="账变类型" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="交易来源" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="账变金额" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="账变前余额" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column label="账变后余额" align="center">
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



export default {


  data(){
    return{



      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        protocolName: "",
        timerange : ''
      },

      dialogStatus: '',
      dialogFormVisible: false,
      list: [],
      total: 0,
      listLoading: true,

    }
  },
  created() {
    this.fetchData();
  },
  methods:{

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


</style>




