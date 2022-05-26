<template>
<div class="content-box" @click="isTestId = ''">
  <div class="container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="商户编号：">
          <el-input v-model="listQuery.merchantCode" placeholder="请输入商户编号" class="filter-item"  />
        </el-form-item>
        <el-form-item label="商户名称：">
          <el-input v-model="listQuery.merchantName" placeholder="请输入商户名称" class="filter-item"  />
        </el-form-item>
        <el-form-item label="商户账号：">
          <el-input v-model="listQuery.merchantAccount" placeholder="请输入商户账号" class="filter-item"  />
        </el-form-item>

      
      </el-form>
      <el-button  class="filter-item" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button  class="filter-item" @click="$common.resetArgs(listQuery);fetchData()">
        重置
      </el-button>
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
          <template slot-scope="scope">{{scope.row.merchantCode}}</template>
        </el-table-column>
        <el-table-column :label="titleList[2]" align="center">
          <template slot-scope="scope">{{scope.row.merchantAccount}}</template>
        </el-table-column>
        <el-table-column :label="titleList[3]" align="center">
          <template slot-scope="scope">{{scope.row.merchantName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[4]" align="center" sortable>
          <template slot-scope="scope">LV{{ scope.row.level }}</template>
        </el-table-column>
        <el-table-column :label="titleList[5]" align="center">
          <template slot-scope="scope">{{ $common.commercialType[scope.row.merchantType - 1] }}</template>
        </el-table-column>
        <el-table-column :label="titleList[6]" align="center"  width="125px">
          <template slot-scope="scope">
            <div v-if="isTestId == scope.row.id" >
              <el-select v-model="scope.row.isTest" @change="updateUserStatus(scope.row)" >
                <el-option v-for="(item,k) in $common.isTest" :key="k" :label="item" :value="k"/>
              </el-select>
            </div>
            <el-tooltip v-else content="编辑" placement="bottom">
              <div  @click.stop="isTestId = scope.row.id">
                {{ $common.isTest[scope.row.isTest] }}
                <el-button type="text">
                  <i class="el-icon-edit-outline"></i>
                </el-button>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="titleList[7]" align="center">
          <template slot-scope="scope">{{ $common.langeType[scope.row.defaultLanguageType - 1]}}</template>
        </el-table-column>

        <el-table-column :label="titleList[8]" align="center">
          <template slot-scope="scope"> 
              <el-popover
                v-if="JSON.parse(scope.row.merchantContact).length > 1"
                placement="bottom"
                title="商务联系人"
                width="200"
                trigger="click"
                :content="nameStr">
                <div slot="reference" @click="setNameContent(scope.row)">
                  {{ JSON.parse(scope.row.merchantContact)[0].name }}
                  <el-button type="text">
                    <i class="el-icon-search"></i>
                  </el-button>
                </div>
              </el-popover>
              <span v-else>{{ JSON.parse(scope.row.merchantContact)[0].name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="titleList[9]" align="center" width="130px">
          <template slot-scope="scope"> 
            <el-popover
              v-if="JSON.parse(scope.row.merchantContact).length > 1"
              placement="bottom"
              title="联系方式"
              width="200"
              trigger="click"
              :content="numberStr">
            <el-tooltip content="查看" placement="bottom">
              <div slot="reference" @click="setContactContent(scope.row)">
                {{ JSON.parse(scope.row.merchantContact)[0].number }}
                <el-button type="text">
                  <i class="el-icon-search"></i>
                </el-button>
              </div>
            </el-tooltip>
            </el-popover>
            <span v-else>{{ JSON.parse(scope.row.merchantContact)[0].number }}</span>
          </template>
        </el-table-column>
        
        <el-table-column :label="titleList[10]" align="center">
          <template slot-scope="scope">{{scope.row.merchantMaintainer}}</template>
        </el-table-column>
        <el-table-column :label="titleList[11]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column :label="titleList[12]" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="bottom">
              <div @click="changeStatus(scope.row)">
                {{ $common.statusType[scope.row.status - 1 ]}}
                <el-button type="text">
                  <i class="el-icon-edit-outline"></i>
                </el-button>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="titleList[13]" width="140" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="bottom">
              <el-button class="text-20" type="text" @click="handleUpdate(scope.row,false)">
                <i class="el-icon-edit-outline"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="查看" placement="bottom">
              <el-button class="text-20" type="text" @click="handleUpdate(scope.row,true)">
                <i class="el-icon-search"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="编辑IP白名单" placement="bottom">
              <el-button class="text-20" type="text" @click="handleIPUpdate(scope.row)">
                <i class="el-icon-location-outline"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="重置密钥" placement="bottom">
              <el-button class="text-20" type="text" @click="resetPw(scope.row)">
                <i class="el-icon-key"></i>
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

    <!-- 编辑页面或新增 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-steps :active="active" finish-status="success" class="float-l w-100">
        <el-step title="基本信息"></el-step>
        <el-step title="商户信息"></el-step>
        <el-step title="技术参数"></el-step>
      </el-steps>
   
        <div v-if="active  == 0">
          <el-form class="m-t-20 w-100 float-l" ref="step1DataForm" :rules="rules1" :model="modiArgs.step1" label-position="right">
          
          <el-form-item v-if="dialogStatus != 'create'" class="float-l w-input" label-width="130px"  label="商户编号：">
            <el-input disabled v-model="modiArgs.step1.merchantCode" placeholder="请输入商户编号"  />
          </el-form-item>
          <el-form-item class="float-l w-input" label-width="130px"  label="C端默认语言：" prop="defaultLanguageType">
            <el-select :disabled="isDetail" class="w-100" v-model="modiArgs.step1.defaultLanguageType" placeholder="请选择C端默认语言">
              <el-option v-for="(item,k) in $common.langeType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l w-input" label-width="130px"  label="商户账号：" prop="merchantAccount">
            <el-input :disabled="dialogStatus == 'create' ? false : true" v-model="modiArgs.step1.merchantAccount" placeholder="字母+数字组合 6-12"  />
          </el-form-item>

          <el-form-item v-if="dialogStatus == 'create'" class="float-l w-input" label-width="130px"  label="商户密码：" prop="merchantPassword">
            <el-input :disabled="isDetail" v-model="modiArgs.step1.merchantPassword" placeholder="字母+数字组合 8-12"  />
          </el-form-item>
          <el-form-item v-else class="float-l w-input" label-width="130px"  label="商户密码：" prop="merchantPasswordUpdate">
            <el-input :disabled="isDetail" v-model="modiArgs.step1.merchantPasswordUpdate" placeholder="字母+数字组合 8-12"  />
          </el-form-item>
          <el-form-item class="float-l w-input" label-width="130px"  label="商户名称：" prop="merchantName">
            <el-input :disabled="isDetail" v-model="modiArgs.step1.merchantName" placeholder="请输入商户名称"  />
          </el-form-item>

          <el-form-item class="float-l w-input" label-width="130px"  label="邮箱地址：" prop="email">
            <el-input :disabled="isDetail" v-model="modiArgs.step1.email" placeholder="请输入邮箱地址"  />
          </el-form-item>
          <el-form-item v-if="dialogStatus == 'create'" class="float-l w-input" style="height:40px">
          </el-form-item>

          <div v-for="item,k in modiArgs.step1.merchantContactStr" :key="k">
            <el-form-item class="float-l w-input" label-width="130px"  label="商务联系人：" :prop="contactList[k].name" >
              <el-input :disabled="isDetail" v-model="item.name" placeholder="请输入商务联系人"  />
            </el-form-item>
            <el-form-item class="float-l w-input" label-width="130px"  label="商务方式：" :prop="contactList[k].number">
              <el-input :disabled="isDetail" v-model="item.number" placeholder="请输入商务方式"  />
            </el-form-item>
          <div v-if="!isDetail">
            <p v-if="k == 0" @click="addContactInfo" class="float-l m-l-10 m-t-n-5"  > 
              <el-button type="text" class="text-24"  >
                <i class="el-icon-circle-plus-outline"></i>  
              </el-button>
            </p>
            <p v-else @click="delContactInfo(k)" class="float-l m-l-10 m-t-n-5"> 
              <el-button type="text" class="text-24">
                <i class="el-icon-remove-outline"></i>    
              </el-button>
            </p>
            </div>
          </div>

          <el-form-item class="float-l w-input" label-width="130px"  label="国家：" >
            <el-input :disabled="isDetail" v-model="modiArgs.step1.nation" placeholder="请输入国家"  />
          </el-form-item>
          <el-form-item class="float-l w-input" label-width="130px"  label="省市区：" >
            <el-input :disabled="isDetail" v-model="modiArgs.step1.city" placeholder="请输入省市区"  />
          </el-form-item>

          <el-form-item class="float-l w-100" label-width="130px"  label="详细地址：">
            <el-input :disabled="isDetail" :rows="4" type="textarea" v-model="modiArgs.step1.address" placeholder="请输入详细地址" class="w-50" />
          </el-form-item>
          </el-form>

        </div>
        <div v-else-if="active  == 1">
          <el-form class="m-t-20 w-100 float-l" ref="step2DataForm" :rules="rules2" :model="modiArgs.step2" label-position="right">
          <el-form-item class="float-l w-input-30" label-width="130px"  label="商户等级：" prop="level">
            <el-input :disabled="isDetail" v-model="modiArgs.step2.level" placeholder="请输入商户等级"  />
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="内外部商户：" prop="merchantType">
            <el-select :disabled="isDetail" class="w-100" v-model="modiArgs.step2.merchantType"  clearable placeholder="请选择内外部商户">
              <el-option v-for="(item,k) in $common.commercialType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="结算币种：" prop="settleCurrency">
            <el-select :disabled="isDetail" class="w-100" v-model="modiArgs.step2.settleCurrency"  clearable placeholder="请选择结算币种">
              <el-option v-for="(item,k) in $common.currencyList" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>

          <el-form-item class="float-l w-input-30" label-width="130px"  label="平台费率(%)：" prop="platformRate">
            <el-input :disabled="isDetail" v-model="modiArgs.step2.platformRate" placeholder="请输入平台费率"  />
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="计算标准：" prop="platformCalculateType">
            <el-select :disabled="isDetail" class="w-100" v-model="modiArgs.step2.platformCalculateType"  clearable placeholder="请选择计算标准">
              <el-option v-for="(item,k) in $common.calculateType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="缴纳周期：" prop="platformPaymentType">
            <el-select :disabled="isDetail" class="w-100" v-model="modiArgs.step2.platformPaymentType"  clearable placeholder="请选择缴纳周期">
              <el-option v-for="(item,k) in $common.paymentType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>

          <el-form-item class="float-l w-input-30" label-width="130px"  label="会员费：" prop="memberFee">
            <el-input :disabled="isDetail" v-model="modiArgs.step2.memberFee" placeholder="请输入会员费"/>
          </el-form-item>
          <el-form-item class="float-l  w-input-30" label-width="130px"  label="缴纳周期：" prop="paymentType">
            <el-select :disabled="isDetail" class="w-100" v-model="modiArgs.step2.memberPaymentType"  clearable placeholder="请选择缴纳周期">
              <el-option v-for="(item,k) in $common.paymentType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l  w-input-30" style="height:40px">
          </el-form-item>

          <el-form-item class="float-l w-input-30" label-width="130px"  label="技术服务费：" prop="technologyFee">
            <el-input :disabled="isDetail" v-model="modiArgs.step2.technologyFee" placeholder="请输入技术服务费"   />
          </el-form-item>
          <el-form-item class="float-l w-input-30" label-width="130px"  label="缴纳周期：">
            <el-select :disabled="isDetail" class="w-100" v-model="modiArgs.step2.technologyPaymentType"  clearable placeholder="请选择缴纳周期">
              <el-option v-for="(item,k) in $common.paymentType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="float-l  w-input-30" style="height:40px">
          </el-form-item>

          <!-- <el-form-item class="float-l w-input-30" label-width="130px"  label="商户有效期：">
            <el-date-picker
            class="w-100"
            v-model="listQuery.timerange"
            type="datetimerange"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item> -->
          <el-form-item class="float-l w-input-30" label-width="130px"  label="商户维护人：">
            <el-input :disabled="isDetail" v-model="modiArgs.step2.merchantMaintainer" placeholder="请输入商户维护人"   />
          </el-form-item>
          <el-form-item class="float-l  w-input-30" style="height:40px">
          </el-form-item>

          <el-form-item class="float-l w-100" label="合作协议文件：" label-width="130px">
            <div v-if="isDetail">
              <img v-if="uploadImg" :src="uploadImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <div v-else>
              <el-upload
                name="files"
                class="float-l avatar-uploader"
                action="/file/manyFileUpload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="$common.beforeAvatarUpload"
                :headers="header"
                >
              <img v-if="uploadImg" :src="uploadImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          </el-form>
        </div>
        <div v-else-if="active  == 2">
          <el-form class="m-t-20 w-100 float-l" ref="step3DataForm" :rules="rules3" :model="modiArgs.step3" label-position="right">
          <el-form-item class="w-50" label-width="150px"  label="钱包产品类型：" prop="walletType">
            <el-select :disabled="isDetail" class="w-100" v-model="modiArgs.step3.walletType"  clearable>
              <el-option v-for="(item,k) in $common.walletProductType" :key="k" :label="item" :value="k + 1"/>
            </el-select>
          </el-form-item>
          <el-form-item class="w-100" label-width="150px"  label="IP白名单：" prop="whiteIps">
            <el-input :disabled="isDetail" :rows="4" type="textarea" v-model="modiArgs.step3.whiteIps" placeholder="（多个IP白名单以英文“,”分割）" class="w-50" />
          </el-form-item>
          <el-form-item class="w-100" label-width="150px"  label="服务器IP白名单：" prop="serverWhiteIps">
            <el-input :disabled="isDetail" :rows="4" type="textarea" v-model="modiArgs.step3.serverWhiteIps" placeholder="（多个IP白名单以英文“,”分割）" class="w-50" />
          </el-form-item>

          <el-form-item v-if="modiArgs.step3.walletType == 2" class="w-100" label-width="150px"  label="加扣款接口URL：" prop="addDeductionUrl">
            <el-input :disabled="isDetail" v-model="modiArgs.step3.addDeductionUrl" placeholder="请输入加扣款接口url" class="w-50" />
          </el-form-item>
          <el-form-item v-if="modiArgs.step3.walletType == 2" class="w-100" label-width="150px"  label="加扣款回调URL：" prop="addDeductionCallbackUrl">
            <el-input :disabled="isDetail" v-model="modiArgs.step3.addDeductionCallbackUrl" placeholder="请输入加扣款回调url" class="w-50" />
          </el-form-item>
          </el-form>
        </div>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        
        <el-button v-if="active != 0" @click="last" type="primary">
          上一步
        </el-button>

        <el-button v-if="active != 2" @click="next" type="primary">
          下一步
        </el-button>

        <el-button v-if="active == 2 && !isDetail" type="primary" @click="dialogStatus == 'update' ? updateData() : createData()">
          保存
        </el-button>

      </div>
    </el-dialog>


    <!-- IP编辑 -->
    <el-dialog title="IP白名单编辑" :visible.sync="dialogIPFormVisible">
      <el-form  ref="dataIPForm" :rules="IPRules" :model="modiIPArgs" label-position="right">
          <el-form-item class="w-100" label-width="150px"  label="IP白名单：" prop="whiteIps">
            <el-input :rows="4" type="textarea" v-model="modiIPArgs.whiteIps" placeholder="（多个IP白名单以英文“,”分割）" class="w-50" />
          </el-form-item>
          <el-form-item class="w-100" label-width="150px"  label="服务器IP白名单：" prop="serverWhiteIps">
            <el-input :rows="4" type="textarea" v-model="modiIPArgs.serverWhiteIps" placeholder="（多个IP白名单以英文“,”分割）" class="w-50" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogIPFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createIPData()">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</div>
</template>

<script>
import * as API from '@/api/businessCenter'

export default {
  data(){
    return{
      titleList: [
        "序号",
        "商户编号",
        "商户账号",
        "商户名称",
        "商户等级",
        "内外部商户",
        "商户类型",
        "C端默认语言",
        "商务联系人",
        "联系方式",
        "商户维护人",
        "入驻时间",
        "商户状态",
        "操作",
      ],
      header: {
        authorization : localStorage.getItem("token")
      },

      active: 0,
      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        merchantAccount: "",
        merchantCode: "",
        merchantName: "",
        levelSort: "",
        createTimeSort: "",

      },
      modiArgs: {
        step1 : {
          merchantCode: '',
          defaultLanguageType: '',
          merchantAccount: '', //商户账号
          merchantPassword: '', //商户密码
          merchantPasswordUpdate: '', 
          merchantName: '', //商户名称
          email: '',
          merchantContactStr: [ //联系人
            { name:'',number:''}
          ], 
          nation: '', //国家
          city: '', //市省区
          address: '', //地址
        },
        step2 : {
          level: '',
          merchantType: '', //内外部商户 1内 2外
          settleCurrency: '', //结算币种 1美金2人民币
          platformRate: '', //平台费率
          platformCalculateType: '', //计算标准  1 盈利额2投注额
          platformPaymentType: '', //缴纳周期(平台) 1月 2季度 3半年 4年
          memberFee: '', //会员费率
          memberPaymentType: '', //缴纳周期(会员)
          technologyFee: '', //技术服务费
          technologyPaymentType: '', //缴纳周期(技术服务费)
          merchantMaintainer: '', 
          fileUrl: '',  // 合作协议文件
        },
        step3 : {
          walletType : '', //钱包产品类型. 1 转账 2免转
          whiteIps : '', //ip白名单
          serverWhiteIps : '', //ip服务白名单
          addDeductionUrl : '', //加扣款接口
          addDeductionCallbackUrl : '', //加扣款回调
        },
      },
      
      modiIPArgs: {
        serverWhiteIps : '',
        whiteIps : '',
        id : '',
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogIPFormVisible: false,
      isDetail: false,
      isTestId:'',
      uploadImg:'',
      nameStr:'',
      numberStr:'',
      list: [],
      contactList:[
        {
          name:"merchantContactStr[0].name",
          number:"merchantContactStr[0].number"
        },
        {
          name:"merchantContactStr[1].name",
          number:"merchantContactStr[1].number"
        },
        {
          name:"merchantContactStr[2].name",
          number:"merchantContactStr[2].number"
        },
      ],
      total: 0,
      listLoading: true,
      rules1: { //step1
        "defaultLanguageType": [{ required: true, message: '必填', trigger: 'blur' }],
        "merchantAccount": [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,12}/, message: '字母+数字组合 6-12', trigger: 'blur' },
        ],
        "merchantPassword": [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,12}/, message: '字母+数字组合 8-12', trigger: 'blur' },
        ],
        "merchantPasswordUpdate": [
          { pattern: /(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,12}/, message: '字母+数字组合 8-12', trigger: 'blur' },
        ],

        "merchantName": [{ required: true, message: '必填', trigger: 'blur' }],
        "email": [{ required: true, message: '必填', trigger: 'blur' }],
        "merchantContactStr[0].name": [{ required: true, message: '必填', trigger: 'blur' }],
        "merchantContactStr[0].number": [{ required: true, message: '必填', trigger: 'blur' }],
        "merchantContactStr[1].name": [{ required: true, message: '必填', trigger: 'blur' }],
        "merchantContactStr[1].number": [{ required: true, message: '必填', trigger: 'blur' }],
        "merchantContactStr[2].name": [{ required: true, message: '必填', trigger: 'blur' }],
        "merchantContactStr[2].number": [{ required: true, message: '必填', trigger: 'blur' }],
 
      },
      rules2: { //step2
        "level": [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: "只能输入数字,不能小于0", trigger: 'blur'}
        ],
        "merchantType": [{ required: true, message: '必填', trigger: 'change' }],
        "settleCurrency": [{ required: true, message: '必填', trigger: 'change' }],
        "platformRate": [
          { required: true, message: '必填', trigger: 'change' },
          { pattern: /^\d*?\.{1}\d+$/, message: "只能输入小数,不能小于0", trigger: 'blur'}
        ],
        "platformCalculateType": [{ required: true, message: '必填', trigger: 'change' }],
        "platformPaymentType": [{ required: true, message: '必填', trigger: 'change' }],
        "memberFee": [
            { pattern: /^\d*?\.?\d*?$/, message: "只能输入数字,不能小于0", trigger: 'blur'}
        ],
        "technologyFee": [
            { pattern: /^\d*?\.?\d*?$/, message: "只能输入数字,不能小于0", trigger: 'blur'}
        ],
      },
      rules3: { //step3
        "walletType": [{ required: true, message: '必填', trigger: 'change' }],
        "whiteIps": [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^(\,{0,}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}){1,}$/, message: "请输入正确IP和英文逗号隔开", trigger: 'blur'}
        ],
        "serverWhiteIps": [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^(\,{0,}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}){1,}$/, message: "请输入正确IP和英文逗号隔开", trigger: 'blur'}
        ],
        "addDeductionUrl": [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/, message: "请输入正确的url", trigger: 'blur'}
        ],
        "addDeductionCallbackUrl": [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/, message: "请输入正确的url", trigger: 'blur'}
        ],
      },
      IPRules: {
        serverWhiteIps: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^(\,{0,}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}){1,}$/, message: "请输入正确IP和英文逗号隔开", trigger: 'blur'}
        ],
        whiteIps: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^(\,{0,}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}){1,}$/, message: "请输入正确IP和英文逗号隔开", trigger: 'blur'}
        ],
      },
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '查看',
      },

    }
  },
  created() {
    this.fetchData();
  },
  methods:{
    setNameContent(row) {
      var merchantContactList = JSON.parse(row.merchantContact)

      var nameStr = ""
      for(var i in merchantContactList) {
        nameStr += "," + merchantContactList[i].name
      }
      this.nameStr = nameStr.slice(1)
    },
    setContactContent(row) {
      var merchantContactList = JSON.parse(row.merchantContact)

      var nameStr = ""
      for(var i in merchantContactList) {
        nameStr += "," + merchantContactList[i].number
      }
      this.numberStr = nameStr.slice(1)
    },
    createData() {
      this.$refs.step3DataForm.validate(vaild => {
        if(vaild) {
          var newModiArgs = {}
          this.modiArgs.step1.merchantContactStr = JSON.stringify(this.modiArgs.step1.merchantContactStr)
          
          for(var i in this.modiArgs) {
            for(var j in this.modiArgs[i]) {
              newModiArgs[j] = this.modiArgs[i][j]
            }
          }
          
          let args = this.$common.transferToSearchParams(newModiArgs)

          API.addBusinessInfo(args).then(res => {
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
    updateData() {
      this.$refs.step3DataForm.validate(vaild => {
        if(vaild) {
          this.modiArgs.step1.merchantPassword = this.modiArgs.step1.merchantPasswordUpdate

          var newModiArgs = {}
          this.modiArgs.step1.merchantContactStr = JSON.stringify(this.modiArgs.step1.merchantContactStr)
          
          for(var i in this.modiArgs) {
            for(var j in this.modiArgs[i]) {
              newModiArgs[j] = this.modiArgs[i][j]
            }
          }
          
          let args = this.$common.transferToSearchParams(newModiArgs)

          API.updateBusinessInfo(args).then(res => {
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

    handleIPUpdate(row) {
      let newRow = JSON.parse(JSON.stringify(row))
      this.modiIPArgs.serverWhiteIps = newRow.serverWhiteIps
      this.modiIPArgs.whiteIps = newRow.whiteIps
      this.modiIPArgs.id = newRow.id
      this.dialogIPFormVisible = true;
    },
    createIPData() {
      this.$refs.dataIPForm.validate(valid => {
        if(valid) {
          let args = this.$common.transferToSearchParams(this.modiIPArgs)
          API.resetIp(args).then(res => {
            if(res.code == 0) {
              this.listQuery.pageNum = 1
              this.fetchData()
              this.dialogIPFormVisible = false
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          })
        }
      }) 
    },

    resetPw(row) {
      var text = "确定重置密钥吗？一旦操作立即生效";
      this.$confirm(text,"提示", {
        cancelButtonText : "取消",
        confirmButtonText : "确定",
        type : 'warning'
      }).then(() => {
        let args =  new URLSearchParams();
        args.append("id", row.id);
        API.resetGoogleKey(args).then(res => {
          if(res.code == 0) {
            this.listQuery.pageNum = 1
            this.fetchData()
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    updateUserStatus(row){
      let args =  new URLSearchParams();
      args.append("id", row.id);
      args.append("isTest", row.isTest);
      API.updateIsTest(args).then(res => {
          if(res.code == 0) {
            row.isTest = row.isTest;
            this.isTestId = ''
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
      })
    },
    changeStatus(row){
      if(row.status == 2) {
        var status = 1;
        var text = "确定启用吗？一旦操作立即生效";
      } else {
        var status = 2;
        var text = "确定禁用吗？一旦操作立即生效";
      }

      this.$confirm(text,"提示", {
        cancelButtonText : "取消",
        confirmButtonText : "确定",
        type : 'warning'
      }).then(() => {
        let args =  new URLSearchParams();
        args.append("id", row.id);
        args.append("status", status);
        API.updateStatus(args).then(res => {
          if(res.code == 0) {
            row.status = status
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    changeSort(column) { //上架时间排序
      this.listQuery.createTimeSort = ""
      this.listQuery.levelSort = ""

      var args = {
        "descending" : "desc",
        "ascending" : "asc",
      }

      if(column.column.label == this.titleList[4]) {
        this.listQuery.levelSort = args[column.order]
      } else if(column.column.label == this.titleList[11]) {
        this.listQuery.createTimeSort = args[column.order]
      }
      
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    addContactInfo() {
      if(this.modiArgs.step1.merchantContactStr.length >= 3) {
        this.$message.error("不能大于3个！")
      } else {
        this.modiArgs.step1.merchantContactStr.push({name:'',number:''})
      }
    },
    delContactInfo(k) {
      this.modiArgs.step1.merchantContactStr.splice(k,1)
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

        this.uploadImg = res.data.urlList[0]
        this.modiArgs.step2.fileUrl = res.data.keyList[0]
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
      let dataFromList = ["step1DataForm","step2DataForm"]
      let active = this.active
      this.$refs[dataFromList[active]].validate(valid => {
        if(valid) {
          this.active = this.active > 2 ? 2 : ++this.active;
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


    handleFilter() { //搜索
      this.listQuery.pageNum = 1
      this.fetchData()
    },


    handleUpdate(row,isDetail) {
      this.$nextTick(() => {
        this.$refs.step1DataForm.clearValidate()
        this.$refs.step2DataForm.clearValidate()
        this.$refs.step3DataForm.clearValidate()
      })
      this.active = 0;
      this.dialogStatus = isDetail ? 'detail' : 'update'
      this.isDetail = isDetail
      this.dialogFormVisible = true

      let args = new URLSearchParams()
      args.append("id", row.id)

      API.getBusinessDetail(args).then(res => {
        this.uploadImg = res.data.showFileUrl
        this.modiArgs = {
          step1 : {
            id: row.id,
            merchantCode: res.data.merchantInfo.merchantCode,
            defaultLanguageType: res.data.merchantInfo.defaultLanguageType,
            merchantAccount: res.data.merchantInfo.merchantAccount, //商户账号
            merchantPassword: "", //商户密码
            merchantName: res.data.merchantInfo.merchantName, //商户名称
            email: res.data.merchantInfo.email,
            merchantContactStr: JSON.parse(res.data.merchantInfo.merchantContact),
            nation: res.data.merchantInfo.nation, //国家
            city: res.data.merchantInfo.city, //市省区
            address: res.data.merchantInfo.address, //地址
          },
          step2 : {
            level: res.data.merchantDetail.level,
            merchantType: res.data.merchantDetail.merchantType, //内外部商户 1内 2外
            settleCurrency: res.data.merchantDetail.settleCurrency, //结算币种 1美金2人民币
            platformRate: res.data.merchantDetail.platformRate, //平台费率
            platformCalculateType: res.data.merchantDetail.platformCalculateType, //计算标准  1 盈利额2投注额
            platformPaymentType: res.data.merchantDetail.platformPaymentType, //缴纳周期(平台) 1月 2季度 3半年 4年
            memberFee: res.data.merchantDetail.memberFee, //会员费率
            memberPaymentType: res.data.merchantDetail.memberPaymentType, //缴纳周期(会员)
            technologyFee: res.data.merchantDetail.technologyFee, //技术服务费
            technologyPaymentType: res.data.merchantDetail.technologyPaymentType, //缴纳周期(技术服务费)
            merchantMaintainer: res.data.merchantDetail.merchantMaintainer, 
            fileUrl: res.data.merchantDetail.fileUrl,  // 合作协议文件
          },
          step3 : {
            walletType :res.data.merchantDetail.walletType, //钱包产品类型. 1 转账 2免转
            whiteIps : res.data.merchantDetail.whiteIps, //ip白名单
            serverWhiteIps : res.data.merchantDetail.serverWhiteIps, //ip服务白名单
            addDeductionUrl : res.data.merchantDetail.addDeductionUrl, //加扣款接口
            addDeductionCallbackUrl : res.data.merchantDetail.addDeductionCallbackUrl, //加扣款回调
          },
        }

      })

    },
    handleCreate() { //添加
        this.$nextTick(() => {
          this.$refs.step1DataForm.clearValidate()
          this.$refs.step2DataForm.clearValidate()
          this.$refs.step3DataForm.clearValidate()
        })

      this.modiArgs = {
        step1 : {
          merchantCode: '',
          defaultLanguageType: '',
          merchantAccount: '', //商户账号
          merchantPassword: '', //商户密码
          merchantName: '', //商户名称
          email: '',
          merchantContactStr: [ //联系人
            { name:'',number:''}
          ], 
          nation: '', //国家
          city: '', //市省区
          address: '', //地址
        },
        step2 : {
          level: '',
          merchantType: '', //内外部商户 1内 2外
          settleCurrency: '', //结算币种 1美金2人民币
          platformRate: '', //平台费率
          platformCalculateType: '', //计算标准  1 盈利额2投注额
          platformPaymentType: '', //缴纳周期(平台) 1月 2季度 3半年 4年
          memberFee: '', //会员费率
          memberPaymentType: '', //缴纳周期(会员)
          technologyFee: '', //技术服务费
          technologyPaymentType: '', //缴纳周期(技术服务费)
          merchantMaintainer: '', 
          fileUrl: '',  // 合作协议文件
        },
        step3 : {
          walletType : '', //钱包产品类型. 1 转账 2免转
          whiteIps : '', //ip白名单
          serverWhiteIps : '', //ip服务白名单
          addDeductionUrl : '', //加扣款接口
          addDeductionCallbackUrl : '', //加扣款回调
        },
      }
      this.active = 0;
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.isDetail = false
    },


    fetchData() {
      this.listLoading = true
      let args = this.$common.transferToSearchParams(this.listQuery)

      API.getBusinessList(args).then(res => {
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




