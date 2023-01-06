<template>
    <div class="colorboard_upload_modal">
        <div class="colorboard_upload_left">
            <div class="upload_left_header">
                <span class="color_list icon iconfont icon-diaosebanpalette3"></span>
                <span>My Color Palette</span>
            </div>
            <div class="upload_left_content scroll_style">
                <div class="upload_color_block" v-for="(color,index) in colorList" :key="color">
                    <div @click="selectColorItem(index,color)" :class="['upload_color',selectIndex === index ? 'select_upload_color' : '']" :style="{background:`rgb(${color?.r},${color?.g},${color?.b})`}"></div>
                </div>
            </div>
        </div>
        <div class="colorboard_upload_right">
            <div class="upload_right_content">
                <div class="right_content_line">
                    <div class="upload_right_header">
                        <span class="color_edit icon iconfont icon-yansefangan"></span>
                        <span>Choose Color</span>
                    </div>
                    <div class="color_setting_block">
                        <Chrome class="chrome_color" v-model="selectColor"></Chrome>
                        <Slider class="sileder_color" v-model="selectColor"></Slider>
                        <div class="color_rgb_block">
                            <div class="rgb_item">R:{{getSelectRGB(selectColor).r}}</div>
                            <div class="rgb_item">G:{{getSelectRGB(selectColor).g}}</div>
                            <div class="rgb_item">B:{{getSelectRGB(selectColor).b}}</div>
                        </div>
                        
                    </div>

                    <div class="color_review_block">
                        <div class="color_review_content" :style="{background: reviewColor?.r || reviewColor?.r===0 ?`rgb(${reviewColor?.r},${reviewColor?.g},${reviewColor?.b})` : 'none'}"></div>
                        <div class="pantong_name" v-show="pantongName">{{pantongName}}</div>
                        <div class="clear_button" @click="clearCurrentColor()">Clear</div>
                    </div>
                   
                </div>

                <div class="right_content_line">
                    <div class="upload_right_header">
                        <span class="color_edit icon iconfont icon-yansefangan"></span>
                        <span>Upload Color</span>
                    </div>
                    <div class="upload_item">
                        <div class="upload_file_item" v-for="(file) in fileList" :key="file">
                            <div class="upload_file_item_content" v-show="file.status !== 'done'">
                                <a-spin  :indicator="indicator" tip="Uploading..."/>
                            </div>
                            <div class="upload_file_item_content"  v-show="file.status === 'done'">
                                <img  :src="file?.imgUrl" class="upload_img" ref="colorImage">
                                <div class="delete_file_block" @click="deleteFile(index)">Delete</div>
                            </div>
                        </div>
                        <a-upload
                            v-show="fileList.length < 1"
                            list-type="picture-card"
                            :customRequest="function(){}"
                            @change="fileUploadChange"
                            :before-upload="beforeUpload"
                            accept=".jpg,.png,.jpeg,.bmp"
                            >
                            <div  class="upload_tip_block">
                                <img class="upload_img_icon" src="@/assets/images/homePage/add_file.png">
                            </div>
                        </a-upload>
                    </div>
                    
                    <div class="upload_right_header">
                        <span class="color_edit icon iconfont icon-yansefangan"></span>
                        <span>Key in Color Code</span>
                    </div>
                    <div class="get_color_block">
                        <input class="get_color_input" placeholder="tcx value (e.g.: 19-4052)" v-model="tcxColor" @keydown.enter="getTcxColor()"/>
                        <div class="get_color_button" @click="getTcxColor()">
                            <span class="icon iconfont icon-huoquduixiang"></span>
                            <span class="get_color_des">Extract Color</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Chrome,Slider } from '@ans1998/vue3-color'
