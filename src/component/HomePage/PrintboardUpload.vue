<template>
    <div class="printboard_upload_modal">
        <div class="printboard_left_upload">
            <div class="left_upload_header">
                <div class="upload_header_item">
                    <div class="switch_type_list">
                        <div class="switch_type_item select_swtich">
                            <span>Upload</span>
                        </div>
                        <div @click="openLibrary()" class="switch_type_item">
                            <span>My Library</span>
                        </div>
                    </div>
                </div>
                <div class="upload_header_item">
                    <div><span class="select_img_num">{{getPinLength}}</span><span class="select_tip">selected</span></div>
                    <div v-show="fileList.length>1 || (moodBoards.length && fileList.length)" class="recollection_button" @click="generatePrint()">Generate</div>
                </div>
            </div>
             <div class="printboard_body">
                <div class="upload_img_body">
                    <div class="upload_item">
                        <div :class="['upload_file_item']" v-for="(file, index) in fileList" :key="file">
                            <div class="upload_file_img_block">
                                <div class="upload_file_item_content" v-show="file?.status === 'uploading'">
                                    <a-spin  :indicator="indicator" tip="Uploading..."/>
                                </div>
                                <div class="upload_file_item_content" @click="selectImg(file)" v-show="file?.status === 'done'">
                                    <img  v-lazy="file.imgUrl" class="upload_img" :key="file.imgUrl">
                                    <div class="delete_file_block" @click.stop="deleteFile(index,file)">Delete</div>
                                </div>
                            </div>
                            <div class="pin_block" v-show="file?.status === 'done'">
                                <a-checkbox v-model:checked="file.pin">PIN</a-checkbox>
                            </div>
                            
                        </div>
                        <div class="upload_file_item upload_component" v-show="fileList.length < 15">
                            <a-upload
                                v-show="fileList.length < 15"
                                :action="uploadUrl + '/api/element/upload'"
                                list-type="picture-card"
                                :before-upload="beforeUpload"
                                :data="{
                                    ...upload
                                }"
                                :headers="{Authorization:token}"
                                v-model:file-list="fileList"
                                :customRequest="function(){}"
                                multiple
                                :maxCount="15"
                                accept=".jpg,.png,.jpeg,.bmp"
                                @change="fileUploadChange"
                                >
                                <div  class="upload_tip_block" >
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
        </div>
        <div class="generate_print">
            <div class="generate_print_header">
                <div class="generate_title">Generate New Print</div>
                <div class="generate_save_button" @click="savePrint()">Save</div>
            </div>
            <div class="generate_print_content_block">
                <div class="generate_print_content scroll_style">
                    <div class="image_block" v-for="(img, index) in printImgList" :key="index">
                        <div class="image_block_content">
                            <img class="image_body" v-lazy="img.imgUrl" :key="img.imgUrl">
                            <div class="delete_file_block" @click="deleteGenerateFile(index)">Delete</div>
                        </div>
                    </div>
                </div>
                <div class="generate_loading_mark" v-show="generateloading">
                    <a-spin size="large" />
                </div>
            </div>
            
        </div>

        <Cropper ref="Cropper" @handleCropperSuccess="handleCropperSuccess" @closeCropper="deletUploadFile()" :cropperFileData="cropperFileData" :isUpload="isUpload"></Cropper>
        <Material ref="Material" @confirmSelect="confirmSelect"></Material>
    </div>
