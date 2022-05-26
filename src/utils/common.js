import { Message } from 'element-ui'
import { getCurrency, getRuleName } from '@/api/public'

const common = {
    getRuleNameList: async () => {
        if(!common.isSet(localStorage.getItem('ruleNameList'))) {
            var newData = {
                    all : '全部'
            }
            await getRuleName().then(res => {
                for(var i in res.data) {
                    newData[res.data[i].id] = res.data[i].ruleName
                }
                
                localStorage.setItem('ruleNameList', JSON.stringify(newData))
            })
        }
        common.ruleNameList = JSON.parse(localStorage.getItem('ruleNameList'))

    },
    getCurrencyList: async () => {
        if(!common.isSet(localStorage.getItem('currencyList'))) {
            var newData = {}
            await getCurrency().then(res => {
                for(var i in res.data) {
                    newData[res.data[i].id] = res.data[i].currencyName
                }
                localStorage.setItem('currencyList', JSON.stringify(newData))
            })
        }
        common.currencyList = JSON.parse(localStorage.getItem('currencyList'))
    },


    resetArgs : (list) => { //清空参数
        Object.keys(list).forEach((k,v) => {
            if(k == "pageNum") {
                list[k] = 1
            } else if (k == "pageSize") {
                list[k] = common.defaultPage
            } else {
                list[k] = ""
            }
        })
        return list
    },
    isSet : (val)  => {
        if(val == undefined || val == '' || val == null) {
            return false
        } else {
            return true
        }
    },

    transferToSearchParams(json) {
        let args = new URLSearchParams()
        for(var i in json) {
            if(json[i] != "") {
                args.append(i, json[i])
            }
        }
        return args
    },

    beforeAvatarUpload : (file) => {
        if (file.type != 'image/jpeg' && file.type != 'image/jpg' && file.type != 'image/png') {
            Message.error('上传头像图片只能是 jpg,jpeg,png 格式!')
            return false
        }
        if ((file.size / 1024 / 1024)  > 2) {
            Message.error('上传头像图片大小不能超过 2MB!')
            return false
        }
    },
    copyFn: (text) => {
        if(text == '') {
            Message.error('请先填写内容')
            return
        }
        var oInput = document.createElement("input");
        oInput.value = text;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = "oInput";
        oInput.style.display = "none";
        Message.success('复制成功')
    },


    timeOut: 3000,
    defaultPage: 20,
    ruleNameList : [],
    currencyList : [],
    statusType : ["启用", "禁用"],
    isTest : ["正式商户", "测试商户"],
    langeType : ["简体中文", "英文"],
    commercialType : ["内部商户", "外部商户"],
    calculateType : ["盈利额", "投注额"],
    paymentType : ["每月", "每季度", "每半年", "每年"],
    walletProductType : ["转账钱包", "免转钱包"],
    calculateList : ["盈利额", "投注额"],
    tradeList : ["转入", "转出", "下注", "结算", "下注取消", "拒单"],
    tradeSourcesList : ["转入:转账钱包上分成功", "转出:转账钱包下分成功", "下注:下注(减钱)", "结算:结算(加钱)", "下注取消:下注取消(加钱)", "拒单:拒单(加钱)"],
    orderStatus : {
        "-2" : "下注返回失败", 
        "-1": "下注失败", 
        "0": "无", 
        "1": "下注成功", 
        "2": "已结算", 
        "3": "当局取消", 
        "4": "已统计", 
        "5": "重新统计", 
        "6": "事后取消", 
        "7": "清注" 
    },
}

export default common