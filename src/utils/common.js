import { Message } from 'element-ui'

const common = {

    resetArgs : (list) => { //清空参数
        Object.keys(list).forEach((k,v) => {
            if(k == "pageNum") {
                list[k] = 1
            } else if (k == "pageSize") {
                list[k] = 10
            } else {
                list[k] = ""
            }
        })
        return list
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
    defaultPage: 10,
    langeType : ["简体中文", "英文"],
    commercialType : ["内部商户", "外部商户"],
    currencyType : ["人民币", "美元","所有货币类型"],
    calculateType : ["盈利额", "投注额"],
    paymentType : ["每月", "每季度", "每半年", "每年"],
    walletProductType : ["转账钱包", "免转钱包"],
    currencyList : ["人民币", "美元", "欧元"],
}
export default common