</template>
<script lang="ts">
import { defineComponent,h,ref,computed } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue';
import {getCookie} from '@/tool/cookie'
import {getUploadUrl} from '@/tool/util'
import {useStore} from 'vuex'
import { Https } from "@/tool/https";
import { message,Upload} from 'ant-design-vue';
import Cropper from '@/component/HomePage/Cropper.vue'
import Material from '@/component/HomePage/Material.vue'
export default defineComponent({
    components:{
        Cropper,
        Material
    },
    setup(){
        let store:any =useStore()
        let fileList:any = ref([]),//选中的文件id数据
            printImgList:any = ref([]), //print的印花图片
            moodBoards:any = computed(()=>{return store.state.UploadFilesModule.moodboardFiles})
        return {
            fileList,
            printImgList,
            moodBoards
        }
    },
    computed:{
        getPinLength(){
            let selectLength:any =  0 
            for(let item of this.fileList){
                if(item.pin){
                    selectLength++
                }
            }
            return selectLength
           
        }
    },
    data(){
        return {
            swtich_type:'upload',
            indicator : h(LoadingOutlined, {
                style: {
                    fontSize: '2.4rem',
                },
                spin: true,
            }),
            upload:{
                isPin:0,
                level1Type:'Printboard',
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            token:'',
            uploadUrl:'',
            store:useStore(),
            cropperFileData:{name:'',uid:''}, //裁剪的原始文件数据
            currentFileNum:0, //当前上传的文件数
            isUpload:false,
            generateloading:false,

        }
    },
    mounted(){
        this.token = getCookie('token') || ''
        this.uploadUrl = getUploadUrl()
    },
     methods:{
        openLibrary(){
            let material:any = this.$refs.Material
            material.init('Printboard')
        },
        fileUploadChange(data:any){
            let file = data.file
            let Cropper:any = this.$refs.Cropper
            if(this.currentFileNum === 1){
                var reader = new FileReader();
                reader.onload = (e:any) => {
                    let data_new;
                    if (typeof e.target.result === 'object') {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data_new = window.URL.createObjectURL(new Blob([e.target.result]));
                    } else {
                    data_new = e.target.result;
                    }
                    Cropper.getOptionImg(data_new)
                };
                // 转化为base64
                // reader.readAsDataURL(file)
                // 转化为blob
                reader.readAsArrayBuffer(file.originFileObj);
                this.cropperFileData = file
                Cropper.changeShowModal(true)
                
            }else{
                this.customRequest(file)
            }
        },

        beforeUpload(file:any,fileList:any){
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/bmp';
            if (!isJpgOrPng) {
                message.error('You can only upload Image file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 5MB!');
            }
            if(isJpgOrPng && isLt2M){
                this.currentFileNum = fileList.length
            }else{
                return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
            }
            
        },

        deleteFile(index:any,file:any){
            this.fileList.splice(index, 1)
            this.store.commit('setPrintboardFile',this.fileList)
        },

        deleteGenerateFile(index:any){
            this.printImgList.splice(index, 1)
            this.store.commit('setGeneratePrintFile',this.printImgList)    
        },
        
        randomRange(min:any, max:any, num:any) { // min最小值，max最大值 num排除的值
            let index = Math.floor(Math.random() * (max - min)) + min;
            while(index === num){
                index = Math.floor(Math.random() * (max - min)) + min;
            }
            return index
            
        },

        generatePrint(){
            let data:any = {}
            //随机获取图片id
            if(!this.moodBoards.length){ //mood没有图片
                let index1 = -1
                let index2 = -2
                if(!this.getPinLength){ //没pin住
                    index1 = this.randomRange(0, this.fileList.length, -1)
                    index2 = this.randomRange(0, this.fileList.length, index1)
                   
                }else if(this.getPinLength === 1){ //pin住1个
                    this.fileList.forEach((element:any,index:number) => {
                        if(element.pin){
                            index1 = index
                        }
                    });
                    index2 = this.randomRange(0, this.fileList.length, index1)
                }else{      //pin住多个
                    let selectIndexList:any = []
                    this.fileList.forEach((element:any,index:number) => {
                        if(element.pin){
                            selectIndexList.push(index)
                        }
                    });
                    index1 = this.randomRange(0, selectIndexList.length, -1) //pin住的中随机选一个
                    index2 = this.randomRange(0, this.fileList.length, selectIndexList[index1]) //除了选中的外再来一个
                    
                }
                data = {
                    select1Id:this.fileList[index1].id,
                    select2Id:this.fileList[index2].id
                }
            }else{
                let index1 = this.randomRange(0, this.moodBoards.length, -1)
                let index2 = -2
                if(!this.getPinLength){ //没pin住
                    index2 = this.randomRange(0, this.fileList.length, -1)
                }else if(this.getPinLength === 1){ //pin住1个
                    this.fileList.forEach((element:any,index:number) => {
                        if(element.pin){
                            index2 = index
                        }
                    });
                }else{      //pin住多个
                    let selectIndexList:any = []
                    this.fileList.forEach((element:any,index:number) => {
                        if(element.pin){
                            selectIndexList.push(index)
                        }
                    });
                    index2 = this.randomRange(0, selectIndexList.length, -1) //pin住的中随机选一个
                }
                data = {
                    select1Id:this.moodBoards[index1].resData.id,
                    select2Id:this.fileList[index2].id
                }
            }
            data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
            this.generateloading = true
            Https.axiosPost(Https.httpUrls.elementGeneratePrint, data).then((rv) =>{
                if(rv){
                    let data = {
                        imgUrl:rv.url,
                        resData:rv
                    }
                    this.printImgList.push(data)
                    this.store.commit('setGeneratePrintFile',this.printImgList)
                    this.generateloading = false
                }
            }).catch(res=>{
                this.generateloading = false
            })

        },

        savePrint(){
            let printId = this.printImgList.map((v:any) => v.resData.id)
            let data = {
                printId:printId,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            Https.axiosPost(Https.httpUrls.elementSavePrint, data).then((rv) =>{
                if(rv){
                    message.success('Save successfully')
                }
            })
        },

        
        customRequest(data:any){
            let new_data = {
                ...this.upload,
                file:data.originFileObj
            }
            let fileUid = data.uid
            Https.axiosPost('/api/element/upload', new_data,{headers:{'Content-Type': 'multipart/form-data'}}).then(
                (rv: any) => {
                    if (rv) {
                        for(let file of this.fileList){
                            if(fileUid === file.uid){
                                file.status = 'done'
                                file.imgUrl = rv.url
                                file.pin = false
                                file.id = rv.id
                                file.resData = rv

                            }
                        }
                        let fileList = this.fileList.filter((v:any)=> v.status === 'done')
                        this.store.commit('setPrintboardFile',fileList)
                    }
                }
            ).catch((res)=>{
                let index = -1
                this.fileList.forEach((ele:any,index1:any) => {
                    if(fileUid === ele.uid){
                        index = index1
                    }
                });
                if(index > -1){
                    this.fileList.splice(index, 1)
                }
            });
        },

        closeCropper(type:any){
            if(this.isUpload){
                return
            }
            if(type == 'error'){
                let index = -1
                this.fileList.forEach((ele:any,index1:any) => {
                    if(this.cropperFileData.uid === ele.uid){
                        index = index1
                    }
                });
                if(index > -1){
                    this.fileList.splice(index, 1)
                }
            }
            let Cropper:any = this.$refs.Cropper
            Cropper.closeCropper()

        },

        deletUploadFile(){
            let index = -1
            this.fileList.forEach((ele:any,index1:any) => {
                if(this.cropperFileData.uid === ele.uid){
                    index = index1
                }
            });
            if(index > -1){
                this.fileList.splice(index, 1)
            }
        },


        handleCropperSuccess(event:any){
            let {file, fileData} =event
            let new_data = {
                ...this.upload,
                file:file
            }
            if(this.isUpload){
                return
            }
            this.isUpload = true
            const hide = message.loading('loading', 0);
            Https.axiosPost('/api/element/upload', new_data,{headers:{'Content-Type': 'multipart/form-data'}}).then(
                (rv: any) => {
                    for(let file of this.fileList){
                        if(fileData.uid === file.uid){
                            file.status = 'done'
                            file.imgUrl = rv.url
                            file.id = rv.id
                            file.resData = rv
                        }
                    }
                    let fileList = this.fileList.filter((v:any)=> v.status === 'done')
                    this.isUpload = false
                    this.closeCropper('success')
                    this.cropperFileData = {name:'',uid:''}
                    this.store.commit('setPrintboardFile',fileList)
                    hide()
                }
            ).catch(res=>{
                let index = -1
                this.fileList.forEach((ele:any,index1:any) => {
                    if(fileData.uid === ele.uid){
                        index = index1
                    }
                });
                if(index > -1){
                    this.fileList.splice(index, 1)
                }
                this.cropperFileData = {name:'',uid:''}
                this.isUpload = false
                this.closeCropper('error')
                hide()
            });
        },

        recollection(){
            this.fileList = JSON.parse(JSON.stringify(this.store.state.UploadFilesModule.allBoardData.printboardFiles))
            this.printImgList = JSON.parse(JSON.stringify(this.store.state.UploadFilesModule.allBoardData.generatePrintFiles))
            this.store.commit('setPrintboardFile',this.fileList)
            this.store.commit('setGeneratePrintFile',this.printImgList)
        },

        confirmSelect(event:any){
            for(let item of event){
                let data = {
                    imgUrl:item.url,
                    resData:item,
                    pin:false,
                    id:item.id,
                    status:'done',
                }
                if(this.fileList.length == 15){
                    message.error('Maximum number of allowable file uploads has been exceeded')
                    break
                }
                this.fileList.push(data)
            }
            this.store.commit('setPrintboardFile',this.fileList)
            
        }

     }

})
</script>
<style lang="less" scoped>
.printboard_upload_modal{
    padding: 1rem 1rem 1.8rem 1rem;
    height: 100%;
    background: #F2F3FB;
    display: flex;
    justify-content: space-between;

    .printboard_left_upload{
        width: calc(100% - 39.8rem);
        height: 100%;
        background: #fff;
        padding: 0.5rem 2.2rem 2rem 2.6rem;
        box-sizing: border-box;
        
        .left_upload_header{
            display: flex;
            justify-content: space-between;

            .upload_header_item{
                display: flex;
                align-items: center;

                 .switch_type_list{
                    display: flex;
                    align-items: center;

                    .switch_type_item{
                        display: flex;
                        align-items: center;
                        padding: 0 2rem;
                        height: 4rem;
                        background: #fff;
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

                .select_img_num{
                    font-size: 2rem;
                    color: #030303;
                    font-weight: bold;
                }

                .select_tip{
                    font-size: 1.6rem;
                    margin-left: 0.9rem;
                    color: #B7B7B7;
                }

                .recollection_button{
                    padding: 0 1rem;
                    height: 3.2rem;
                    line-height: 3.2rem;
                    background: #E6E6F6;
                    font-size: 1.2rem;
                    color: #343579;
                    margin-left: 0.9rem;
                    cursor: pointer;
                }
                
            }

            
        }

        .printboard_body{
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
                vertical-align: top;

                .upload_file_img_block{
                    width: 16.5rem;
                    height: 16.5rem;
                    border: 1px solid #F5F5F5;
                }

                .pin_block{
                    text-align: center;
                    margin-top:1.6rem;
                }

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
                    cursor: pointer;
                    

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

    .generate_print{
        width: 38.4rem;
        height: 100%;
        background: #fff;

        .generate_print_header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1rem 2.5rem 2.5rem;

            .generate_title{
                font-size: 1.6rem;
                font-weight: bold;
                color: #030303;
            }
            .generate_save_button{
                background: #E6E6F6;
                padding: 0.1rem;
                padding: 0 2.7rem;
                font-size: 1.4rem;
                height: 3.2rem;
                line-height: 3.2rem;
                cursor: pointer;
                color: #343579;

            }
        }

        .generate_print_content_block{
            height: calc(100% - 6.7rem);
            position: relative;

            .generate_loading_mark{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.4);
                z-index: 2;
            }

            .generate_print_content{
                overflow-y: auto;
                height: 100%;
                padding:0 0.8rem;
                position: relative;

                

                .image_block{
                    display: inline-block;
                    margin-right: 1.6rem;
                    margin-bottom: 1.6rem;
                    width: 16.5rem;
                    height: 16.5rem;
                    border: 0.1rem solid #F5F5F5;
                    vertical-align: top;

                    &:nth-child(2n){
                        margin-right: 0;
                    }

                    .image_block_content{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                        position: relative;

                        &:hover .delete_file_block{
                            display: block;
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
                            cursor: pointer;
                        }
                    }

                    .image_body{
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
            }
        }

        
    }
}


</style>
