<template>
    <div class="library_page">
        <div class="page_content">
            <img
                class="page_content_bg"
                src="@/assets/images/homePage/bg.png"
            />
            <div class="page_content_body">
                <HeaderComponent></HeaderComponent>
                <div class="library_page_body">
                    <div class="library_body_left">
                        <div class="library_menu_list" v-for="(menu,index) in menuList" :key="menu.title">
                            <div :class="['menu_item', selectCode==menu.code ? 'select_menu_item' :'']"  @click="selectMenuItem(menu,index)">
                                <div class="menu_item_left">
                                    <div :class="['icon','iconfont',menu.icon,'type_icon']"></div>
                                    <div>{{menu.title}}</div>
                                </div>
                                <div v-show="menu.children.length" :class="['icon','iconfont', 'icon-xiala', menu.showChildren?'icon_rotate':'']"></div>
                            </div>
                            <div v-show="menu.showChildren && menu.children.length">
                                <div :class="['menu_item','child_menu_item', selectCode==child.code ? 'select_menu_item' :'']" v-for="child in menu.children" :key="child.title" @click="selectMenuItem(child,index)">
                                    {{child.title}}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div class="library_body_right">
                        <div class="library_right_header">
                            <div class="library_header_left">
                                <div  class="header_operate_item operate_select">
                                    <a-upload
                                        :before-upload="beforeUpload"
                                        :customRequest="selectCode != 'Models' ? customRequest : function(){}"
                                        :multiple="selectCode != 'Models'"
                                        :maxCount="15"
                                        accept=".jpg,.png,.jpeg,.bmp"
                                        @change="fileUploadChange"
                                        >
                                        <div>Upload</div>
                                    </a-upload>
                                </div>
                               
                                
                                <div :class="['header_operate_item',selectImgList.length>0?'operate_select':'']" @click="deleteBatchPic()">Delete</div>
                                <div :class="['header_operate_item',selectImgList.length>0?'operate_select':'']" @click="showRenameModal('','batch')">Rename</div>
                                <div class="content_search_block">
                                    <input class="search_input" placeholder="Search by your style code" v-model="searchPictureName"  @keydown.enter="getLibraryList()">
                                    <div class="search_icon_block" @click="getLibraryList()"><span class="icon iconfont icon-sousuo"></span></div>
                                </div>
                            </div>

                            <div class="librart_headr_right">
                                <div class="select_block" v-show="selectCode == 'Sketchboard' || selectCode == 'MarketingSketch'">
                                    <a-select
                                        ref="select"
                                        v-model:value="designType"
                                        :options="disignTypeList"
                                        @change="handleChange"
                                    >
                                        <template #suffixIcon
                                            ><span
                                                class="icon iconfont icon-xiala"
                                                style="color: #343579"
                                            ></span
                                        ></template>
                                    </a-select>
                                </div>
                            </div>
                        </div>

                        <div class="libray_right_content">
                            <div class="right_content_body">
                                <div class="content_body_header">
                                    <div v-show="imgList.length" :class="['check_all_block',selectImgList.length == imgList.length ? 'check_all' : '']" @click="selectAllImg()">
                                        <div class="check_block"><div class="check_block_body" v-show="selectImgList.length == imgList.length && imgList.length"></div></div>
                                        <div>all</div>
                                    </div>
                                </div>

                                <div class="content_body_table scroll_style">
                                    <div class="content_img_item" v-for="(img,index) in imgList" :key="img.id" @click="selectImgItem(img)">
                                        <div :class="['content_img_item_block', selectImgList.indexOf(img.id) > -1 ? 'select_item_img' :'']">
                                            <img v-lazy="img.url" :key="img.url" :class="['content_img', ['Moodboard','Printboard'].indexOf(selectCode) > -1 ? 'board_content_img' :'']"/>
                                            <div class="img_item_hover">
                                                <div class="img_operate_content">
                                                    <div class="img_operate_block" @click.stop="editPlacementClick(img)" v-show="selectCode === 'Models'">
                                                        <span class="icon iconfont icon-tianxie operate_icon"></span>
                                                    </div>
                                                    <div class="img_operate_block" @click.stop="showRenameModal(img,'single')">
                                                        <span class="icon iconfont icon-zhongmingming operate_icon"></span>
                                                    </div>
                                                    <div class="img_operate_block" @click.stop="deleteSinglePic(img,index)">
                                                        <span class="icon iconfont icon-shanchu operate_icon"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="content_img_name">{{img.name}}</div>
                                    </div>
                                    <div class="no_data_block" v-show="!imgList.length && !isShowMark">
                                        <img src="@/assets/images/homePage/null_img.png">
                                    </div>
                                </div>

                                <div class="table_pagination" v-show="imgList.length">
                                    <a-pagination
                                        
                                        v-model:current="currentPage"
                                        v-model:pageSize="pageSize"
                                        :total="total"
                                        :showQuickJumper="true"
                                        :showSizeChanger="false"
                                        @change="changePage"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <a-modal class="library_rename_modal_component" 
            v-model:visible="renameVisivle" 
            :footer="null" 
            title="Rename Pic"
            width="56rem"
            :maskClosable="false"
            :centered="true"
            @onCancel="closeRenameModal"
        >
            <div class="collection_rename_content">
                <div class="rename_form_content">
                    <input class="rename_form_input" placeholder="Enter a new name" v-model="newPicName" @keydown.enter="confrimRename()">
                </div>
                <div class="rename_button_list">
                    <div class="rename_button_item rename_cancel_button"  @click="closeRenameModal()">Cancel</div>
                    <div class="rename_button_item rename_submit_button"  @click="confrimRename()">Sure</div>
                </div>
            </div>
        </a-modal>

        <ModelPlacement ref="ModelPlacement" @submitModelPlacement="getLibraryList"></ModelPlacement>
        <ModelPlacementMobile ref="ModelPlacementMobile"></ModelPlacementMobile>

        <!-- 蒙层 start-->
        <div class="mark_loading" v-show="isShowMark">
            <a-spin size="large" />
        </div>
        <!-- 蒙层 end-->
    </div>
