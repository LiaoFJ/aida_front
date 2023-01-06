<template>
    <div class="sketchboard_upload_modal">
        <div class="switch_type_list">
            <div class="switch_type_item select_swtich">
                <span>Upload</span>
            </div>
             <div @click="openLibrary()" class="switch_type_item">
                <span>My Library</span>
            </div>
        </div>

         <div class="sketchboard_body">
            <div class="upload_img_body scroll_style">
                <div class="upload_item">
                    <div class="upload_file_item" v-for="(file,index) in fileList" :key="file">
                        <div class="upload_file_item_content" v-show="file?.status === 'uploading'">
                            <a-spin  :indicator="indicator" tip="Uploading..."/>
                        </div>
                        <div class="upload_file_item_content" v-show="file?.status === 'done'">
                            <img  :src="file?.imgUrl" class="upload_img">
                            <div class="operate_file_block" >
                                <!-- <div class="delete_file_block" @click="deleteFile(index)">Delete</div> -->
                                <div class="select_img_type">
                                    <div class="select_category" @click.stop="showFileCategory(file)">
                                        {{getSketchLabel(file.category)}}
                                         <div :class="['icon','iconfont', 'icon-xiala', file.categoryShow?'icon_rotate':'']"></div>
                                    </div>
                                    <div class="category_list" v-show="file.categoryShow">
                                        <div :class="['category_item', file.category == cate.value?'select_category_item':'']"  v-for="(cate,index) in sketchCatecoryList" :key="index" @click="selectFileCategory(file,cate)">{{cate.label}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="delete_file_block" @click="deleteFile(index)">
                                <span class="icon iconfont icon-shanchu"></span>
                            </div>
                        </div>
                        <div class="pin_block" v-show="file?.status === 'done'">
                            <a-checkbox v-model:checked="file.pin">PIN</a-checkbox>
                        </div>
                    </div>
                    <div class="upload_file_item upload_component" v-show="fileList.length < 15">
                        <a-upload
                            :action="uploadUrl + '/api/element/upload'"
                            list-type="picture-card"
                            :data="{
                                ...upload
                            }"
                            :before-upload="beforeUpload"
                            :headers="{Authorization:token}"
                            v-model:file-list="fileList"
                            multiple
                            :maxCount="15"
                            accept=".jpg,.png,.jpeg,.bmp"
                            @change="(file)=>fileUploadChange(file)"
                            >
                            <div  class="upload_tip_block" v-show="fileList.length < 15">
                                <img class="upload_img_icon" src="@/assets/images/homePage/add_file.png">
                            </div>
                        </a-upload>
                    </div>
                </div>
            </div>
             <div class="upload_max_tip">
                <span class="icon iconfont icon-zhuyi"></span>
                <span>Maximum 15 images can be uploaded, Maximum 2M per image</span>
            </div>
        </div>

        <Material ref="Material" @confirmSelect="confirmSelect"></Material>


    </div>
