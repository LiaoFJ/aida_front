<template>
    <div class="collection_modal_item">
        <div class="switch_type_list">
            <div class="switch_type_item select_swtich">
                <span>Upload</span>
            </div>
             <div @click="openLibrary()" class="switch_type_item">
                <span>My Library</span>
            </div>
            <div class="design_template_button" @click.stop="changeTemplateModal()" v-show="fileList.length>2">Design</div>
        </div>
        
        <div class="moodboard_body">
            <div class="upload_img_body scroll_style" >
                <div class="upload_item">
                    <div class="upload_file_item" v-for="(file, index) in fileList" :key="file">
                        <div class="upload_file_item_content" v-show="file?.status === 'uploading'">
                            <a-spin  :indicator="indicator" tip="Uploading..."/>
                        </div>
                        <div class="upload_file_item_content" v-show="file?.status === 'done'">
                            <img  :src="file?.imgUrl" class="upload_img">
                            <div class="delete_file_block" @click="deleteFile(index)">Delete</div>
                        </div>
                    </div>
                    <div class="upload_file_item upload_component" v-show="fileList.length < 10">
                        <a-upload
                            :action="uploadUrl + '/api/element/upload'"
                            list-type="picture-card"
                            :data="{
                                ...upload
                            }"
                            :headers="{Authorization:token}"
                            v-model:file-list="fileList"
                            :before-upload="beforeUpload"
                            multiple
                            :maxCount="10"
                            accept=".jpg,.png,.jpeg,.bmp"
                            @change="(file)=>fileUploadChange(file)"
                            >
                            <div class="upload_tip_block" v-show="fileList.length < 10">
                               <img class="upload_img_icon" src="@/assets/images/homePage/add_file.png">
                            </div>
                        </a-upload>
                    </div>
                    
                </div>
            </div>
            <div class="upload_max_tip">
                <span class="icon iconfont icon-zhuyi"></span>
                <span>Maximum 10 images can be uploaded, Maximum 2M per image</span>
            </div>
        </div>

        <Material ref="Material" @confirmSelect="confirmSelect"></Material>

        <a-modal class="moodboard_template_modal" 
            v-model:visible="templateModal" 
            :footer="null" 
            width="47rem"
            :maskClosable="false"
            :centered="true"
            :closable="false"
        >
            <div class="moodboard_template_content">
                <div class="moodboard_template_header">
                    <div class="moodboard_template_title">MoodBoard Design</div>
                    <div class="icon iconfont icon-guanbi close_icon" @click.stop="changeTemplateModal()"></div>
                </div>
                <div class="moodboard_template_block">
                    <div class="moodboard_template_info">
                        <MoodTemplate :fileList="this.templateFileList" :moodTemplateId="moodTemplateId"></MoodTemplate>
                        <div class="moodboard_template_refetch_content">
                            <div class="button_second" @click="refetchTemplate()">Re-fetch</div>
                        </div>
                    </div>
                </div>
                <div class="button_second submit_button" @click="submitTemplate()">Submit</div>
            </div>

        
        </a-modal>
    </div>
</template>
<script lang="ts">

