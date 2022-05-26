<template>
<div class="content-box">
  <div class="container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="注单号：">
          <el-input v-model="listQuery.ordernum" placeholder="请输入注单号" class="filter-item"  />
        </el-form-item>
        <el-form-item label="玩法名称：">
            <el-select class="w-100" v-model="listQuery.gameRuleId" placeholder="请选择玩法名称">
              <el-option v-for="(item,k) in $common.ruleNameList" :key="k" :label="item" :value="k"/>
            </el-select>
        </el-form-item>
        <el-form-item label="投注时间：">
          <el-date-picker
          v-model="listQuery.betTimeRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="投注IP：">
          <el-input v-model="listQuery.clientIp" placeholder="请输入投注IP" class="filter-item"  />
        </el-form-item>
        <el-form-item label="用户ID：">
          <el-input v-model="listQuery.username" placeholder="请输入用户ID" class="filter-item"  />
        </el-form-item>
        <el-form-item label="桌台号：">
          <el-input v-model="listQuery.deskNo" placeholder="请输入桌台号" class="filter-item"  />
        </el-form-item>
        <el-form-item label="局号：">
          <el-input v-model="listQuery.shoeNo" placeholder="请输入局号" class="filter-item"  />
        </el-form-item>

        <el-form-item label="结算时间：">
          <el-date-picker
          v-model="listQuery.resTimeRange"
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
        <el-table-column :label="titleList[0]" align="center">
          <template slot-scope="scope">{{scope.row.ordernum}}</template>
        </el-table-column>
        <el-table-column :label="titleList[1]" align="center">
          <template slot-scope="scope">{{scope.row.nickname}}</template>
        </el-table-column>
        <el-table-column :label="titleList[2]" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column :label="titleList[3]" align="center">
          <template slot-scope="scope">{{scope.row.deskNo}}</template>
        </el-table-column>
        <el-table-column :label="titleList[4]" align="center">
          <template slot-scope="scope">{{scope.row.shoeNo}}</template>
        </el-table-column>
        <el-table-column :label="titleList[5]" align="center">
          <template slot-scope="scope">{{scope.row.gameName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[6]" align="center">
          <template slot-scope="scope">{{scope.row.ruleName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[7]" align="center">
          <template slot-scope="scope">{{scope.row.odds}}</template>
        </el-table-column>
        <el-table-column :label="titleList[8]" align="center">
          <template slot-scope="scope">{{$common.currencyList[scope.row.currency]}}</template>
        </el-table-column>
        <el-table-column :label="titleList[9]" align="center">
          <template slot-scope="scope">{{scope.row.betAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[10]" align="center">
          <template slot-scope="scope">{{scope.row.validAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[11]" align="center">
          <template slot-scope="scope">{{scope.row.betTime}}</template>
        </el-table-column>
        <el-table-column :label="titleList[12]" align="center">
          <template slot-scope="scope">{{scope.row.shoeWinner}}</template>
        </el-table-column>
        <el-table-column :label="titleList[13]" align="center">
          <template slot-scope="scope">{{scope.row.winAmount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[14]" align="center">
          <template slot-scope="scope">{{scope.row.settleTime}}</template>
        </el-table-column>
        <el-table-column :label="titleList[15]" align="center">
          <template slot-scope="scope">{{ $common.orderStatus[scope.row.orderStatus] }}</template>
        </el-table-column>
        <el-table-column :label="titleList[16]" align="center">
          <template slot-scope="scope">{{scope.row.clientIp}}</template>
        </el-table-column>
        <el-table-column :label="titleList[17]" align="center">
          <template slot-scope="scope">{{scope.row.client}}</template>
        </el-table-column>
        <el-table-column :label="titleList[18]" align="center" width="50px">
          <template slot-scope="scope" >
            <el-tooltip content="查看" placement="bottom">
              <el-button class="text-20" type="text" @click="handleDetail(scope.row)">
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
        :total="total">
      </el-pagination>
    </div>

    <el-dialog :title='isOrderDetail ? "注单详情" : "局口详情"' :visible.sync="dialogFormVisible">
      <div class="detailHeader">
        <p><font size="3"> <b>桌台号：{{ betDetailInfo.deskNo }}</b> </font> </p>
        <p><font size="3"> <b>局号：{{ betDetailInfo.shoeNo }}</b> </font> </p>
        <p>
          <span>
            <font size="3">
            <b>玩法名称：</b> 
            </font>
          </span>
          <span>
            <select :disabled='isOrderDetail ? true : false' v-model="ruleNameSelect" class="ruleNameSelectStyle" @change="changeRuleName" >
              <option value=''  >请选择</option>
              <option v-for="(item,k) in $common.ruleNameList" :key="k" :label="item" :value="k"/>
            </select>
          </span>
        </p>
      </div>

      <div v-if="isOrderDetail">
        <div class="betInfo m-t-50">
          <table cellspacing="0 m-t-10">
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5 b-t-1-EBEEF5" colspan="2">下注信息</td>
              <td class="b-br-1-EBEEF5 b-t-1-EBEEF5 tdspan" colspan="3">
                <span class="float-l" style="margin-left:45%">局口信息</span>
                <span class="float-r">
                  <el-button type="success" @click="isOrderDetail = false">
                    查看局口详情
                  </el-button>
                </span>
              </td>

            </tr>
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">注单号</td>
              <td class="b-br-1-EBEEF5">{{ orderList.ordernum }}</td>
              <td class="b-br-1-EBEEF5" rowspan="4">开奖结果</td>
              <td class="b-br-1-EBEEF5">庄开牌</td>
              <td class="b-br-1-EBEEF5">闲开牌</td>
            </tr>
            <tr>

              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">用户名</td>
              <td class="b-br-1-EBEEF5">{{ orderList.nickname }}</td>
              <td class="b-br-1-EBEEF5" rowspan="3">{{ orderList.result ? orderList.result.split(' ')[0] : '' }}</td>
              <td class="b-br-1-EBEEF5" rowspan="3">{{ orderList.result ? orderList.result.split(' ')[1] : '' }}</td>
            </tr>
            <tr>

              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">用户ID</td>
              <td class="b-br-1-EBEEF5">{{ orderList.username }}</td>

            </tr>
            <tr>

              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">投注单位</td>
              <td class="b-br-1-EBEEF5">{{ $common.currencyList[orderList.currency] }}</td>

            </tr>
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">投注金额</td>
              <td class="b-br-1-EBEEF5">{{ orderList.betAmount }}</td>
              <td class="b-br-1-EBEEF5">输赢金额</td>
              <td class="b-br-1-EBEEF5" colspan="2">{{ orderList.winAmount }}</td>
            </tr>
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">投注玩法</td>
              <td class="b-br-1-EBEEF5">{{ orderList.gameName }}</td>
              <td class="b-br-1-EBEEF5">局结果</td>
              <td class="b-br-1-EBEEF5" colspan="2">{{ orderList.shoeWinner }}</td>
            </tr>
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">本注赔率</td>
              <td class="b-br-1-EBEEF5">{{ orderList.odds }}</td>
              <td class="b-br-1-EBEEF5">投注IP</td>
              <td class="b-br-1-EBEEF5" colspan="2">{{ orderList.clientIp }}</td>
            </tr>
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">下注时间</td>
              <td class="b-br-1-EBEEF5">{{ orderList.betTime }}</td>
              <td class="b-br-1-EBEEF5">结算时间</td>
              <td class="b-br-1-EBEEF5" colspan="2">{{ orderList.settleTime }}</td>
            </tr>

          </table>
        </div>
      </div>
      <div v-else>
        <div class="betInfo m-t-50">
          <table cellspacing="0 m-t-10">
            <tr>
              <td class="b-b-1-EBEEF5" colspan="7"> <font size="3"> <b>局口信息</b> </font>  </td>
            </tr>
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">总押注额(USD)</td>
              <td class="b-br-1-EBEEF5">{{ betDetailList.allBetAmount }}</td>
              <td class="b-br-1-EBEEF5">总输赢金额(USD)</td>
              <td class="b-br-1-EBEEF5">{{ betDetailList.allWinAmount }}</td>
              <td class="b-br-1-EBEEF5" rowspan="3">开奖结果</td>
              <td class="b-br-1-EBEEF5">庄开牌</td>
              <td class="b-br-1-EBEEF5">闲开牌</td>
            </tr>
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">换算金额</td>
              <td class="b-br-1-EBEEF5">{{ betDetailList.allBetAmount }}</td>
              <td class="b-br-1-EBEEF5">换算金额(RMB)</td>
              <td class="b-br-1-EBEEF5">{{ betDetailList.allBetAmount }}</td>
              <td class="b-br-1-EBEEF5" rowspan="2">{{ betDetailInfo.result ? betDetailInfo.result.split(' ')[0] : '' }}</td>
              <td class="b-br-1-EBEEF5" rowspan="2">{{ betDetailInfo.result ? betDetailInfo.result.split(' ')[1] : '' }}</td>
            </tr>
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">注单数量</td>
              <td class="b-br-1-EBEEF5" colspan="3">{{ betDetailList.betNum }}</td>

            </tr>
            <tr>
              <td class="b-br-1-EBEEF5 b-l-1-EBEEF5">结算时间</td>
              <td class="b-br-1-EBEEF5" colspan="3">{{ betDetailList.settleTime }}</td>
              <td class="b-br-1-EBEEF5">局结果</td>
              <td class="b-br-1-EBEEF5" colspan="3">{{ betDetailInfo.shoeWinner }}</td>
            </tr>
          </table>
        </div>
        <div class="betUserInfo m-t-50">
          <p><font size="3"> <b>本局注单信息</b> </font></p>
          <el-table
            :data="betDetailList.betList"
            border
            class="w-100 m-t-8"
            >
            <el-table-column prop="ordernum" label="注单号" align="center">
            </el-table-column>
            <el-table-column prop="nickname" label="用户名" align="center">
            </el-table-column>
            <el-table-column prop="username" label="用户ID" align="center">
            </el-table-column>
            <el-table-column prop="ruleName" label="投注玩法" align="center">
            </el-table-column>
            <el-table-column label="投注单位" align="center">
              <template slot-scope="scope"> {{ $common.currencyList[scope.row.currency] }} </template>
            </el-table-column>
            <el-table-column prop="betAmount" label="投注金额" align="center">
            </el-table-column>
            <el-table-column prop="validAmount" label="有效投注金额" align="center">
            </el-table-column>
            <el-table-column prop="winAmount" label="输赢金额" align="center" width="80">
            </el-table-column>
            <el-table-column prop="amount3" label="操作" align="center" width="50">
              <template slot-scope="scope">
                <el-tooltip content="注单详情" placement="bottom">
                  <el-button class="text-20" type="text" @click="getOrder(scope.row.id)">
                    <i class="el-icon-document"></i>
                  </el-button>
                </el-tooltip>
              </template>

            </el-table-column>2
          </el-table>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import * as API from '@/api/dataCenter'

export default {


  data(){
    return{
      titleList: [
        "注单号",
        "用户名",
        "用户ID",
        "桌台号",
        "局号",
        "玩法名称",
        "投注玩法",
        "玩法赔率",
        "投注币种",
        "投注金额",
        "有效投注金额",
        "投注时间",
        "局结果",
        "输赢金额",
        "结算时间",
        "注单状态",
        "投注IP",
        "投注终端",
        "操作",
      ],

      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        usernameSort : '',
        betTimeSort : '',
        winAmountSort : '',
        betTimeEnd: '',
        betTimeStart : '',
        clientIp : '',
        deskNo : '',
        gameRuleId : '',
        gameRuleIdList : '',
        ordernum : '',
        settleTimeEnd : '',
        settleTimeStart : '',
        shoeNo : '',
        username : '',
        betTimeRange : '',
        resTimeRange : '',
      },

      dialogStatus: '',
      dialogFormVisible: false,
      list: [],
      betDetailInfo: [],
      betDetailList: [],
      orderList: [],
      total: 0,
      listLoading: true,
      isOrderDetail: false,
      ruleNameSelect:'',

    }
  },
  created() {
    this.$common.getRuleNameList()
    this.$common.getCurrencyList()

    this.fetchData();
  },
  methods:{
    handleDetail(row) {
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      this.dialogFormVisible = true
      this.isOrderDetail = false

      this.getShoeResultInfo(row) //局口详细-开奖结果
      this.getBetOrderStatisticsList(row) //局口详细-列表

    },
    getOrder(id){
      this.isOrderDetail = true
      this.getOrderInfo(id) //注单详细
    },
    changeRuleName() {
      var args = {}
      args['deskNo'] = this.betDetailInfo.deskNo
      args['shoeNo'] = this.betDetailInfo.shoeNo
      args['gameRuleId'] = this.ruleNameSelect

      this.getBetOrderStatisticsList(args)
    },

    getShoeResultInfo(row) { //局口详细-开奖结果
      var args = new URLSearchParams()
      args.append('deskNo',row.deskNo)
      args.append('shoeNo',row.shoeNo)

      API.getShoeResultDetail(args).then(res => {
        this.betDetailInfo = res.data
      }) 
    },

    getBetOrderStatisticsList(row) { //局口详细-列表
      var args = new URLSearchParams()
      args.append('deskNo',row.deskNo)
      args.append('shoeNo',row.shoeNo)
      if(this.$common.isSet(this.ruleNameSelect)) {
        args.append('gameRuleId',this.ruleNameSelect)
      }

      API.getBetOrderStatisticsDetail(args).then(res => {
        this.betDetailList = res.data
      }) 
    },

    getOrderInfo(id) { //注单详细
      var args = new URLSearchParams()
      args.append('id',id)

      API.getOrderDetail(args).then(res => {
        this.orderList = res.data
      }) 
    },




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
      let args = this.$common.transferToSearchParams(this.listQuery)

      API.getRegisterList(args).then(res => {
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
.detailHeader p {
  display: inline-block;
  font-weight: 600;
  width:30%;
  text-align: center;
  /* border:1px solid #000; */
}

.betInfo table {width:100%}
.betInfo table tr {
  text-align: center;
}

.betInfo table tr td {
  /* border:1px solid #EBEEF5; */
  padding:5px 0
}

.betUserInfo {
  text-align: center;
}

.tdspan span {
  display: inline-block;
  height:42px;
  line-height:42px;
  padding:0 10px
}

.ruleNameSelectStyle {
  width:150px;
  height:30px;
  border:1px solid #409EFF; 
  border-radius:5px
}

</style>




