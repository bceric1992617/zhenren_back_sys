<template>
<div class="content-box">
  <div class="container float-l w-100">
      <el-form  :model="listQuery" :inline="true" class="demo-form-inline">
        <el-form-item label="统计期间：">
          <el-date-picker
          v-model="listQuery.timerange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>


        <el-form-item label="注单来源商户：">
            <el-select v-model="listQuery.merchantCode"  placeholder="请输入注单来源商户">
              <el-option v-for="(item,k) in $common.tradeList" :key="k" :label="item" :value="k"/>
            </el-select>
        </el-form-item>
      
      </el-form>
      <div class="exchangeCurrency w-100">
        <div class="float-l" > 
          <el-button  class="filter-item" type="primary" @click="handleFilter">
            查询
          </el-button>
          <el-button  class="filter-item" @click="$common.resetArgs(listQuery);fetchData()">
            重置
          </el-button>
          <el-button  class="filter-item" @click="exprotInfo('商户注单统计')">
            导出
          </el-button>
        </div>
        <div class="float-l" >
          <p class="float-r selectType">
            <span>币种选择(美金兑换其他)：</span>
            <span>
              <select v-model="currencyType">
                <option v-for="(item,k) in $common.currencyOriginList" :key="k" :value="item.currencyCode"> {{ item.currencyName }} </option>
              </select>
            </span>
          </p>
        </div>
      </div>



    <div class="table-container m-t-20 float-l w-100 ">
      <el-table ref="Table1"
                :data="list"
                @sort-change="changeSort"
                border>
        <el-table-column :label="titleList[0]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.day}}</template>
        </el-table-column>
        <el-table-column :label="titleList[1]" align="center">
          <template slot-scope="scope">{{scope.row.merchantName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[2]" align="center">
          <template slot-scope="scope">{{scope.row.betNum}}</template>
        </el-table-column>
        <el-table-column :label="titleList[3]" align="center">
          <template slot-scope="scope">{{scope.row.allBetAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[4]" align="center">
          <template slot-scope="scope">{{scope.row.allPayoutAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[5]" align="center">
          <template slot-scope="scope">{{scope.row.allWinAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[6]" align="center">
          <template slot-scope="scope">{{ $common.exchangeUSDToOther(scope.row.allBetAmount,currencyType) }}</template>
        </el-table-column>
        <el-table-column :label="titleList[7]" align="center">
          <template slot-scope="scope">{{ $common.exchangeUSDToOther(scope.row.allPayoutAmount,currencyType) }}</template>
        </el-table-column>
        <el-table-column :label="titleList[8]" align="center">
          <template slot-scope="scope">{{ $common.exchangeUSDToOther(scope.row.allWinAmount,currencyType)  }}</template>
        </el-table-column>
        <el-table-column :label="titleList[9]" align="center">
          <template slot-scope="scope">{{scope.row.profitRate}}</template>
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

export default {


  data(){
    return{
      titleList: [
        "日期",
        "注单来源商户",
        "交易注单数",
        "总投注额(换算USD)",
        "总派彩额(换算USD)",
        "总输赢金额(换算USD)",
        "总投注额",
        "总派彩额",
        "总输赢金额",
        "获利率",
      ],


      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        daySort: '',
        merchantCode : '',
        endDate : '',
        startDate : '',
        timerange:''
      },
      dialogStatus: '',
      currencyType: 'CNY',
      dialogFormVisible: false,
      list: [],
      total: 0,
      listLoading: true,

    }
  },
  created() {
    this.$common.getOriginCurrencyList()
    this.fetchData();
  },
  methods:{
    //导出
    exprotInfo(name) {
        this.listLoading = true
        var value = JSON.parse(JSON.stringify(this.listQuery))
        value.pageNum = '';
        value.pageSize = '';

        let args = this.$common.transferToSearchParams(value)
  
        API.exportRegisterStatisticsRecord(args).then(res => {
          const link = document.createElement('a')
          let blob = new Blob([res], {type:'application/vnd.ms-excel'});
          var date = new Date();
          const fileName = name + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ".xls";
          link.href = URL.createObjectURL(blob)
          link.download = fileName;
          document.body.appendChild(link)
          link.click()
          URL.revokeObjectURL(link.href); // 释放URL 对象
          document.body.removeChild(link)
          this.listLoading = false
        })
    },

    changeSort(column) { //上架时间排序
      this.listQuery.daySort = ""

      var args = {
        "descending" : "desc",
        "ascending" : "asc",
      }

      if(column.column.label == this.titleList[0]) {
        this.listQuery.daySort = args[column.order]
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
      if(this.listQuery.timeRange != '') {
        this.listQuery.startTime = this.listQuery.timeRange[0]
        this.listQuery.endTime = this.listQuery.timeRange[1]
      }
      this.fetchData()
    },

    fetchData() {
      this.listLoading = true
      let args = this.$common.transferToSearchParams(this.listQuery)
      API.getStatisticsList(args).then(res => {
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

.exchangeCurrency div{
  width: 50%;
  display: inline-block;
}

.exchangeCurrency div p {
  padding:8px
}

.exchangeCurrency select {
  width:100px
}



</style>




