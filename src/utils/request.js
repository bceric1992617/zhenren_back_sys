import axios from 'axios';
import global from '../global/global';
import Vue from 'vue';
import router from '../router';

axios.defaults.baseURL = global.baseURL;

const http = {
    

    request ({ url, data = {}, method = 'GET', responseType, header = {} }) {
        return new Promise((resolve, reject) => {
            this._request(url, resolve, reject, data, method, responseType, header);
        });
    },
    _request (url, resolve, reject, data = {}, method = 'GET', responseType, header) {
        const format = method.toLocaleLowerCase() == 'get' ? 'params' : 'data';
        header['Content-Type'] = 'application/json';
        if(url != "/login") {
            header["Authorization"] = localStorage.getItem("token")
        }
        console.log(321321)
        axios({
            url: url,
            method: method,
            [format]: data,
            headers: header,
            responseType
        }).then(res => {
            
            if(res.data.code == 0) {
                resolve(res.data);
                Vue.prototype.$message.success(res.data.message)
            } else if(res.data.code == 403) {
                router.push("/login")
                Vue.prototype.$message.error(res.data.message)
            } else {
                Vue.prototype.$message.error(res.data.message)
            }
            
        }).catch(error => {
            reject(error);
        })
    }
}

export { http };
