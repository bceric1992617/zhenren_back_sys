<template>
<div class="content-box">
  <div class="container">


      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="交易单号：">
          <el-input v-model="listQuery.ordernum" placeholder="请输入交易单号" class="filter-item"  />
        </el-form-item>
        <el-form-item label="交易对象：">
            <el-select v-model="listQuery.type" placeholder="请输入交易对象">
              <el-option v-for="(item,k) in $common.tradeList" :key="k" :label="item" :value="k + 1"/>
            </el-select>
        </el-form-item>
        <el-form-item label="交易类型：">
            <el-select v-model="listQuery.type" placeholder="请输入交易类型">
              <el-option v-for="(item,k) in $common.tradeList" :key="k" :label="item" :value="k + 1"/>
            </el-select>
        </el-form-item>
        <el-form-item label="关联注单号：">
          <el-input v-model="listQuery.ordernum" placeholder="请输入关联注单号" class="filter-item"  />
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="listQuery.ordernum" placeholder="请输入用户名" class="filter-item"  />
        </el-form-item>
        <el-form-item label="用户ID：">
          <el-input v-model="listQuery.ordernum" placeholder="请输入用户ID" class="filter-item"  />
        </el-form-item>

        <el-form-item label="交易时间：">
          <el-date-picker
          v-model="listQuery.timeRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
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
        <el-table-column :label="titleList[0]" align="center"  width="80px">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[1]" align="center">
          <template slot-scope="scope">{{scope.row.sex}}</template>
        </el-table-column>
        <el-table-column :label="titleList[2]" align="center">
          <template slot-scope="scope">{{scope.row.age}}</template>
        </el-table-column>
        <el-table-column :label="titleList[3]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.nation}}</template>
        </el-table-column>
        <el-table-column :label="titleList[4]" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column :label="titleList[5]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column :label="titleList[6]" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column :label="titleList[7]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column :label="titleList[8]" align="center">
          <template slot-scope="scope">{{scope.row.education}}</template>
        </el-table-column>
        <el-table-column :label="titleList[9]" align="center">
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
      titleList:[
        '交易单号',
        '交易对象商户',
        '用户名',
        '用户ID',
        '币种',
        '交易金额',
        '交易类型',
        '交易时间',
        '交易状态',
        '关联注单号',
      ],


      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        ordernum: "",
        type : ''
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
    changeSort(column) { //上架时间排序
      this.listQuery.usernameSort = ""
      this.listQuery.betTimeSort = ""
      this.listQuery.winAmountSort = ""

      var args = {
        "descending" : "desc",
        "ascending" : "asc",
      }

      if(column.column.label == this.titleList[2]) {
        this.listQuery.usernameSort = args[column.order]
      } else if(column.column.label == this.titleList[11]) {
        this.listQuery.betTimeSort = args[column.order]
      } else if(column.column.label == this.titleList[13]) {
        this.listQuery.winAmountSort = args[column.order]
      }
      
      this.listQuery.pageNum = 1
      this.fetchData()
    },


    changeSort(column) { //上架时间排序
      this.listQuery.usernameSort = ""

      var args = {
        "descending" : "desc",
        "ascending" : "asc",
      }

      if(column.column.label == this.titleList[0]) {
        this.listQuery.usernameSort = args[column.order]
      }
      
      this.listQuery.pageNum = 1
      this.fetchData()
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




