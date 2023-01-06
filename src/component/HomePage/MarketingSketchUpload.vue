<template>
    <div class="collection_modal_item">
        <div class="switch_type_list">
            <div class="switch_type_item select_swtich">
                <span>Upload</span>
            </div>
             <div @click="openLibrary()" class="switch_type_item">
                <span>My Library</span>
            </div>
        </div>
        
        <div class="marketingUpload_body" v-show="swtich_type==='upload'">
            <div class="upload_img_body scroll_style">
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
                            <div class="upload_tip_block" v-show="fileList.length < 15">
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
                level1Type:'MarketingSketch',
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
        openLibrary(){
            let material:any = this.$refs.Material
                material.init('MarketingSketch')
        },
        fileUploadChange(data:any){
            let file = data.file
            if(file.status === 'done'){
                let res = JSON.parse(file.xhr.response)
                file.imgUrl = res.data.url
                file.resData = res.data
                let fileList = this.fileList.filter((v:any)=> v.status === 'done')
                this.store.commit('setMarketingSketchFile',fileList)
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
            this.store.commit('setMarketingSketchFile',this.fileList)
        },

        recollection(){
            this.fileList = JSON.parse(JSON.stringify(this.store.state.UploadFilesModule.allBoardData.marketingSketchFiles))
            this.store.commit('setMarketingSketchFile',this.fileList)
        },

         confirmSelect(event:any){
            for(let item of event){
                let data = {
                    imgUrl:item.url,
                    resData:item,
                    status:'done',
                }
                if(this.fileList.length == 15){
                    message.error('Maximum number of allowable file uploads has been exceeded')
                    break
                }
                this.fileList.push(data)
            }
            this.store.commit('setMarketingSketchFile',this.fileList)
            
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

    .marketingUpload_body{
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
                    max-height: 100%;
                    max-width: 100%;
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
