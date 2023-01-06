<template>
    <div class="login_page">
        <div class="page_content">
            <img
                class="login_logo"
                src="@/assets/images/loginPage/aida_Logo_login.png"
            />
            <!-- 账号密码和邮箱登录  start-->
            <div class="login_content" v-if="isLogin === 1">
                <div class="login_type_list">
                    <div
                        :class="[
                            'login_type_item','username_login_item',
                            'login_active',
                        ]"
                    >
                        Log on to AiDA
                    </div>
                </div>
                <!-- 账号密码登录 start -->
                <div v-show="loginType == 'username'">
                    <div class="login_form_content">
                        <div class="login_form_title">Username</div>
                        <input
                            class="login_form_input"
                            placeholder="Enter your username"
                            v-model="username"
                        />
                        <div class="login_form_title marign_top30">
                            <div>Password</div>
                            <!-- <div class="tip_content" @click="changeIsLogin(2)">
                                Forgot password？
                            </div> -->
                        </div>
                        <div class="password_input_block">
                            <input
                                class="login_form_input"
                                :type="passwordType"
                                placeholder="Enter your password"
                                v-model="password"
                                @keydown.enter="submitPerLogin()"
                            />
                            <div class="icon iconfont icon-yanjing_yincang_o password_show_icon" @click="changePasswordType()"></div>
                        </div>
                        
                    </div>
                    <div
                        class="login_submit_button marign_top40"
                        @click="submitPerLogin()"
                    >
                        Continue
                    </div>
                    
                    <div class="login_text"  >
                        <div class="forget_password_text" @click="changeIsLogin(2)">Forgot your password</div>
                    </div>

                </div>
                <!-- 账号密码登录 end -->

                <!-- 邮箱登录 start -->
                <div v-show="loginType == 'email'">
                    <div v-show="emailStap === 1" class="forget_password_content">
                        <div class="forget_password_content_block" @click="changeLoginType('username')">
                            <span class="icon iconfont icon--shangyibu"></span
                            ><span class="forget_password_content_title"
                                >Log on to AiDA</span
                            >
                        </div>
                        <div class="login_form_content">
                            <div class="login_form_title">Email</div>
                            <input
                                class="login_form_input"
                                placeholder="Enter your email address"
                                v-model="email"
                                @keydown.enter="emailNextStepFun()"
                            />
                        </div>
                        <div
                            class="login_submit_button marign_top40"
                            @click="emailNextStepFun()"
                        >
                            Continue
                        </div>
                    </div>

                    <div v-show="emailStap === 2" class="email_last_step">
                        
                        <div class="email_last_step_block" @click="emailLastStepFun()">
                            <span class="icon iconfont icon--shangyibu"></span
                            ><span class="email_last_step_content"
                                >Verify with one-time verification code</span
                            >
                        </div>
                        <div class="email_last_step_des">
                            <div class="sent_email_content">
                                Sent to {{ email }}
                            </div>
                            <div class="tip_content">
                                <span v-show="time">{{ time }}s</span>
                                <span v-show="!time" @click="emailNextStepFun()"
                                    >Resend</span
                                >
                            </div>
                        </div>
                        <VerificationCodeInput
                            :ct="emailCode"
                            @sendCaptcha="submitEmailLogin($event)"
                        ></VerificationCodeInput>

                        <div class="email_last_step_des">
                            <div class="sent_email_content email_tip_content">
                               Please check the junk box if you haven't received verification code
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 邮箱登录 end -->
            </div>

            <!-- 忘记密码 start -->
            <div class="forget_password_content" v-else>
                <div class="forget_password_content_block" @click="forgetPasswordLastStepFun()">
                    <span class="icon iconfont icon--shangyibu"></span
                    ><span class="forget_password_content_title"
                        >Retrieve password</span
                    >
                </div>
                <div v-show="frogetPasswordStep === 1">
                    <div class="forget_passored_form_content">
                        <div class="forget_passored_form_title">Email</div>
                        <input
                            class="forget_passored_form_input"
                            placeholder="Enter your email"
                            v-model="forgetPasswordEmail"
                            @keydown.enter="forgetPasswordNextStepFun()"
                        />
                    </div>
                    <div
                        class="forget_submit_button marign_top40"
                        @click="forgetPasswordNextStepFun()"
                    >
                        Next step
                    </div>
                </div>

                <div v-show="frogetPasswordStep === 2">
                    <div class="forget_verif_code_des">Verification Code</div>
                    <div class="email_last_step_des">
                        <div class="sent_email_content">
                            Sent to {{ forgetPasswordEmail }}
                        </div>
                        <div class="tip_content">
                            <span v-show="time">{{ time }}s</span>
                            <span
                                v-show="!time"
                                @click="forgetPasswordNextStepFun()"
                                >Resend</span
                            >
                        </div>
                    </div>
                    <VerificationCodeInput
                        :ct="emailCode"
                        @sendCaptcha="submitPasswordCode($event)"
                    ></VerificationCodeInput>
                </div>

                <div v-show="frogetPasswordStep === 3">
                    <div class="forget_passored_form_content">
                        <div class="forget_passored_form_title">Password</div>
                        <input
                            class="forget_passored_form_input"
                            placeholder="Enter a new password"
                            v-model="newPassword"
                            @keydown.enter="submitResetPassword()"
                        />
                    </div>
                    <div
                        class="forget_submit_button marign_top40"
                        @click="submitResetPassword()"
                    >
                        Submit
                    </div>
                </div>
            </div>
            <!-- 忘记密码 end -->
           
        </div>

        <div class="login_footer">
            <div class="login_footer_item"><div class="login_footer_item_text">©2022  CodeCreate</div></div>
            <div class="login_footer_item">
                <div class="login_footer_item_text footer_item_text_pointer" @click="turnToWindow('https://code-create.com.hk/aida-terms-and-conditions/')">Terms&Conditions</div>
                <div class="login_footer_line"></div>
                <div class="login_footer_item_text footer_item_text_pointer" @click="turnToWindow('https://code-create.com.hk/aida-subscription-agreement/')">Privacy Policy</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Https } from "@/tool/https";