</template>
<script lang="ts">
import { defineComponent, h,ref } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue';
import {getCookie} from '@/tool/cookie'
import {getUploadUrl} from '@/tool/util'
import {useStore} from 'vuex'
import { message,Upload} from 'ant-design-vue';
import Material from '@/component/HomePage/Material.vue'
export default defineComponent({
    components:{Material},
    setup(){
        let fileList:any = ref([])
        return {
            fileList
        }
    },
    data(){
        return{
            swtich_type:'upload',
             indicator : h(LoadingOutlined, {
                style: {
                    fontSize: '2.4rem',
                },
                spin: true,
            }),
            upload:{
                isPin:0,
                level1Type:'Sketchboard',
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            token:'',
            uploadUrl:'',
            store:useStore(),
            sketchCatecoryList:[
                {
                    value: 'Outwear',
                    label: "Outwear",
                },
                {
                    value: 'Blouse',
                    label: "Blouse",
                },
                {
                    value: 'Dress',
                    label: "Dress",
                },
                {
                    value: 'Trousers',
                    label: "Trousers",
                },
                {
                    value: 'Skirt',
                    label: "Skirt",
                },
            ],
        }
    },
    computed:{
        getSketchLabel(value){
           return (value:any)=>{
                let lable = '';
                for(let item of this.sketchCatecoryList){
                    if(item.value === value){
                        lable = item.label
                        break
                    }
                }
                return lable
           }
        }
    },
    mounted(){
        this.token = getCookie('token') || ''
        this.uploadUrl = getUploadUrl()
    },
    methods:{
        openLibrary(){
            let material:any = this.$refs.Material
                material.init('Sketchboard')
        },
        fileUploadChange(data:any){
            let file = data.file
            if(file.status === 'done'){
                let res = JSON.parse(file.xhr.response)
                file.imgUrl = res.data.url
                file.resData = res.data
                file.pin = false
                file.category = 'Outwear'
                file.categoryShow = false
                let fileList = this.fileList.filter((v:any)=> v.status === 'done')
                this.store.commit('setSketchboardFile',fileList)
            }else if(file.status ===  'error'){
                let index = -1
                this.fileList.forEach((ele:any,index1:any) => {
                    if(file.uid === ele.uid){
                        index = index1
                    }
                });
                if(index > -1){
                    this.fileList.splice(index, 1)
                }
                message.error(file.name + 'upload failed')
            }
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

        showFileCategory(file:any){
            file.categoryShow = true
            document.addEventListener('click', this.hiddenFileCategory)
        },

        selectFileCategory(file:any,cate:any){
            file.category = cate.value
            this.store.commit('setSketchboardFile',this.fileList)
        },

        hiddenFileCategory(){
            for(let item of this.fileList){
                item.categoryShow = false
            }
            document.removeEventListener('click', this.hiddenFileCategory)
        },

        deleteFile(index:any){
            this.fileList.splice(index, 1)
            this.store.commit('setSketchboardFile',this.fileList)
        },

        recollection(){
            this.fileList = JSON.parse(JSON.stringify(this.store.state.UploadFilesModule.allBoardData.skecthboardFiles))
            this.store.commit('setSketchboardFile',this.fileList)
        },

        confirmSelect(event:any){
            for(let item of event){
                let data = {
                    imgUrl:item.url,
                    resData:item,
                    pin:false,
                    status:'done',
                    category:item.level2Type || 'Outwear',
                    categoryShow:false,
                }
                if(this.fileList.length == 15){
                    message.error('Maximum number of allowable file uploads has been exceeded')
                    break
                }
                this.fileList.push(data)
            }
            this.store.commit('setSketchboardFile',this.fileList)
            
        }
    }
})
</script>
<style lang="less" scoped>
.sketchboard_upload_modal{
    padding: 1.5rem 2.6rem 4rem;
    height: 100%;

    .switch_type_list{
        display: flex;
        align-items: center;

        .switch_type_item{
            display: flex;
            align-items: center;
            padding: 0 2rem;
            height: 4rem;
            background: #fff;
            border-radius: 0.8rem;
            line-height: 4rem;
            font-size: 1.6rem;
            margin-right: 2.2rem;
            color: #5B5E69;
            cursor: pointer;

            &.select_swtich{
                color: #343579;
            }

            .switch_icon{
                font-size: 1.8rem;
                margin-right: 0.8rem;
            }
        }
        
    }

    .sketchboard_body{
        margin-top: 1rem;
        height: calc(100% - 5rem);

        .upload_img_body{
            height: calc(100% - 3rem);
            overflow-y: auto;
            margin-bottom: 1rem;
        }

        .upload_file_item{
            margin: 0 2rem 2rem 0;
            display: inline-block;
            width: 16.5rem;
            border: 1px solid #F5F5F5;
            vertical-align: top;

            &.upload_component{
                border: none;
            }

            .upload_file_item_content{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                height: 16.5rem;
                position: relative;
                cursor: pointer;

                .upload_img{
                    display: block;
                    max-height: 100%;
                    max-width: 100%;
                }

                .delete_file_block{
                    display: none;
                    width: 3.2rem;
                    height: 3.2rem;
                    background: rgba(0,0,0,0.6);
                    border-radius: 0.4rem;
                    position: absolute;
                    top: 0.9rem;
                    right: 0.9rem;
                    text-align: center;
                    line-height: 3.2rem;

                    .icon-shanchu{
                        font-size: 1.6rem;
                        color: #fff;
                    }
                }

                &:hover .delete_file_block{
                    display: block;
                }

                .operate_file_block{
                    width: 100%;
                    height: 4rem;
                    font-size: 1.6rem;
                    color: #FFFFFF;
                    position: absolute;
                    left: 0;
                    bottom: 0;

                    .select_img_type{
                        height: 100%;
                        line-height: 4rem;
                        text-align: center;
                        background: rgba(0,0,0,0.6);
                        position: relative;

                        .select_category{
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            .icon-xiala{
                                margin-left: 0.8rem;
                            }
                        }

                        .icon_rotate{
                            -moz-transform:rotate(180deg);
                            -webkit-transform:rotate(180deg);
                            transform: rotate(180deg);
                            animation-direction: 0.5s;
                        }

                        .category_list{
                            position: absolute;
                            width: 100%;
                            cursor: pointer;
                            position: absolute;
                            top: 4.1rem;
                            left: 0;
                            background: rgba(0,0,0,0.4);
                            border: 1px solid #343579;
                            border-radius: 0.8rem;
                            overflow: hidden;
                            z-index: 2;

                            .category_item{
                                text-align: left;
                                font-size: 1.4rem;
                                padding: 1rem 1.9rem;
                                line-height: 1.6rem;

                                &.select_category_item{
                                    background: linear-gradient(160deg, #AC2A3B, #292161);
                                }

                                &:hover{
                                    background: linear-gradient(160deg, #AC2A3B, #292161);
                                }
                            }
                        }
                    }
                }
            }
            .pin_block{
                text-align: center;
                margin-top:1.6rem;
            }

            .upload_img_icon{
                width: 4.6rem;
            }
        }

        .upload_max_tip{
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            color: #030303;

            .icon-zhuyi{
                font-size: 1.6rem;
                margin-right: 0.7rem;
            }
        }
    }
}
</style>
