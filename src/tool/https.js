import axios from 'axios'
// import qs from 'qs'
// import message from '@/components/public/message/src'

import router from '@/router/index'
import {getCookie} from '@/tool/cookie'
// import cookie from '@/tools/cookie.js'

axios.defaults.timeout = 60000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.withCredentials = true;  //跨域携带cookie
import { message } from 'ant-design-vue';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;   //配置接口地址

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if(config.method  === 'post' || config.method  === 'put' || config.method  === 'delete'){
        // config.data = qs.stringify(config.data);
        // config.data = JSON.stringify(config.data);
    }

    config.headers.Authorization = getCookie('token'); 
    return config;
},(error) =>{
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    if (res.data) {
        if (res.data.errCode === 0) {
            return Promise.resolve(res.data.data);
            
        } else {
            message.error(res.data.errMsg)
            return Promise.reject(res.data);
        }
    } else {
        message.error(res.data.errMsg)
        return Promise.reject(res.data);
    }
    
}, function(error) {
    if(error?.response?.status === 401){
        router.replace('/login')
        return Promise.reject()
    }
    let data_new = error?.response?.data
    message.error(data_new?.errMsg || 'Error: server exception')
    return Promise.reject(data_new);
    
});

export const Https = {
    httpUrls: {
        interfaceUrl: '',
        accountIsLogin:'/api/account/isLogin', //判断用户是否登录
        accountLogin:'/api/account/login', //账号密码登录接口
        preLogin:'/api/account/preLogin',//预先登入
        accountSendEmail:'/api/account/sendEmail', //发送邮件
        accountResetPwd:'/api/account/resetPwd', //忘记密码修改
        accountLogout:'/api/account/logout',//登出
        accountBindEmail:'/api/account/bindEmail', //绑定邮箱
        elementGeneratePrint:'/api/element/generatePrint', //生成印花
        elementSavePrint:'/api/element/savePrint',//保存印花
        getRgbByTcx:'/api/element/getRgbByTcx', // 通过hsv值获取潘通信息
        getRgbByHsv:'/api/element/getRgbByHsv', //通过hsv值获取潘通信息
        designCollection:'/api/design/designCollection', //设计 Conllection
        reDesignCollection:'/api/design/reDesignCollection',//重新设计 Conllection
        countDesignProcess:'/api/design/countDesignProcess', //统计design进度
        getRgbByHsvBatch:'/api/element/getRgbByHsvBatch', //通过hsv值数组批量获取潘通信息
        designLike:'/api/design/like', //Design Like
        designDislike: '/api/design/dislike', //Design Dislike
        queryUserGroup:'/api/history/queryUserGroup', //History用户分页分组列表
        deleteUserGroup:'/api/history/deleteUserGroup', //History删除用户分组
        updateUserGroupName:'/api/history/updateUserGroupName', //History修改用户分组名
        historyChoose:'/api/history/choose', //History choose
        getDesignDetail:'/api/design/detail/getDetail',//查询design详情
        generateHighDesign:'/api/design/detail/generateHighDesign',//生成高级design图片
        getNextSysElement:'/api/design/detail/getNextSysElement',//切换系统的element
        detailPrintDot:'/api/design/detail/printDot',//print打点预览
        designSingle:'/api/design/detail/designSingle',//单个design
        queryLibraryPage:'/api/library/queryLibraryPage',//Library分页列表
        libraryUpload:'/api/library/upload', // Library文件上传
        batchUpdateLibraryName:'/api/library/batchUpdateLibraryName',//Library修改用户文件名
        batchDeleteLibrary:'/api/library/batchDeleteLibrary',//删除library
        queryLibraryTopAndBottomPage:'/api/library/queryLibraryTopAndBottomPage',//Library分页列表(查询top和bottom)
        deleteHighDesign:'/api/design/detail/deleteHighDesign',//删除高级design图片
        saveOrEditTemplatePoint:'/api/library/saveOrEditTemplatePoint',//保存或者编辑template打点
        libraryModelsDot:'/api/library/modelsDot',//Models打点预览
     
    },

    axiosGet(url,config) {
        return new Promise((resolve, reject) => {
            axios.get(url,config).then(response => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
            })
        });    
    },

    axiosPut(url, data) {
        return new Promise((resolve, reject) => {
            axios.put(url, data).then(response => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
            })
        });    
    },

    axiosPost(url, data,config) {
        return new Promise((resolve, reject) => {
            axios.post(url, data,config).then(response => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
            })
        });    
    },

    axiosDelete(url, newData) {
        return new Promise((resolve, reject) => {
            axios.delete(url,{data:newData}).then(response => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
            })
        });    
    },

 



}