import { isEmail } from "@/tool/util";
import { setCookie } from "@/tool/cookie";
import { message } from "ant-design-vue";
import VerificationCodeInput from "@/component/LoginPage/verificationCodeInput.vue";

const md5 = require("md5");

export default defineComponent({
    components: {
        VerificationCodeInput,
    },
    setup(){
        let timer:any =  0
        return{
            timer
        }
    },
    data() {
        return {
            isLogin: 1, //是否为登录 1-登录， 2-忘记密码
            loginType: "username",
            emailStap: 1, // 邮箱登录步骤
            emailCode: ["", "", "", "", "", ""], //邮箱验证码
            emailNextStep: true,
            username: "",
            password: "",
            email: "", //邮箱登录邮箱
            frogetPasswordStep: 1, //忘记密码的步骤
            forgetPasswordEmail: "",
            forgetEmailCode: ["", "", "", "", "", ""], //忘记密码的邮箱验证码
            forgetEmailValue: "", //忘记密码的邮箱验证码保存值
            newPassword: "", //新密码
            isCheckRobot: false,
            time: 60, //60秒倒计时
            passwordType:'password',
            userId:'',
        };
    },
    methods: {
        changeLoginType(type: string) {
            this.loginType = type;
        },

        //是否忘记密码页面
        changeIsLogin(isLogin: number) {
            if (isLogin === 1) {
                //登录
                this.forgetPasswordEmail = "";
                this.frogetPasswordStep = 1;
                this.forgetEmailCode = ["", "", "", "", "", ""];
                this.emailStap = 1;
                this.clearTimer();
            } else {
                this.username = "";
                this.password = "";
            }
            this.isLogin = isLogin;
        },

        //邮箱登录的下一步
        emailNextStepFun() {
            if (!isEmail(this.email)) {
                message.error("The email format is incorrect");
                return;
            }
            let data = {
                email: this.email,
                operationType: "LOGIN",
            };
            Https.axiosPost(Https.httpUrls.accountSendEmail, data).then(
                (rv: any) => {
                    if (rv) {
                        this.emailStap = 2;
                        this.time = 60;
                        this.emailCode = ["", "", "", "", "", ""]
                        this.createTimer();
                    }
                }
            );
        },

        //邮箱登录的上一步
        emailLastStepFun() {
            this.emailStap = 1;
            this.email = "";
            (this.emailCode = ["", "", "", "", "", ""]), this.clearTimer();
        },

        //忘记密码的下一步
        forgetPasswordNextStepFun() {
            if (!isEmail(this.forgetPasswordEmail)) {
                message.error("The email format is incorrect");
                return;
            }
            let data = {
                email: this.forgetPasswordEmail,
                operationType: "FORGET_PWD",
            };
            Https.axiosPost(Https.httpUrls.accountSendEmail, data).then(
                (rv: any) => {
                    if (rv) {
                        this.frogetPasswordStep = 2;
                        (this.forgetEmailCode = ["", "", "", "", "", ""]),
                            this.createTimer();
                    }
                }
            );
        },

        //忘记密码的上一步
        forgetPasswordLastStepFun() {
            if (this.frogetPasswordStep === 1) {
                this.changeIsLogin(1);
            } else {
                this.frogetPasswordStep = this.frogetPasswordStep - 1;
                this.forgetPasswordEmail = "";
                (this.forgetEmailCode = ["", "", "", "", "", ""]),
                    this.clearTimer();
            }
        },

        //忘记密码填写完邮箱验证码进行下一步
        submitPasswordCode(emailVerifyCode: any) {
            this.forgetEmailValue = emailVerifyCode;
            this.frogetPasswordStep = 3;
            this.clearTimer();
        },

        //改变勾选是否是机器人
        checkRobot() {
            this.isCheckRobot = !this.isCheckRobot;
        },

        //提交账号密码预先登录
        submitPerLogin() {
            if (!this.username || !this.password) {
                message.error("Please enter your password");
                return;
            }
            let data = {
                password: md5(this.password + "abc"),
                userName: this.username,
            };
            Https.axiosPost(Https.httpUrls.preLogin, data).then(
                (rv: any) => {
                    if (rv) {
                        this.userId = rv.userId
                        this.loginType = 'email'
                    }
                }
            );
        },

        changePasswordType(){
            this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
        },

        //邮箱登录提交
        submitEmailLogin(emailVerifyCode: any) {
            let data = {
                email: this.email,
                emailVerifyCode: emailVerifyCode,
                loginType: "EMAIL",
                userId:this.userId
            };
            Https.axiosPost(Https.httpUrls.accountLogin, data).then(
                (rv: any) => {
                    if (rv) {
                        this.createTimer();
                        let token = rv.token;
                        setCookie("token", token);
                        setCookie("userInfo", JSON.stringify(rv));
                        this.turnToHomePage();
                    }
                }
            );
        },

        //修改密码提交
        submitResetPassword() {
            let data = {
                email: this.forgetPasswordEmail,
                emailVerifyCode: this.forgetEmailValue,
                password: md5(this.newPassword + "abc"),
            };
            Https.axiosPost(Https.httpUrls.accountResetPwd, data).then(
                (rv: any) => {
                    if (rv) {
                        message.success("Changing the password successfully");
                        this.changeIsLogin(1);
                    }
                }
            );
        },

        //创建定时器
        createTimer() {
            this.timer = setInterval(() => {
                this.time--;
                if (!this.time) {
                    clearInterval(this.timer);
                }
            }, 1000);
        },

        //清除定时器
        clearTimer() {
            this.time = 60;
            if (this.timer) {
                clearInterval(this.timer);
            }
        },

        //跳转到首页
        turnToHomePage() {
            this.$router.push("/home");
        },

        turnToWindow(url: any) {
            window.open(url);
        },
    },
});
</script>
<style lang="less" scoped>
.login_page {
    width: 100%;
    height: 100%;
    .page_content {
        // position: relative;

        .login_logo {
            position: absolute;
            left: 4rem;
            top: 2.5rem;
            width: 11rem;
        }

        .login_content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 60rem;
            background: #FFFFFF;
            box-shadow: -0.3rem 2rem 5.9rem 0px rgba(200,200,200,0.3);
            border-radius: 1rem;
            padding: 3rem 6rem 6.5rem;
            box-sizing: border-box;

            .login_type_list {
                width: 100%;
                display: flex;

                .login_type_item {
                    text-align: center;
                    font-size: 3.6rem;
                    font-weight: bold;
                    color: #D7D7D7;
                    cursor: pointer;
                    height: 4rem;
                    line-height: 4rem;

                    &.login_active {
                        color: #030303;
                    }
                }
            }

            .login_form_content {
                margin-top: 4rem;

                .login_form_title {
                    font-size: 1.6rem;
                    color: #666666;
                    display: flex;
                    justify-content: space-between;
                    box-sizing: border-box;
                }

                .password_input_block{
                    position: relative;

                    .password_show_icon{
                        position: absolute;
                        font-size: 2.4rem;
                        right: 2rem;
                        top:1.7rem;
                        cursor: pointer;
                    }
                }

                .login_form_input {
                    width: 100%;
                    height: 5rem;
                    margin-top: 1rem;
                    border: 0.1rem solid #DFDFDF;
                    border-radius: 2.5rem;
                    padding-left: 2.1rem;
                    line-height: 5rem;
                    font-size: 1.4rem;
                    box-sizing: border-box;
                    outline: none;
                    

                    &::placeholder {
                        color: #a5b0c2;
                    }
                }
            }

            .email_last_step {
                margin-top: 4rem;

                .email_last_step_block{
                    cursor: pointer;
                }

                .icon--shangyibu {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #030303;
                }

                .email_last_step_content {
                    margin-left: 1rem;
                    font-size: 2.2rem;
                    font-weight: bold;
                    color: #030303;
                }
            }

            .login_submit_button {
                height: 5rem;
                background: #343579;
                border-radius: 2.5rem;
                line-height: 5rem;
                text-align: center;
                font-size: 1.8rem;
                font-weight: 500;
                color: #ffffff;
                cursor: pointer;
            }
            .login_text {
                font-size: 1.6rem;
                margin-top: 4rem;
                color: #151515;
                display: flex;
                justify-content: flex-end;

                .forget_password_text{
                    cursor: pointer;
                }
            }
        }

        .forget_password_content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 60rem;
            background: #FFFFFF;
            box-shadow: -0.3rem 2rem 5.9rem 0px rgba(200,200,200,0.3);
            border-radius: 1rem;
            padding: 3rem 6rem 6.5rem;
            box-sizing: border-box;

            .forget_password_content_block{
                cursor: pointer;
            }

            .icon--shangyibu {
                font-size: 3.8rem;
                font-weight: bold;
                color: #030303;
            }
            .forget_password_content_title {
                font-size: 3.2rem;
                font-weight: bold;
                color: #030303;
                margin-left: 2rem;
            }

            .forget_passored_form_content {
                margin-top: 3.5rem;

                .forget_passored_form_title {
                    font-size: 2.4rem;
                    font-weight: bold;
                    color: #030303;
                    display: flex;
                    justify-content: space-between;
                    box-sizing: border-box;
                }

                .forget_passored_form_input {
                    width: 100%;
                    height: 5rem;
                    margin-top: 1rem;
                    border: 0.1rem solid #DFDFDF;
                    border-radius: 2.5rem;
                    padding-left: 2.1rem;
                    line-height: 5rem;
                    font-size: 1.4rem;
                    box-sizing: border-box;
                    outline: none;

                    &::placeholder {
                        color: #a5b0c2;
                    }
                }
            }

            .forget_verif_code_des {
                font-size: 2.4rem;
                font-weight: bold;
                color: #030303;
                margin-top: 3.5rem;
            }

            .forget_submit_button {
                height: 5rem;
                background: #343579;
                border-radius: 2.5rem;
                line-height: 5rem;
                text-align: center;
                font-size: 1.8rem;
                font-weight: 500;
                color: #ffffff;
                cursor: pointer;
            }
        }
    }

    .login_footer{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-between;
        left: 0;
        bottom: 3.5rem;
        width: 100%;
        padding: 0 4rem;

        .login_footer_item{
            display: flex;
            align-items: center;

            .login_footer_item_text{
                font-size: 1.3rem;
                color: #151515;
            }

            .footer_item_text_pointer{
                cursor: pointer;
            }

            .login_footer_line{
                width: 0.1rem;
                height: 2rem;
                margin: 0 2rem;
                background: #B9B9B9;
            }
        }

    }


    .marign_top20 {
        margin-top: 2rem;
    }

    .marign_top22 {
        margin-top: 2.2rem;
    }

    .marign_top30 {
        margin-top: 3rem;
    }
    .marign_top40 {
        margin-top: 4rem;
    }

    .tip_content {
        font-size: 1.3rem;
        font-weight: bold;
        color: #343579;
        cursor: pointer;
    }

    .email_last_step_des {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 4rem;
        margin-bottom: 2rem;

        .sent_email_content {
            font-size: 1.8rem;
            font-weight: bold;
            color: #a5b0c2;
        }

        .email_tip_content{
            font-size: 1.4rem;
            color: #030303;
        }
    }
}

</style>