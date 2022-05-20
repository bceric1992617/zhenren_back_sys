<template>
<div class="content-box">
  <div class="container">
    <el-button class="filter-item" type="primary" @click="handleCreate">
      新增
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
          <template slot-scope="scope">{{$common.calculateList[scope.row.platformRateType - 1]}}</template>
        </el-table-column>
        <el-table-column :label="titleList[2]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.amountRangeMin }} ~ {{scope.row.amountRangeMax }}</template>
        </el-table-column>
        <el-table-column :label="titleList[3]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.platformRate}}%</template>
        </el-table-column>
        <el-table-column :label="titleList[4]" align="center" sortable>
          <template slot-scope="scope">{{ $common.paymentType[scope.row.platformPaymentType - 1]}}</template>
        </el-table-column>
        <el-table-column :label="titleList[5]" align="center">
          <template slot-scope="scope">{{scope.row.remark}}</template>
        </el-table-column>
        <el-table-column :label="titleList[6]" align="center">
          <template slot-scope="scope">{{scope.row.updatedName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[7]" align="center">
          <template slot-scope="scope">{{scope.row.updateTime}}</template>
        </el-table-column>
        <el-table-column :label="titleList[8]" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.row)">
              <i class="el-icon-edit"></i>
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


    <!-- 编辑 -->
    <el-dialog @click.native="showStatus = false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="m-t-20 w-100 float-l" ref="dataForm" :rules="rules" :model="modiArgs" label-position="right">
          <el-form-item class="float-l w-input" label-width="190px"  label="计算标准：" prop="platformRateType">
            <el-select class="w-100" v-model="modiArgs.platformRateType"  clearable placeholder="请选择计算标准">
              <el-option v-for="(item,k) in $common.commercialType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l w-input" style="height:40px">
          </el-form-item>
          
        <el-form-item class="float-l w-input rate" label-width="190px" label="平台费率(%)：" prop="platformRate">
          <el-input  @click.stop.native="showStatus = true" v-model="modiArgs.platformRate" placeholder="请输入平台费率" type="number" step="0.01" />
          <p class="w-100" v-if="showStatus && rateList.length > 0" >
            <ul>
              <li v-for="v,k in rateList" :key="k" @click.stop="changeRate(v)" >{{ v.platformRate }}%</li>
            </ul>
          </p>
        </el-form-item>

        <el-form-item class="float-l w-input" label-width="190px"  label="缴纳周期：" prop="platformPaymentType">
          <el-select v-model="modiArgs.platformPaymentType"  clearable placeholder="请选择缴纳周期">
            <el-option v-for="(item,k) in $common.paymentType" :key="k" :label="item" :value="k + 1"/>
          </el-select>
        </el-form-item>

        <el-form-item class="float-l w-input" label-width="190px"  label="金额范围最小值(USD)：" prop="amountRangeMin" >
          <el-input  v-model="modiArgs.amountRangeMin" placeholder="请输入最小值"  /> 
        </el-form-item>
        <el-form-item class="float-l w-input" style="height:40px">
        </el-form-item>

        <el-form-item class="float-l w-input" label-width="190px"  label="金额范围最大值(USD)：" prop="amountRangeMax" > 
          <el-input  v-model="modiArgs.amountRangeMax" placeholder="请输入最大值"  /> 
        </el-form-item>
        <el-form-item class="float-l w-input" style="height:40px">
        </el-form-item>

        <el-form-item class="float-l w-100" label-width="190px"  label="备注：">
          <el-input :rows="4" type="textarea" v-model="modiArgs.remark" placeholder="请输入备注" class="w-50" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button  type="primary" @click="createData">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>

import * as API from '@/api/settingCenter'
import * as Public from '@/api/public'
export default {


  data(){
    return{
      showStatus : false,
      titleList: [
        "序号",
        "计算标准",
        "金额范围(USD)",
        "平台费率",
        "缴纳周期",
        "备注信息",
        "最后更新人",
        "最后更新时间",
        "操作",
      ],
      rules: {
        platformRateType: [{ required: true, message: '必填', trigger: 'blur' }],
        platformRate: [{ required: true, message: '必填', trigger: 'blur' }],
        platformPaymentType: [{ required: true, message: '必填', trigger: 'change' }],
        amountRangeMax: [{ required: true, message: '必填', trigger: 'blur' }],
        amountRangeMin: [{ required: true, message: '必填', trigger: 'blur' }],
      },
      modiArgs: {
        amountRangeMax: '',
        amountRangeMin: '',
        id: '',
        operate: '',
        platformPaymentType: '',
        platformRate: '',
        platformRateType: '',
        remark: '',
      },
      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        amountRangeBy: "",
        platformPaymentTypeBy: "",
        platformRateBy: "",
  
      },

      dialogStatus: '',
      dialogFormVisible: false,
      list: [],
      rateList: [],
      total: 0,
      listLoading: true,
      textMap: {
        update: '编辑',
        create: '新增',
      },
    }
  },
  created() {
    this.getRateList();
    this.fetchData();
  },
  methods:{
    handleUpdate(row) { //添加
      let newRow = JSON.parse(JSON.stringify(row))
      this.modiArgs = newRow
      this.modiArgs.operate = 2 //编辑
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },

    changeRate(v) {
      this.showStatus = false
      this.modiArgs.platformRate = v.platformRate
      // this.modiArgs.platformRateType = v.platformRateType
      // this.modiArgs.platformPaymentType = v.platformPaymentType
      // this.modiArgs.amountRangeMax = v.amountRangeMax
      // this.modiArgs.amountRangeMin = v.amountRangeMin
    },
    getRateList() {
      Public.getAllPlatformRate().then(res => {
        this.rateList = res.data
      })
    },


    changeSort(column) { 
      this.listQuery.amountRangeBy = ""
      this.listQuery.platformPaymentTypeBy = ""
      this.listQuery.platformRateBy = ""

      var args = {
        "descending" : "desc",
        "ascending" : "asc",
      }

      if(column.column.label == this.titleList[2]) {
        this.listQuery.amountRangeBy = args[column.order]
      } else if(column.column.label == this.titleList[3]) {
        this.listQuery.platformPaymentTypeBy = args[column.order]
      } else if(column.column.label == this.titleList[4]) {
        this.listQuery.platformRateBy = args[column.order]
      }

      this.listQuery.pageNum = 1
      this.fetchData()
    },

    handleCreate() { //添加
      this.modiArgs = {
        amountRangeMax: '',
        amountRangeMin: '',
        id: '',
        operate: 1, //添加
        platformPaymentType: '',
        platformRate: '',
        platformRateType: '',
        remark: '',
      }

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs.dataForm.validate(vaild => {
        if(vaild) {
          let args = this.$common.transferToSearchParams(this.modiArgs)
          API.addRate(args).then(res => {
            if(res.code == 0) {
              this.listQuery.pageNum = 1
              this.fetchData();
              this.dialogFormVisible = false
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
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





    fetchData() {
      this.listLoading = true

      let args = this.$common.transferToSearchParams(this.listQuery)

      API.getRatePage(args).then(res => {
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
.rate {
  position: relative;
}
.rate p {
  position: absolute;
  z-index: 10000;
  background-color:#fff;
  border:1px solid #999;
}

.rate ul {
  height:120px;
  overflow-y: auto;
}
.rate ul li {
  /* border-bottom: 1px solid #999; */
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}


</style>




