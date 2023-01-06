<template>
    <div>
        <header class="header_component">
            <img class="header_logo"  @click="turnToNewPage('https://www.aidlab.hk/en/')" src="@/assets/images/loginPage/aida_logo.png" />
            <nav class="header_nav_content">
                <div :class="['nav_item', $route.name === 'home'?'select_nav':'']" @click="turnToPage('home')">HOME</div>
                <div  :class="['nav_item', $route.name === 'library'?'select_nav':'']" @click="turnToPage('library')">LIBRARY</div>
                <div :class="['nav_item', $route.name === 'history'?'select_nav':'']" @click="turnToPage('history')">HISTORY</div>
            </nav>
            <div class="header_right_content">
                <div class="header_icon icon iconfont icon-touxiang3"></div>
                <div class="header_user_content">
                    <div class="username">{{userInfo?.userName}}</div>
                    <div :class="['icon','iconfont', 'icon-xiala', isShowOperate?'icon_rotate':'']" @click.stop="changeShowOperateContent()"></div>
                    <nav class="select_block" v-show="isShowOperate">
                        <!-- <div class="select_item" @click="showBindEmailModal()">
                            <span class="icon iconfont icon-youxiang"></span><span class="select_item_des">bind email</span>
                        </div> -->
                        <div class="select_item" @click="logout()">
                            <span class="icon iconfont icon-tuichu"></span><span class="select_item_des">log off</span>
                        </div>
                    </nav>
                </div>
            </div>
        </header>

        <a-modal class="modal_component" 
            v-model:visible="bindEmailVisible" 
            :footer="null" 
            title="Mailbox binding"
            width="56rem"
            :maskClosable="false"
            :centered="true"
        >
            <template #closeIcon v-if="!isHaveBindEmail && bindEmailStep === 1">
                <div class="skip_content">skip</div>
            </template>
            <div class="bind_email_content" v-if="isHaveBindEmail">
                <div class="bind_email_tip">you have binded email</div>
                <div class="bind_email">{{userInfo.email}}</div>
            </div>
            <div class="bind_email_content"  v-else>
                <!-- 绑定邮箱第一步 start -->
                <div v-show="bindEmailStep === 1">
                    <div class="bind_email_form_content">
                        <div class="bind_email_form_title">Email</div>
                        <input class="bind_email_form_input" placeholder="Enter a new email" v-model="email" @keydown.enter="emailNextStepFun()">
                    </div>
                    <div class="bind_email_submit_button"  @click="emailNextStepFun()">Next step</div>
                </div>
                <!-- 绑定邮箱第一步 end -->

                <!-- 绑定邮箱第二步 start -->
                <div v-show="bindEmailStep === 2">
                    <div @click="emailLastStepFun()">
                        <span class="icon iconfont icon--shangyibu"></span><span class="email_last_step_content">Enter verification code</span>
                    </div>
                    <div class="email_last_step_des">
                        <div class="sent_email_content">Sent to {{email}}</div>
                        <div class="tip_content">
                            <span v-show="time">{{time}}s</span>
                            <span v-show="!time"  @click="emailNextStepFun()">Resend</span>
                        </div>
                    </div>
					<VerificationCodeInput :ct="emailCode" @sendCaptcha="submitBindEmail($event)"></VerificationCodeInput>
                </div>
                <!-- 绑定邮箱第一步 end -->
                
            </div>
        </a-modal>
    </div>
   