import { Https } from "@/tool/https";
import { defineComponent, h,ref } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue';
import {getCookie} from '@/tool/cookie'
import {getUploadUrl,rgbToHsv} from '@/tool/util'
import {useStore} from 'vuex'
import ColorThief from '@/tool/colorthief/colorthief'
import { message,Upload} from 'ant-design-vue';
export default defineComponent({
    components:{
        Chrome,
        Slider
    },
    setup(){
        let fileList:any = ref([])
        let colorList:any = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
        let selectColor:any = ref({rgba:{}}) //顔色选择器默认颜色
        return {
            fileList,
            colorList,
            selectColor,
        }
    },
    watch:{
        selectColor(newVal:any,oldVal:any){
            this.reviewColor = newVal.rgba || {}
            this.colorList[this.selectIndex] = newVal.rgba
            let colorList =this.colorList.filter((v:any) => v && Object.keys(v).length)
            this.setColorboardList(colorList)
        }
    },
    computed:{
        getSelectRGB(selectColor){
            return (selectColor:any)=>{
                let rgba = selectColor.rgba
                let data = {
                    r:rgba?.r || rgba?.r===0 ? rgba?.r  : 255,
                    g:rgba?.g || rgba?.g===0 ? rgba?.g  : 255,
                    b:rgba?.b || rgba?.b===0 ? rgba?.b  : 255,
                }
                return data
            }
        },
    },
    data(){
        return{
            
            reviewColor:{}, //预览的颜色
            selectIndex:0,//选中的文件索引
            tcxColor:'',
            pantongName:'',//潘通值
            indicator : h(LoadingOutlined, {
                style: {
                    fontSize: '2.4rem',
                },
                spin: true,
            }),
            upload:{
                isPin:0,
                level1Type:'Moodboard',
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            token:'',
            uploadUrl:'',
            store:useStore()
        }
    },
    mounted(){
        this.token = getCookie('token') || ''
        this.uploadUrl = getUploadUrl()
    },
    methods:{
        //选择不同的色块
        selectColorItem(index:any,color:any){
            this.selectIndex = index
            this.reviewColor = color?.r  + ''? {r:color.r,g:color.g ,b:color.b } : {}
            this.selectColor = color?.r + ''? {rgba:{r:color.r,g:color.g,b:color.b,a:1}} : {}
            this.fileList = []
            this.tcxColor = ''
            this.pantongName = ''
        },

        //通过tcx获取颜色
        getTcxColor(){
            if(!this.tcxColor){
                return
            }
            Https.axiosGet(Https.httpUrls.getRgbByTcx + '?tcx=' + this.tcxColor).then((rv) =>{
                if(rv && rv.name){
                    this.reviewColor = {r:rv.r, g:rv.g, b:rv.b}
                    this.colorList[this.selectIndex] =  {r:rv.r, g:rv.g, b:rv.b}
                    this.pantongName = rv.name
                    let colorList =this.colorList.filter((v:any) => Object.keys(v).length)
                    this.setColorboardList(colorList)
                }else{
                    message.error("Can't find the TCX color")
                }
            })
        },

        //清除当前的颜色
        clearCurrentColor(){
            this.selectColor = {}
            this.fileList = []
            this.pantongName = ''
            this.tcxColor = ''
        },

        fileUploadChange(data:any){
            let file = data.file
            let fileData = file.originFileObj
            var reader = new FileReader();
            reader.onload = (e:any) => {
                let data_new;
                if (typeof e.target.result === 'object') {
                // 把Array Buffer转化为blob 如果是base64不需要
                    data_new = window.URL.createObjectURL(new Blob([e.target.result]));
                } else {
                    data_new = e.target.result;
                }
                file.imgUrl = data_new
                file.status = 'done'
                this.fileList.push(file)

                setTimeout(()=>{
                    const colorThief = new ColorThief();
                    let colorImage:any = this.$refs.colorImage
                    let domImg:any = colorImage[0];
                    let color = colorThief.getColor(domImg)
                    this.getHsvColor(color)
                    this.reviewColor = {r:color[0],g:color[1],b:color[2]}
                    this.selectColor = {rgba:{r:color[0],g:color[1],b:color[2],a:1}}
                },100)
            };
            // 转化为base64S
            reader.readAsDataURL(fileData)
        },

        beforeUpload(file:any){
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/bmp';
            if (!isJpgOrPng) {
                message.error('You can only upload Image file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 5MB!');
            }
            return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
        },

        deleteFile(index:any){
            this.fileList.splice(index, 1)
        },

        //通过HSV获取颜色
        getHsvColor(color:any){
            let hsv = rgbToHsv(color)
            this.pantongName = ''
            Https.axiosGet(Https.httpUrls.getRgbByHsv + `?h=${hsv[0]}&s=${hsv[0]}&v=${hsv[1]}`).then((rv) =>{
                if(rv){
                    this.pantongName = rv.name
                }
            })
        },

        setColorboardList(colorList:any){
            let  newColorList = colorList.map((v:any)=>{
                let data = {
                    id:'',
                    name:'',
                    rgbValue:v
                }
                return data
            })
            this.store.commit('setColorboardList',newColorList)

        },

        recollection(){
            let colorList = this.store.state.UploadFilesModule.allBoardData.colorBoards
            colorList.forEach((ele:any, index:number) => {
                this.colorList[index] = ele.rgbValue
            });
            this.reviewColor = this.colorList[0]
            this.selectColor = {rgba:this.colorList[0]}, //顔色选择器默认颜色
            this.store.commit('setColorboardList',colorList)
        }

    }
})
</script>
<style lang="less">
.colorboard_upload_modal{
    padding: 1rem 1rem 1.8rem 1rem;
    height: 100%;
    background: #F2F3FB;
    display: flex;
    justify-content: space-between;

    .colorboard_upload_left{
        width: calc(100% - 48rem);
        height: 100%;
        background: #FFFFFF;

        .upload_left_header{
            padding: 1.4rem 2rem 1.6rem;
            font-size: 1.6rem;
            color: #333333;
            font-weight: bold;
            display: flex;
            align-items: center;
            line-height: 2.4rem;
            
            .color_list{
                font-size: 2.2rem;
                margin-right: 0.7rem;
            }
        }

        .upload_left_content{
            padding: 1rem 1.6rem;
            height: calc(100% - 5.4rem);
            overflow-y: auto;

            .upload_color_block{
                padding: 0 0.4rem;
                margin-bottom: 2.6rem;
                display: inline-block;
                vertical-align: top;

                .upload_color{
                    width: 11.5rem;
                    height: 11.5rem;
                    border: 0.1rem solid #DCDCEC;
                    cursor: pointer;
                }

                .select_upload_color{
                    border-color: #343579;
                }
            }
        }
    }

    .colorboard_upload_right{
        width: 47rem;
        height: 100%;
        background: #FFFFFF; 

        .upload_right_header{
            padding: 0.4rem 0 1.6rem 0;
            font-weight: bold;
            line-height: 2.4rem;
            font-size: 1.6rem;
            color: #333333;
            display: flex;
            align-items: center;

            .color_edit{
                font-size: 2.4rem;
                margin-right: 0.7rem;
            }

        }

        .upload_right_content{
            padding: 1rem 2.8rem;
            height: calc(100% - 5.4rem);
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;

            .right_content_line{
                margin-bottom: 2.3rem;

                .color_review_block{
                    margin-right: 4rem;

                    .color_review_content{
                        width: 16.5rem;
                        height: 16.5rem;
                        background: #FFFFFF;
                        border: 0.1rem solid #DCDCEC;
                    }

                    .pantong_name{
                        margin-top: 1rem;
                        font-size: 1.6rem;
                        font-weight: 400;
                        color: #030303;
                        text-align: left;
                        font-weight: bold;
                    }

                    .clear_button{
                        padding:  0 2.8rem;
                        height: 3.2rem;
                        line-height: 3.2rem;
                        background: #EFEEFF;
                        font-size: 1.2rem;
                        font-family: Roboto;
                        color: #343579;
                        display: inline-block;
                        margin-top: 1rem;
                        cursor: pointer;
                    }
                }

                .upload_file_item{
                    margin: 0 2rem 2rem 0;
                    display: inline-block;
                    width: 16.5rem;
                    height: 16.5rem;
                    border: 1px solid #F5F5F5;
                    vertical-align: top;

                     .upload_file_item_content{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        width: 100%;
                        position: relative;
                        cursor: pointer;

                        &:hover .delete_file_block{
                            display: block;
                        }

                        .upload_img{
                            display: block;
                            max-height: 100%;
                            max-width: 100%;
                        }

                        .delete_file_block{
                            display: none;
                            width: 100%;
                            height: 4rem;
                            background: rgba(0,0,0,0.2);
                            font-size: 1.6rem;
                            color: #FFFFFF;
                            line-height: 4rem;
                            text-align: center;
                            position: absolute;
                            left: 0;
                            bottom: 0;
                        }
                    }
                }

                .upload_img_icon{
                    width: 4.6rem;
                }

                .color_setting_block{
                    width: 16.5rem;
                    margin-right: 4rem;
                    margin-bottom: 7rem;
                    .vc-chrome-body{
                        display: none;
                    }
                    .chrome_color{
                        width: 16.5rem;
                        height: 16.5rem;
                        overflow: hidden;

                        .vc-chrome-saturation-wrap{
                            height: 100%;
                        }
                        .vc-chrome-saturation-wrap .vc-saturation-circle{
                            width: 1rem;
                            height: 1rem;
                        }
                    }

                    .sileder_color{
                        margin-top:1.3rem;

                        .vc-slider-swatches{
                            display:none
                        }
                        .vc-slider-hue-warp {
                            width: 16.5rem;
                            height: 2.4rem;
                            border-radius: 1.2rem;
                            overflow: hidden;

                            .vc-hue-picker{
                                width: 1.4rem;
                                height: 1.4rem;
                                border-radius: 50%;
                                transform: translate(-0.7rem, -0.2rem);
                            }
                        }
                        .vc-hue-pointer{
                            top: 0.5rem !important;
                        }
                        
                    }

                    .color_rgb_block{
                        margin-top: 1rem;
                        display: flex;
                        justify-content: space-between;
                        font-size: 1.6rem;
                        color: #343579;
                    }
                }

                .get_color_block{
                    
                    .get_color_input{
                        width: 19.4rem;
                        height: 3.8rem;
                        background: #FFFFFF;
                        border: 0.1rem solid #DCDCEC;
                        padding: 1rem 1.3rem;
                        box-sizing: border-box;
                        font-size: 1.4rem;
                        text-align: left;

                        &::placeholder {
                            color: #B7B7B7;
                        }
                    }
                    
                    .get_color_button{
                        margin-top: 1.5rem;
                        padding: 0 2.2rem;
                        height: 3.2rem;
                        background: #EFEEFF;
                        display: inline-block;
                        line-height: 3rem;
                        font-size: 1.2rem;
                        color: #343579;
                        vertical-align: middle;
                        cursor: pointer;

                        .icon-huoquduixiang{
                            margin-right: 0.5rem;
                            font-size: 2rem;
                            color:#343579;
                            vertical-align: middle;
                        }

                        .get_color_des{
                            vertical-align: middle;
                        }
                    }
                }
            }

            .upload_item{
                margin-bottom: 11.6rem;
            }
        }
    }
}
</style>