import { defineComponent, h,ref } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue';
import {getCookie} from '@/tool/cookie'
import {getUploadUrl} from '@/tool/util'
import {useStore} from 'vuex'
import { message, Upload } from 'ant-design-vue';
import Material from '@/component/HomePage/Material.vue'
import MoodTemplate from '@/component/HomePage/MoodTemplate.vue'
export default defineComponent({
    components:{Material,MoodTemplate},
    setup(){
        let fileList:any = ref([])
        let templateModal:any = ref(false)
        let templateFileList:any = ref([])
        return {
            fileList,
            templateModal,
            templateFileList
        }
    },
    data(){
        return{
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
            moodTemplateId:'',//模板id
            store:useStore()
        }
    },
    mounted(){
        this.token = getCookie('token') || ''
        this.uploadUrl = getUploadUrl()
    },
    methods:{
        openLibrary(){
            let material:any = this.$refs.Material
            material.init('Moodboard')
        },
        fileUploadChange(data:any){
            let file = data.file
            if(file.status === 'done'){
                let res = JSON.parse(file.xhr.response)
                file.imgUrl = res.data.url
                file.resData = res.data
                let fileList = this.fileList.filter((v:any)=> v.status === 'done')
                this.store.commit('setMoodboardFile',fileList)
                this.store.commit('clearMoodTemplateId')
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

        deleteFile(index:any){
            this.fileList.splice(index, 1)
            this.store.commit('setMoodboardFile',this.fileList)
            this.store.commit('clearMoodTemplateId')
        },
        recollection(){
            this.fileList = JSON.parse(JSON.stringify(this.store.state.UploadFilesModule.allBoardData.moodboardFiles))
            let moodTemplateId = this.store.state.UploadFilesModule.allBoardData.moodTemplateId
            this.store.commit('setMoodboardFile',this.fileList)
            this.store.commit('setMoodTemplateId',moodTemplateId)
        },

        confirmSelect(event:any){
            for(let item of event){
                let data = {
                    imgUrl:item.url,
                    resData:item,
                    status:'done',
                }
                if(this.fileList.length == 10){
                    message.error('Maximum number of allowable file uploads has been exceeded')
                    break
                }
                this.fileList.push(data)
            }
            this.store.commit('setMoodboardFile',this.fileList)
            this.store.commit('clearMoodTemplateId')
            
        },

        changeTemplateModal(){
            this.templateModal = !this.templateModal
            if(this.templateModal){
                this.templateFileList  = this.fileList.map((v:any)=>{
                    let data = {
                        ...v,
                        imgUrl:v.imgUrl.replace(/\s/g, encodeURIComponent(' '))
                    }
                    return data
                })
                this.moodTemplateId = this.store.state.UploadFilesModule.moodTemplateId || this.templateFileList.length
            }
        },

        randomRange(min:any, max:any, num:any) { // min最小值，max最大值 num排除的值
            let index = Math.floor(Math.random() * (max - min)) + min;
            while(index === num){
                index = Math.floor(Math.random() * (max - min)) + min;
            }
            return index
            
        },

        //随机重置图片顺序
        refetchTemplate(){
            let arr= Array.from({length:this.templateFileList.length}) 
            for(let item of this.templateFileList){
                let index = this.randomRange(0,this.templateFileList.length,-1)
                while(arr[index]){
                    index = this.randomRange(0,this.templateFileList.length,-1)
                }
                arr[index] = item
            }
            this.templateFileList = arr
        },

        //提交模板
        submitTemplate(){
            this.fileList = JSON.parse(JSON.stringify(this.templateFileList))
            this.store.commit('setMoodboardFile',this.fileList)
            this.store.commit('setMoodTemplateId',this.moodTemplateId)
            this.changeTemplateModal()
        }
    }
})
</script>
<style lang="less" scoped>
.collection_modal_item{
    padding: 1.5rem 2.6rem 4rem;
    height: 100%;

    .switch_type_list{
        display: flex;
        align-items: center;
        position: relative;

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

        .design_template_button{
            background: #E6E6F6;    
            padding: 0 2.7rem;
            font-size: 1.4rem;
            height: 3.2rem;
            line-height: 3.2rem;
            cursor: pointer;
            color: #343579;
            position: absolute;
            right: 0;
            top: 0;
        }
        
    }

    .moodboard_body{
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
            height: 16.5rem;
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
                width: 100%;
                position: relative;

                &:hover .delete_file_block{
                    display: block;
                }

                .upload_img{
                    display: block;
                    height: 100%;
                    width: 100%;
                }

                .delete_file_block{
                    display: none;
                    width: 100%;
                    cursor: pointer;
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
<style lang="less">
.moodboard_template_modal{

    .ant-modal-body{
        padding: 0;
    }
        
    .moodboard_template_content{
        background: #F2F3FB;
        padding-bottom: 2.9rem;

        .moodboard_template_header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem 0 2.5rem;
            height: 6.6rem;

            .moodboard_template_title{
                font-size: 1.8rem;
                font-weight: 500;
                color: #030303;
            }

            .close_icon{
                font-size: 1.8rem;
                color: #AEB2B7;
                cursor: pointer;
            }
        }

        .moodboard_template_block{
            padding: 0 3.1rem 0;

            .moodboard_template_info{
                background: #fff;

                .moodboard_template_refetch_content{
                    padding: 3.1rem 0 2rem;

                    .button_second{
                        margin:  0 auto;
                    }
                }
            }
        }
        .submit_button{
            margin: 2rem auto 0;
        }
    }
}
</style>