</template>
<script >
import { defineComponent ,createVNode} from 'vue'
import {isEmail} from '@/tool/util'
import {setCookie, getCookie, WriteCookie} from '@/tool/cookie'
import VerificationCodeInput from '@/component/LoginPage/verificationCodeInput.vue'
import { Https } from "@/tool/https";
import { Modal,message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
export default defineComponent({
    components:{
		VerificationCodeInput,
	},
    data(){
        return{
            isShowOperate:false,
            bindEmailVisible:false,
            isHaveBindEmail:false,
            bindEmailStep:1,
            email:'',
            emailCode:['','','','','',''],//邮箱验证码
            time:60,//60秒倒计时
            timer: 0,
            userInfo:{},
            timerOperate:null,
            numTime:30,
            timerSec:null,
            modalWarning:null
        }
    },
    mounted(){
        this.userInfo = JSON.parse(getCookie('userInfo'))
        if(!this.userInfo){
            this.$router.replace('/login')
        }else{
            this.accountIsLogin(this.userInfo)
        }
        this.isHaveBindEmail = this.userInfo?.email ? true : false

        this.operateClick()
        document.addEventListener('click',this.operateClick)
    },
    methods:{
        turnToNewPage(url){
            window.open(url)
        },

        turnToPage(name){
            let noRefresh = name === 'home' ? true :false
            this.$router.push({name:name,params: {noRefresh:noRefresh}})
        },

        //点击下拉图标出现操作
        changeShowOperateContent(){
            this.isShowOperate = !this.isShowOperate
            document.addEventListener('click',this.closeShowOperateContent,false)
        },

        //关闭下拉图标
        closeShowOperateContent(){
          this.isShowOperate = false
          document.removeEventListener('click',this.closeShowOperateContent)
        },

        //打开绑定邮箱弹窗
        showBindEmailModal(){
            this.bindEmailVisible = true
        },

        emailNextStepFun(){
            if(!isEmail(this.email)){
                message.error('The email format is incorrect');
                return
            }
            let data = {
                email:this.email,
                operationType: "BIND_MAILBOX",
            }
            const hide = message.loading('loading', 0);
            Https.axiosPost(Https.httpUrls.accountSendEmail, data).then((rv) =>{
                if(rv){
                    this.bindEmailStep = 2
                    this.emailCode = ['','','','','',''],
                    this.createTimer()
                    hide()
                    message.success('Succeeded in binding the mailbox.')
                }
            }).catch(res=>{
                 hide()
            })
        },

        //绑定邮箱的上一步
        emailLastStepFun(){
            this.bindEmailStep = 1
            this.email = ''
            this.emailCode = ['','','','','',''],
            this.clearTimer()
        },

        //创建定时器
        createTimer(){
            this.timer = setInterval(()=>{
                this.time--
                if(!this.time){
                clearInterval(this.timer)
                }
            },1000)
        },

        //清除定时器
        clearTimer(){
            this.time = 60
            if(this.timer){
                clearInterval(this.timer)
            }
        },

        //登出
        logout(){
            let data = {
                userId:this.userInfo.userId
            }
            Https.axiosPost(Https.httpUrls.accountLogout, data).then((rv) =>{
                this.$router.replace('/login')
                WriteCookie('token')
            })
        },

        //绑定邮箱
        submitBindEmail(emailVerifyCode){
             let data = {
                userEmail:this.email,
                userId: this.userInfo.userId,
                emailVerifyCode:emailVerifyCode
            }
            Https.axiosPost(Https.httpUrls.accountBindEmail, data).then((rv) =>{
                if(rv){
                    this.userInfo.email = this.email
                    setCookie('userInfo',JSON.stringify(this.userInfo))
                    this.bindEmailVisible = false,
                    this.bindEmailStep = 1
                    this.clearTimer()
                    this.emailCode = ['','','','','','']
                }
            })
        },

        //判断是否登录
        accountIsLogin(userInfo){
            let data ={
                userId:userInfo.userId
            }
             Https.axiosPost(Https.httpUrls.accountIsLogin, data).then((rv) =>{
                if(!rv){
                    this.$router.replace('/login')
                }
            })
        },

        //点击重置判断是否长时间五操作
        operateClick(){
            if(this.timer){
                clearTimeout(this.timer)
            }
            let _this = this
            let timeNum = 1000 * 60 *120
            this.timer = setTimeout(()=>{
                this.modalWarning =  Modal.warning ({
                    title: () => `You have not performed any operation for a long time. You must be active;otherwise, you will log out in ${_this.numTime} S`,
                    icon: createVNode(ExclamationCircleOutlined),
                    okText: 'Ok',
                    onOk() {
                       _this.numTime = 30
                       clearInterval(_this.timerSec)
                    }
                });
                _this.numCounter()
            },timeNum)
        },

        numCounter(){
            this.timerSec = setInterval(()=>{
                if(this.numTime > 0){
                    this.numTime = this.numTime - 1
                }else{
                    clearTimeout(this.timer)
                    clearInterval(this.timerSec)
                    this.logout()
                    this.modalWarning.destroy()
                }
            },1000)
        }
    }
})
</script>
<style lang="less" scoped>
.header_component{
    display: flex;
    width: 100%;
    height: 7rem;
    background: rgba(255, 255, 255, 0.2);
    border-bottom: 0.1rem solid rgba(3,3,3,0.1);
    position: relative;

    .header_logo{
        width: 14.4rem;
        height: 3.2rem;
        margin: 2.1rem 0 0 2.8rem;
    }

    .header_nav_content{
        display: flex;
        margin-left: 28.9rem;
        align-items: center;

        .nav_item{
            padding: 1.1rem 1rem;
            border-bottom: 0.1rem solid transparent;
            margin-right: 3.4rem;
            font-size: 1.6rem;
            line-height: 1.3rem;
            color: #333333;
            cursor: pointer;
            font-weight: 500;

            &.select_nav{
                background: #E6E6F6;
            }
        }
    }

    .header_right_content{
        position: absolute;
        top: 0;
        right: 3.2rem;
        display: flex;

        .header_icon{
            font-size: 3.6rem;
            position: relative;
            top: 0.3rem;
        }

        .header_user_content{
            margin-left: 1rem;
            display: flex;
            align-items: center;
            position: relative;
            top: 1.2rem;
            height: 3.7rem;

            .username{
                font-size: 1.6rem;
                color: #1A1A1A;
                margin-right: 0.8rem;
            }

            .icon-xiala{
                font-size: 1.4rem;
                cursor: pointer;
            }

            .icon_rotate{
                -moz-transform:rotate(180deg);
                -webkit-transform:rotate(180deg);
                transform: rotate(180deg);
                animation-direction: 0.5s;
            }

            .select_block{
                position: absolute;
                right: -1.5rem;
                top: 3.7rem;
                width: 11.4rem;
                background: #FFFFFF;
                box-shadow: 0px 0.4rem 0.4rem 0px rgba(0,0,0,0.1);
                z-index: 9;
                overflow: hidden;
                border: 1px solid #000000;

                .select_item{
                    padding-left: 1.5rem;
                    height: 4.1rem;
                    color: #4D4D4D;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    user-select:none;

                    &:hover{
                        background: #F7F7F7;
                    }

                    .iconfont{
                        font-size: 1.4rem;
                    }

                    .select_item_des{
                        font-size: 1.3rem;
                        margin-left: 0.8rem;
                    }
                }
            }
        }
    }
}
.modal_component{

    .skip_content{
        width: 6rem;
        height: 3rem;
        line-height: 2.8rem;
        border: 0.1rem solid #343579;
        font-size: 1.4rem;
        color: #343579;    
        position: absolute;
        top: 1.8rem;
        right: 1.8rem;
        cursor: pointer;
    }
    
    .bind_email_content{
        padding: 4.8rem 9.2rem 6rem;

        .bind_email_tip{
            font-size: 1.8rem;
            color: #A5B0C2;
            line-height: 1.9rem;
            text-align: center;
        }
        .bind_email{
            margin-top: 2rem;
            font-size: 2.2rem;
            font-weight: 400;
            color: #030303;
            text-align: center;
        }

        .bind_email_form_content{

            .bind_email_form_title{
                font-size: 2.2rem;
                font-weight: bold;
                color: #030303;
                line-height: 2.4rem;
            }

            .bind_email_form_input{
                width: 100%;
                height: 4.6rem;
                margin-top: 1rem;
                border: 0.1rem solid #B4BED7;
                padding-left: 2.1rem;
                line-height: 4.6rem;
                font-size: 1.8rem;
                box-sizing: border-box;

                &::placeholder {
                    color:#A5B0C2,
                }
            }
        }

        .bind_email_submit_button{
            height: 4.6rem;
            line-height: 4.6rem;
            background: #343579;
            font-size: 1.6rem;
            font-weight: 500;
            color: #FFFFFF;
            width: 12.8rem;
            text-align: center;
            cursor: pointer;
            margin: 3rem auto 0;
        }

        .icon--shangyibu{
            font-size: 2.5rem;
            font-weight: bold;
            color: #030303;
        }

        .email_last_step_content{
            margin-left: 1rem;
            font-size: 2.2rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #030303;
        }

        .tip_content{
            font-size: 1.3rem;
            font-weight: bold;
            color: #343579;
            cursor: pointer;
        }

        .email_last_step_des{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 2.5rem;
            margin-bottom: 1.5rem;

            .sent_email_content{
                font-size: 1.8rem;
                font-weight: bold;
                color: #A5B0C2;
            }
        }
    }
}
</style>
