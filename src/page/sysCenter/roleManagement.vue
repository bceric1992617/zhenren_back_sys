<template>
<div class="content-box">
  <div class="container">
      <el-button class="filter-item" type="primary" @click="handleCreate">
        创建角色
      </el-button>

    <div class="table-container">
      <el-table ref="Table1"
                :data="list"
                style="width: 100%;"
                border>
        <el-table-column label="序列号" align="center"  width="70px">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">{{scope.row.sex}}</template>
        </el-table-column>
        <el-table-column label="后台页面查看权限" align="center">
          <template slot-scope="scope">{{scope.row.age}}</template>
        </el-table-column>
        <el-table-column label="操作权限" align="center">
          <template slot-scope="scope">{{scope.row.nation}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="">
            <el-button type="text" @click="handleUpdate()">
              <i class="el-icon-edit-outline"></i>
            </el-button>

          </template>
        </el-table-column>

      </el-table>
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




