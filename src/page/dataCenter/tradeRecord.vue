<template>
<div class="content-box">
  <div class="container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="账变类型：">
            <el-select v-model="listQuery.type" >
              <el-option v-for="(item,k) in $common.tradeList" :key="k" :label="item" :value="k + 1"/>
            </el-select>
        </el-form-item>
        <el-form-item label="账变时间：">
          <el-date-picker
          v-model="listQuery.timeRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="注单号：">
          <el-input v-model="listQuery.relationId" placeholder="请输入注单号" class="filter-item"  />
        </el-form-item>
        <el-form-item label="用户ID/用户名：">
          <el-input v-model="listQuery.userUnique" placeholder="请输入用户ID/用户名" class="filter-item"  />
        </el-form-item>
        <el-form-item label="商户名称：">
          <el-input v-model="listQuery.merchantNames" placeholder="请输入商户名称" class="filter-item"  />
        </el-form-item>



      
      </el-form>
      <el-button  class="filter-item" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button  class="filter-item" @click="reset">
        重置
      </el-button>
      <el-button  class="filter-item" @click="exprotInfo">
        导出
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
        <el-table-column :label="titleList[1]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column :label="titleList[2]" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column :label="titleList[3]" align="center">
          <template slot-scope="scope">{{scope.row.userId}}</template>
        </el-table-column>
        <el-table-column :label="titleList[4]" align="center">
          <template slot-scope="scope">{{scope.row.merchantName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[5]" align="center">
          <template slot-scope="scope">{{$common.tradeList[scope.row.type - 1]}} </template>
        </el-table-column>
        <el-table-column :label="titleList[6]" align="center">
          <template slot-scope="scope">{{$common.tradeList[scope.row.tradeSources - 1]}}</template>
        </el-table-column>
        <el-table-column :label="titleList[7]" align="center">
          <template slot-scope="scope">{{scope.row.amount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[8]" align="center">
          <template slot-scope="scope">{{scope.row.beforeAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[9]" align="center">
          <template slot-scope="scope">{{scope.row.afterAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[10]" align="center">
          <template slot-scope="scope">{{scope.row.relationId}}</template>
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
import * as API from '@/api/dataCenter'
import * as Public from '@/api/public'

export default {

  data(){
    return{



      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        createTimeBy: "",
        timeRange: '',
        createStartTime : '',
        createEndTime : '',
        merchantNames : '',
        relationId : '',
        type : '',
        userUnique : '',
      },

      dialogStatus: '',
      dialogFormVisible: false,
      list: [],
      total: 0,
      listLoading: true,
      titleList: [
        "序号",
        "账变时间",
        "用户名",
        "用户ID",
        "所属商户",
        "账变类型",
        "交易来源",
        "账变金额",
        "账变前余额",
        "账变后余额",
        "注单号"
      ]

    }
  },
  created() {
    this.fetchData();
  },
  methods:{

    changeSort(column) { //上架时间排序
      var args = {
        "descending" : "desc",
        "ascending" : "asc",
      }

      this.listQuery.createTimeBy = args[column.order]
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
      this.listQuery.pageNum = 1
      if(this.listQuery.timeRange != '') {
        this.listQuery.createStartTime = this.listQuery.timeRange[0]
        this.listQuery.createEndTime = this.listQuery.timeRange[1]
      }
      this.fetchData()
    },
    reset() {
      this.$common.resetArgs(this.listQuery)
      this.listQuery.pageNum = 1
      this.fetchData()  
    },


    exprotInfo() {
      this.listLoading = true
      this.listQuery.pageNum = '';
      this.listQuery.pageSize = '';
      let args = this.$common.transferToSearchParams(this.listQuery)

      Public.exportChangeRecord(args).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res], {type:'application/vnd.ms-excel'});
        var date = new Date();
        const fileName = "帐变记录导出" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ".xls";
        link.href = URL.createObjectURL(blob)
        link.download = fileName;
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href); // 释放URL 对象
        document.body.removeChild(link)
        this.listLoading = false
      })
    },

    fetchData() {
      this.listLoading = true
      let args = this.$common.transferToSearchParams(this.listQuery)

      API.getChangeRecordPage(args).then(res => {
        this.listLoading = false
        if(res.code == 0) {
          this.list = res.data.records
          this.total = res.data.total
        }
      })
    },
  }
}
</script>

<style scoped>


</style>