</template>
<script lang="ts">
import { defineComponent ,ref,createVNode} from 'vue'
import HeaderComponent from "@/component/HomePage/Header.vue";
import ModelPlacement from '@/component/LibraryPage/ModelPlacement.vue';
import ModelPlacementMobile from '@/component/LibraryPage/ModelPlacementMobile.vue';
import { Modal,message,Upload} from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {getUploadUrl,isMoible} from '@/tool/util'
import { Https } from "@/tool/https";
export default defineComponent({
    components: {
        HeaderComponent,
        ModelPlacement,
        ModelPlacementMobile,
    },
    setup() {
        let menuList = ref([
            {title:'Moodboard',code:'Moodboard',icon:'icon-moban',showChildren:false,children:[]},
            {title:'Printboard',code:'Printboard',icon:'icon-dayin-dayinji',showChildren:false,children:[]},
            {title:'Sketchboard',code:'SketchboardFirst',icon:'icon-sumiao',showChildren:false,children:[{title:'Apparel',code:'Sketchboard'}]},
            {title:'Market Sketch',code:'MarketingSketch',icon:'icon-fuwushichang',showChildren:false,children:[]},
            {title:'Mannequin',code:'Models',icon:'icon-mote',showChildren:false,children:[]},

        ])
        let selectImgList:any = ref([])
        let selectCode:any = ref('Moodboard')
        let searchPictureName = ref('')
        let designType:any = ref('Outwear')
        let disignTypeList = [
                {
                    value: "Outwear",
                    label: "Outwear",
                },
                {
                    value: "Blouse",
                    label: "Blouse",
                },
                {
                    value: "Dress",
                    label: "Dress",
                },
                {
                    value: "Trousers",
                    label: "Trousers",
                },
                {
                    value: "Skirt",
                    label: "Skirt",
                },
            ]
        let imgList = ref([])
        let currentPage:any = ref(1)
        let pageSize:any = ref(18)
        let total:any = ref(20)
        let renameVisivle:any = ref(false)
        let renameType:any = ref('single')//修改名字的方式single-单个 batch-批量
        let newPicName:any = ref('')
        let uploadUrl:any = ref('')
        let currentUploadFileNum:any = ref(0) //当次上传文件数量
        let isShowMark:any = ref(false) //蒙层
        let selectSingleImg:any = ref({}) //保存单个图片数据
        return {
            menuList,
            selectImgList,
            selectCode,
            searchPictureName,
            disignTypeList,
            designType,
            imgList,
            currentPage,
            pageSize,
            total,
            renameVisivle,
            renameType,
            newPicName,
            uploadUrl,
            currentUploadFileNum,
            isShowMark,
            selectSingleImg
        }
    },
    mounted(){
        this.uploadUrl = getUploadUrl()
        this.getLibraryList()
    },
    methods:{
        selectMenuItem(menu:any,index:any){
            if(menu.children?.length){ //证明是有子菜单
                menu.showChildren = !menu.showChildren
            }else{
                this.selectCode = menu.code
                this.currentPage = 1,
                this.total = 0,
                this.searchPictureName = ''
                this.imgList = [],
                this.designType = 'Outwear',
                this.selectImgList = []
                this.selectSingleImg = {}
                this.getLibraryList()
            }
        },


        handleChange(){
            this.getLibraryList()
        },

         fileUploadChange(data:any){
            let file = data.file
            // let Cropper:any = this.$refs.Cropper
            if(this.selectCode == 'Models'){
                let reader = new FileReader();
                reader.onload = (e:any) => {
                    let data_new;
                    if (typeof e.target.result === 'object') {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data_new = window.URL.createObjectURL(new Blob([e.target.result]));
                    } else {
                    data_new = e.target.result;
                    }
                    this.placementClick({url:data_new,file:file.originFileObj})
                    
                };
                // 转化为base64
                // reader.readAsDataURL(file)
                // 转化为blob
                reader.readAsArrayBuffer(file.originFileObj);
            }
            
        },

        //改变页码
        changePage(current: number, pageSize: number){
            this.currentPage = current
            this.pageSize = pageSize
            this.getLibraryList()
        },

        //选择图片
        selectImgItem(imgData:any){
            if(this.selectImgList.indexOf(imgData.id) === -1){
                this.selectImgList.push(imgData.id)
            }else{
                let index = this.selectImgList.indexOf(imgData.id)
                this.selectImgList.splice(index,1)
            }
        },

        //选择所有的图片
        selectAllImg(){
            if(this.selectImgList.length == this.imgList.length){
                this.selectImgList = []
            }else{
                this.selectImgList = this.imgList.map((v:any) => v.id)
            }
        },

        closeRenameModal(){
            this.renameVisivle= false;
            this.newPicName = ''
        },

        //确定修改名称
        confrimRename(){
            let data = {
                libraryIds:this.renameType === 'single' ? [this.selectSingleImg.id] : this.selectImgList,
                libraryName:this.newPicName,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,  
            }
             Https.axiosPost(Https.httpUrls.batchUpdateLibraryName, data).then(
                (rv: any) => {
                    if(this.renameType ==='batch'){
                        this.selectImgList = []
                    }
                    this.getLibraryList()
                    this.closeRenameModal() 
                }
            ).catch((res)=>{
                this.closeRenameModal()
            });
        },

        //打开修改名称弹窗
        showRenameModal(data:any,type:any){
            if(type =='batch' && !this.selectImgList.length){ //批量但未选中
                return
            }
            if(type === 'single'){
                this.selectSingleImg = data
            }
            this.renameType = type
            this.renameVisivle = true
        },

        //删除单个图片
        deleteSinglePic(data:any,index:any){
            let _this = this
            Modal.confirm({
                title: 'Are you sure to delete the picture?',
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Yes',
                cancelText: 'No',
                // centered:true,
                onOk() {
                    _this.confirmDeletePic(data,index)
                }
            });
        },

        //批量删除图片
        deleteBatchPic(){
            if(!this.selectImgList.length){
                return
            }
            let _this = this
            Modal.confirm({
                title: 'Are you sure to delete the picture?',
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Yes',
                cancelText: 'No',
                // centered:true,
                onOk() {
                    _this.confirmDeletePic('',0)
                }
            });
        },

        //确定删除图片 有data则是单个
        confirmDeletePic(data:any,index:any){
            let libraryIds = data ? [data.id] : this.selectImgList
            let newData = {
                libraryIds:libraryIds
            }
             Https.axiosPost(Https.httpUrls.batchDeleteLibrary, newData).then(
                (rv: any) => {
                    if(data && data.id){
                        this.imgList.splice(index, 1)
                    }else{
                        this.selectImgList = []
                        this.getLibraryList()
                    }
                }
            ).catch((res)=>{
            });
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
            this.currentUploadFileNum = fileList.length
            return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
        },



        customRequest(event:any){
            let designType = this.selectCode == 'Sketchboard' || this.selectCode == 'MarketingSketch' ? this.designType : ''
            let new_data = {
                file:event.file,
                level1Type:this.selectCode,
                level2Type:designType,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            this.isShowMark = true
            Https.axiosPost(Https.httpUrls.libraryUpload, new_data,{headers:{'Content-Type': 'multipart/form-data'}}).then(
                (rv: any) => {
                    this.currentUploadFileNum -- 
                    if(!this.currentUploadFileNum){
                        this.getLibraryList()
                    }
                    
                }
            ).catch((res)=>{
                this.currentUploadFileNum -- 
                if(!this.currentUploadFileNum){
                    this.getLibraryList()
                }
            });
        },

        getLibraryList(){
            let designType = this.selectCode == 'Sketchboard' || this.selectCode == 'MarketingSketch' ? this.designType : ''
            let data = {
                level1Type:this.selectCode,
                level2Type:designType,
                page:this.currentPage,
                pictureName:this.searchPictureName,
                size:this.pageSize,
            }
            this.isShowMark = true
            Https.axiosPost(Https.httpUrls.queryLibraryPage,data).then(
                (rv: any) => {
                    this.imgList = rv.content
                    this.total = rv.total
                    this.isShowMark = false
                }
            ).catch((res)=>{
                this.isShowMark = false
            });
        },

        //编辑模特打点
        editPlacementClick(data:any){
            let newData = {
                ...data.libraryModelPoint,
                url:data.url,
            }
            this.placementClick(newData)
        },

        //给模特打点编辑
        placementClick(data:any){
            let placementModal:any = isMoible() ? this.$refs.ModelPlacementMobile : this.$refs.ModelPlacement
            placementModal.showPlacementModal(data)
        },

    }
})
</script>
<style lang="less">
.library_page {
    width: 100%;
    height: 100%;

    .page_content {
        position: relative;

        .page_content_bg {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .page_content_body {
            position: absolute;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            
            .library_page_body{
                width: 100%;
                height: calc(100% - 7rem);
                box-sizing: border-box;
                display: flex;

                .library_body_left{
                    width: 23.5rem;
                    height: 100%;
                    background: rgba(255,255,255,0.4);

                    .library_menu_list{

                        .menu_item{
                            width: 100%;
                            height: 6.8rem;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 0 1rem 0 2.5rem;
                            border-left: 0.5rem solid transparent;
                            font-size: 1.8rem;
                            color: #030303;
                            cursor: pointer;
                            
                            &.child_menu_item{
                                padding-left: 6.5rem;
                            }

                            &.select_menu_item{
                                background: #E6E6F6;
                                border-color: #343579;;
                            }

                            .menu_item_left{
                                display: flex;
                                align-items: center;
                                user-select: none;

                                .type_icon{
                                    font-size: 2.2rem;
                                    color: #030303;
                                    margin-right: 1.8rem;
                                }
                            }

                            .icon_rotate{
                                -moz-transform:rotate(180deg);
                                -webkit-transform:rotate(180deg);
                                transform: rotate(180deg);
                                animation-direction: 0.5s;
                            }
                        }

                    }
                }
                .library_body_right{
                    width: calc(100% - 23.5rem);
                    height: 100%;

                    .library_right_header{
                        display: flex;
                        padding: 0 3.5rem 0 2.8rem;
                        align-items: center;
                        justify-content: space-between;
                        background: rgba(255,255,255,0.4);
                        box-shadow: 0 0.2rem 0.8rem 0 rgba(238,238,244,0.25);

                        .library_header_left{
                            height: 8rem;
                            display: flex;
                            align-items: center;

                            .header_operate_item{
                                margin-right: 5rem;
                                color: #C2C2C2;
                                font-size: 1.6rem;

                                .ant-upload-list-text{
                                    display: none;
                                }

                                &.operate_select{
                                    color:#333333;
                                    cursor: pointer;
                                }

                                &:last-child{
                                    margin-right: 11rem;
                                }
                            }

                            .content_search_block{
                                margin-left: 4rem;
                                display: flex;

                                .search_input{
                                    width: 32.8rem;
                                    padding-left: 1.5rem;
                                    height: 4.8rem;
                                    line-height: 4.6rem;
                                    background: #FFFFFF;
                                    border: 0.1rem solid #F1F1F1;
                                    font-size: 1.6rem;
                                    font-weight: 400;

                                    &::placeholder {
                                        color: #C2C2C2;
                                    }
                                }

                                .search_icon_block{
                                    width: 7.2rem;
                                    height: 4.8rem;
                                    line-height: 4.8rem;
                                    text-align: center;
                                    background: #343579;
                                    cursor: pointer;

                                    .icon-sousuo{
                                        font-size: 2rem;
                                        color: #FFFFFF;
                                    }
                                }
                            }
                        }

                        .librart_headr_right{
                            display: flex;
                            align-items: center;

                            .select_block{
                                background: #FFFFFF;
                                color: #1A1A1A !important;

                                .icon-xiala{
                                    color: #1A1A1A !important;
                                }
                            }
                        }
                    }

                    .libray_right_content{
                        width:100%;
                        height:calc(100% - 8rem);
                        padding: 0.1rem 0 0 0.3rem;
                        box-sizing: border-box;

                        .right_content_body{
                            width: 100%;
                            height: 100%;
                            background: rgba(246,246,250,0.4);
                            padding: 0 2rem 5rem 1rem;

                            .content_body_header{
                                height: 7.5rem;
                                display: flex;
                                justify-content: flex-end;
                                align-items: center;

                                .check_all_block{
                                    display: flex;
                                    align-items: center;
                                    font-size: 1.6rem;
                                    color: #64686D;
                                    cursor: pointer;

                                    &.check_all{
                                        color: #1A1A1A;
                                    }

                                    .check_block{
                                        width: 2.4rem;
                                        height: 2.4rem;
                                        background: #EBECF4;
                                        border: 0.1rem solid #64686D;
                                        padding: 0.3rem;
                                        margin-right: 0.7rem;

                                        .check_block_body{
                                            width: 100%;
                                            height: 100%;
                                            background: #343579;
                                        }
                                    }
                                }
                            }

                            .content_body_table{
                                width: 100%;
                                height: calc(100% - 12rem);
                                overflow-y:auto;

                                .content_img_item{
                                    display: inline-block;
                                    vertical-align: top;
                                    padding: 0 1.4rem;
                                    margin-bottom: 2.8rem;

                                    .content_img_item_block{
                                        border: 0.1rem solid transparent;
                                        width: 16.5rem;
                                        height: 16.5rem;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        position: relative;
                                        cursor: pointer;

                                        &.select_item_img{
                                            border-color: #343579;
                                        }

                                        .content_img{
                                            max-width: 100%;
                                            max-height: 100%;
                                        }

                                        .board_content_img{
                                            width: 100%;
                                            height: 100%;
                                        }

                                        &:hover .img_item_hover{
                                            display: block;
                                        }

                                        .img_item_hover{
                                            position: absolute;
                                            width: 100%;
                                            height: 100%;
                                            left: 0;
                                            top:0;
                                            background: rgba(0,0,0,0.2);
                                            display: none;

                                            .img_operate_content{
                                                position: absolute;
                                                right: 0.6rem;
                                                top: 0.6rem;
                                            }

                                            .img_operate_block{
                                                width: 3.6rem;
                                                height: 3.6rem;
                                                background: rgba(0,0,0,0.6);
                                                border-radius: 50%;
                                                text-align: center;
                                                line-height: 3.6rem;
                                                cursor: pointer;
                                                margin-bottom: 0.4rem;

                                                .operate_icon{
                                                    font-size: 1.8rem;
                                                    color: #fff;
                                                }
                                            }
                                        }
                                    }
                                    .content_img_name{
                                        width: 16.5rem;
                                        height: 3.5rem;
                                        line-height: 3.5rem;
                                        white-space: nowrap;
                                        text-align: center;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        font-size: 1.4rem;
                                        color: #030303;
                                    }
                                }

                                .no_data_block{
                                    width: 100%;
                                    height: 100%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                }
                            }

                            .table_pagination{
                                text-align: center;
                                margin-top: 2rem;
                            }
                        }
                    }
                }

            }
        }
        
    }
}

.library_rename_modal_component{

    .collection_rename_content{
        padding:0 6.8rem 1.8rem;


        .rename_form_content{

            .rename_form_input{
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

        .rename_button_list{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 3rem;

            .rename_button_item{
                width: 8.6rem;
                height: 3.2rem;
                line-height: 3.2rem;
                text-align: center;
                font-size: 1.4rem;
                cursor: pointer;
            }

            .rename_cancel_button{
                background: #E4E5EB;
                color: #030303;
                margin-right: 1.8rem;
            }

            .rename_submit_button{
                background: #343579;
                color: #FFFFFF;
            }
        }

        
    }
}
</style>