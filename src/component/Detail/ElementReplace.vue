<template>
    <div>
        <a-modal class="element_replace_modal" 
            v-model:visible="elementReplaceShow" 
            :footer="null" 
            width="80%"
            :maskClosable="false"
            :centered="true"
        >
            <template #closeIcon>
                <div class="close_icon" @click.stop="closeModal()"><span class="icon iconfont icon-guanbi"></span></div>
            </template>
            
            <div class="element_replace_content">
                <div class="element_replace_content_left">
                    <div class="content_left_block">
                        <div class="content_left_block_header">New {{swtich_type}}</div>
                        <div class="content_left_block_body">
                            <div class="content_body_img_block">
                                <img class="element_img"  :src="clothesData?.path">
                                <div class="upload_block">
                                    <a-upload
                                        :action="uploadUrl + '/api/element/upload'"
                                        :data="{
                                            ...upload,
                                            level1Type:clothesData?.level1Type
                                        }"
                                        :headers="{Authorization:token}"
                                        :before-upload="beforeUpload"
                                        :maxCount="1"
                                        accept=".jpg,.png,.jpeg,.bmp"
                                        @change="(file)=>fileUploadChange(file,'top')"
                                        :showUploadList="false"
                                        >
                                        <div  class="upload_icon_block">
                                            <span class="icon iconfont icon-tianjiatupian_huaban"></span>
                                        </div>
                                    </a-upload>
                                </div>
                                <div class="operate_file_block">
                                    <div class="select_category" @click.stop="showNewTopOperate()">
                                        {{clothesData?.type}}
                                        <div :class="['icon','iconfont', 'icon-xiala', newTopOperateShow?'icon_rotate':'']"></div>
                                    </div>
                                    <div class="category_list" v-show="newTopOperateShow">
                                        <div :class="['category_item', clothesData?.type == cate.value?'select_category_item':'']"  v-for="(cate,index) in sketchCatecoryList" :key="index" @click="selectNewTopOperate(cate)">{{cate.label}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="content_left_block">
                        <div class="content_left_block_header">
                            <div>New Print</div>
                            <div class="placement_button" @click="placementClick()" v-show="clothesData?.printObject?.path && clothesData?.printObject?.path != 'none'">Placement</div>
                        </div>
                        <div class="content_left_block_body">
                            <div class="content_body_img_block">
                                <img class="element_img print_element_img"  :src="clothesData?.printObject?.path" v-if="clothesData?.printObject?.path && clothesData?.printObject?.path != 'none'">
                                <img  class="element_null_img" src="@/assets/images/homePage/null_img.png" v-else />
                                <div class="upload_block">
                                    <a-upload
                                        :action="uploadUrl + '/api/element/upload'"
                                        :data="{
                                            ...upload,
                                            level1Type:clothesData?.printObject?.level1Type || Printboard
                                        }"
                                        :headers="{Authorization:token}"
                                        :before-upload="beforeUpload"
                                        :maxCount="1"
                                        accept=".jpg,.png,.jpeg,.bmp"
                                        @change="(file)=>fileUploadChange(file,'print')"
                                        :showUploadList="false"
                                        >
                                        <div  class="upload_icon_block">
                                            <span class="icon iconfont icon-tianjiatupian_huaban"></span>
                                        </div>
                                    </a-upload>
                                </div>
                                <div class="delete_file_block" @click="deletePrintFile()">
                                    <span class="icon iconfont icon-shanchu"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="content_left_block">
                        <div class="content_left_block_header content_color_block_header">Edit Color</div>
                        <div class="content_left_block_body content_color_block_body">
                            <div class="review_color_block" :style="{background:`rgb(${modifyColor.r},${modifyColor.g},${modifyColor.b})`}"></div>
                            <div class="setting_color_block">
                                <div class="setting_color_content">
                                    <Chrome class="chrome_color" v-model="selectColor"></Chrome>
                                    <Slider class="sileder_color" v-model="selectColor"></Slider>
                                </div>
                                <div class="color_rgb_block">
                                    <div class="rgb_item">R:{{getSelectRGB(selectColor).r}}</div>
                                    <div class="rgb_item">G:{{getSelectRGB(selectColor).g}}</div>
                                    <div class="rgb_item">B:{{getSelectRGB(selectColor).b}}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="submit_button" @click="submitElement()">Submit</div>
                </div>

                <div class="element_replace_content_right">
                    <div class="content_right_header"><div class="content_right_header_content">Select from library</div></div>

                    <div class="content_right_search_block">
                        <input class="search_input" placeholder="Search by your style code" v-model="searchPictureName" @keydown.enter="getLibraryList()">
                        <div class="search_icon_block" @click="getLibraryList()"><span class="icon iconfont icon-sousuo"></span></div>
                    </div>
                    
                    <div class="content_right_table_block">
                        <div class="table_block_header">
                            <div class="table_block_header_left">
                                <div v-show="['Outwear','Dress','Blouse'].indexOf(clothesData.type) > -1" @click="select_type('Top')" :class="['switch_type_item', swtich_type === 'Top' ? 'select_swtich' : '']">
                                    <span>Top</span>
                                </div>
                                <div v-show="['Skirt','Trousers'].indexOf(clothesData.type) > -1"  @click="select_type('Bottom')" :class="['switch_type_item', swtich_type === 'Bottom' ? 'select_swtich' : '']">
                                    <span>Bottom</span>
                                </div>
                                <div @click="select_type('Print')" :class="['switch_type_item', swtich_type === 'Print' ? 'select_swtich' : '']">
                                    <span>Print</span>
                                </div>
                            </div>
                            <div class="table_header_select_block select_block" v-show="swtich_type != 'Print'">
                                <a-select
                                    ref="select"
                                    placeholder="All"
                                    v-model:value="designType"
                                    :allowClear="true"
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

                        <div class="table_img_list scroll_style">
                            <div class="table_img_item_block" v-for="img in imgList" :key="img" @click="selectImgItem(img)">
                                <div class="img_item_block">
                                    <img :class="[swtich_type === 'Print'?'print_img_body':'img_item_body']"  v-lazy="img.url" :key="img.url">
                                </div>
                                <div class="img_item_name">{{img.name}}</div>
                            </div>
                            <div class="no_data_block" v-show="!imgList.length && !isShowLoading">
                                <img src="@/assets/images/homePage/null_img.png">
                            </div>
                            <div class="no_data_block" v-show="isShowLoading">
                                <a-spin size="large"></a-spin>
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
    
        </a-modal>
        <PlacementModal ref="PlacementModal" @submitPlacement="submitPlacement"></PlacementModal>
        <PlacementModalMobile ref="PlacementModalMobile" @submitPlacement="submitPlacement"></PlacementModalMobile>
    </div>
     
</template>
<script lang="ts">
import { defineComponent,ref } from 'vue'
import {getCookie} from '@/tool/cookie'
import {getUploadUrl,isMoible} from '@/tool/util'
import { message, Upload } from 'ant-design-vue';
import { Chrome,Slider } from '@ans1998/vue3-color'
import PlacementModal from '@/component/Detail/PlacementModal.vue'
import PlacementModalMobile from '@/component/Detail/PlacementModalMobile.vue'
import { Https } from "@/tool/https";
import { useStore } from "vuex";
export default defineComponent({
    components:{Chrome,Slider,PlacementModal,PlacementModalMobile},
    setup(){
        const store = useStore();
        let selectColor:any = ref({rgba:{}}) //顔色选择器默认颜色
        let clothesData:any = ref({})
        let disignTypeList:any = ref([])
        return {
            store,
            selectColor,
            clothesData,
            disignTypeList
        }
    },
    data(){
        return{
            elementReplaceShow:false,
            newTopOperateShow:false,
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
            upload:{
                isPin:0,
                level1Type:'Moodboard',
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            token:'',
            uploadUrl:'',
            modifyColor:{r:255,g:255,b:255},
            designType:null,
            swtich_type:'Top',
            imgList:[], //图片列表
            currentPage:1, //当前页码
            pageSize:20,
            total:0,//图片总数
            clothesIndex:0, //该元素在列表中的索引
            isShowLoading:false,
            searchPictureName:'',//搜索图片的名称
        }
    },
    watch:{
        selectColor(newVal:any,oldVal:any){
            this.modifyColor = newVal.rgba || {}
        }
    },
    computed:{
        getSelectRGB(selectColor){
            return (selectColor:any)=>{
                let rgba = selectColor.rgba
                let data = {
                    r:rgba?.r || 255,
                    g:rgba?.g || 255,
                    b:rgba?.b || 255
                }
                return data
            }
        },
    },
    mounted(){
        this.token = getCookie('token') || ''
        this.uploadUrl = getUploadUrl()
    },
    methods:{
        select_type(type:string){
            this.imgList = []
            this.currentPage = 1
            this.searchPictureName = ''
            this.designType = null
            this.swtich_type = type
            this.getLibraryList()
        },
         showNewTopOperate(){
            this.newTopOperateShow = !this.newTopOperateShow 
            document.addEventListener('click', this.hiddenNewTopOperate)
        },

        selectNewTopOperate(cate:any){
            this.clothesData.type = cate.value
        },

        hiddenNewTopOperate(){
            this.newTopOperateShow = false
            document.removeEventListener('click', this.hiddenNewTopOperate)
        },

        fileUploadChange(data:any,type:any){
            let file = data.file
            if(file.status === 'done'){
                let res = JSON.parse(file.xhr.response)
                if(type === 'top'){
                    this.clothesData.path = res.data.url
                    this.clothesData.type = 'Outwear'
                }else if(type === 'print'){
                    this.clothesData.printObject.path = res.data.url
                    this.clothesData.printObject.location = []
                }
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


        //改变页码
        changePage(current: number, pageSize: number){
            this.currentPage = current
            this.pageSize = pageSize
            this.getLibraryList()
        },

        handleChange(){
            this.getLibraryList()
        },

        showelementReplaceModal(data:any){
            this.clothesData =  JSON.parse(JSON.stringify(data.clothes))
            this.clothesIndex = data.index
            this.elementReplaceShow = true
            let color = this.clothesData.color.split(' ')
            this.selectColor = {rgba:{r:color[0],g:color[1],b:color[2]}}
            let topList = ['Outwear','Dress','Blouse']
            if(topList.indexOf(this.clothesData.type) > -1){
                this.swtich_type = 'Top'
                this.disignTypeList = [{
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
                }]
            }else{
                this.swtich_type = 'Bottom'
                this.disignTypeList = [{
                    value: "Trousers",
                    label: "Trousers",
                },
                {
                    value: "Skirt",
                    label: "Skirt",
                },]
            }
            this.getLibraryList()
        },

        //关闭弹窗
        closeModal(){
            this.elementReplaceShow = false
            this.swtich_type = 'Top'
            this.clothesData = {}
            this.clothesIndex = 0
        },

        //提交元素
        submitElement(){
            this.clothesData.color = `${this.modifyColor.r} ${this.modifyColor.g} ${this.modifyColor.b}`
            let data = {
                clothes:this.clothesData,
                index:this.clothesIndex
            }
            this.store.commit('setDesignItemColthes',data)
            this.closeModal()
        },

        //删除print的图片
        deletePrintFile(){
            this.clothesData.printObject.path = ''
        },

        placementClick(){
            let placementModal:any = isMoible() ? this.$refs.PlacementModalMobile : this.$refs.PlacementModal
            let data = {
                clothesData:this.clothesData,
                index:this.clothesIndex
            }
            placementModal.showPlacementModal(data)
        },


        //placement提交
        submitPlacement(e:any){
            this.clothesData.printObject = e
        },

        getLibraryList(){
            let data = {
                level2Type:this.designType,
                page:this.currentPage,
                pictureName:this.searchPictureName,
                size:this.pageSize,
                type:this.swtich_type
            }
            this.isShowLoading = true
            Https.axiosPost(Https.httpUrls.queryLibraryTopAndBottomPage,data).then(
                (rv: any) => {
                    this.imgList = rv.content
                    this.total = rv.total
                    this.isShowLoading = false
                }
            ).catch((res)=>{
                this.isShowLoading = false
            });
        },

        //选择库里的图片
        selectImgItem(img:any){
            if(this.swtich_type != 'Print'){
                this.clothesData.path = img.url
            }else{
                this.clothesData.printObject.path = img.url
            }
        }

    }
})
</script>
<style lang="less">
.element_replace_modal{

    .ant-modal-close{
        width: 3.6rem;
        height: 3.6rem;
        position: absolute;
        top: -1.8rem;
        right: -1.8rem;
    }

    .ant-modal-header{
        display: none;
    }

    .ant-modal-body{
        background: #F2F3FB;
        height: 80vh;
        min-height: 72rem;
        overflow-y: hidden;
        padding: 0;
    }

    .close_icon{
        width: 3.6rem;
        height: 3.6rem;
        background: #000000;
        border-radius: 50%;
        line-height: 3.6rem;
        text-align: center;

        .icon-guanbi{
            font-size: 2rem;
            color: #ffffff;
        }
    }

    .element_replace_content{
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 1.5rem 1rem 2rem;
        box-sizing: border-box;

        .element_replace_content_left{
            width: 36.4rem;
            height: 100%;

            .content_left_block{
                width: 100%;
                background: #FFFFFF;
                padding: 0 2rem;
                margin-bottom: 1rem;

                .content_left_block_header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 5rem;
                    font-size: 1.6rem;
                    color: #030303;

                    &.content_color_block_header{
                        height: 3.7rem;
                    }

                    .placement_button{
                        padding: 0 0.9rem;
                        height: 3.2rem;
                        line-height: 3.2rem;
                        background: #E6E6F6;
                        font-size: 1.2rem;
                        color: #343579;
                        cursor: pointer;
                    }
                }
                 .content_left_block_body{
                    width: 100%;

                    &.content_color_block_body{
                        padding:0 1.5rem 1.5rem;
                        display: flex;
                        justify-content: space-between;
                    }

                    .content_body_img_block{
                        width: 20rem;
                        height: 15.8rem;
                        background: #FFFFFF;
                        border: 0.1rem solid #F5F5F5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin:0 auto;
                        position: relative;


                        .element_img{
                            max-width: 100%;
                            max-height: 100%;

                            &.print_element_img{
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .element_null_img{
                            width: 50%;
                        }

                        .operate_file_block{
                            display: none;
                            width: 100%;
                            height: 3.2rem;
                            line-height: 3.2rem;
                            font-size: 1.6rem;
                            color: #FFFFFF;
                            position: absolute;
                            left: 0;
                            bottom: 0;
                            background: rgba(0,0,0,0.6);
                            text-align: center;
                            cursor: pointer;
                            
                
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
                                top: 3.3rem;
                                left: 0;
                                background: #FFFFFF;
                                border: 0.1rem solid #000000;
                                box-shadow: 0 0.4rem 0.4rem 0 rgba(0,0,0,0.1);
                                overflow: hidden;
                                z-index: 2;
                                color: #4D4D4D;

                                .category_item{
                                    text-align: center;
                                    font-size: 1.4rem;
                                    height: 3.5rem;
                                    line-height:3.5rem;

                                    &.select_category_item{
                                        background: #F7F7F7;
                                    }

                                    &:hover{
                                       background: #F7F7F7;
                                    }
                                }
                            }
                        }

                        .upload_block{
                            display: none;
                            width: 3.6rem;
                            height: 3.6rem;
                            position: absolute;
                            top: 1.1rem;
                            right: 0.9rem;
                            border-radius: 50%;

                            .upload_icon_block{
                                width: 3.6rem;
                                height: 3.6rem;
                                background: rgba(0,0,0,0.6);
                                border-radius: 50%;
                                text-align: center;
                                line-height: 3.6rem;
                                cursor: pointer;

                                .icon-tianjiatupian_huaban{
                                    font-size: 1.8rem;
                                    color: #fff;
                                }
                            }
                        }
                        
                        
                        .delete_file_block{
                            display: none;
                            width: 3.6rem;
                            height: 3.6rem;
                            background: rgba(0,0,0,0.6);
                            border-radius: 50%;
                            position: absolute;
                            top: 1.1rem;
                            right: 5.5rem;
                            text-align: center;
                            line-height: 3.6rem;
                            cursor: pointer;

                            .icon-shanchu{
                                font-size: 1.8rem;
                                color: #fff;
                            }
                        }

                        &:hover .delete_file_block, &:hover .operate_file_block,  &:hover .upload_block{
                            display: block;
                        }
                    }

                    .review_color_block{
                        width: 11.5rem;
                        height: 11.5rem;
                        border: 0.1rem solid #343579;
                    }

                    .setting_color_block{

                        .setting_color_content{

                            .vc-chrome-body{
                                display: none;
                            }
                            .chrome_color{
                                width: 11.5rem;
                                height: 11.5rem;
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
                                width: 1.6rem;

                                .vc-slider-swatches{
                                    display:none
                                }
                                .vc-slider-hue-warp {
                                    width: 11.5rem;
                                    height: 1.6rem;
                                    border-radius: 0.8rem;
                                    overflow: hidden;

                                    .vc-hue-picker{
                                        width: 1.2rem;
                                        height: 1.2rem;
                                        border-radius: 50%;
                                        transform: translate(-0.6rem, -0.4rem);
                                                    
                                    }
                                }
                                .vc-hue-pointer{
                                    top: 0.5rem !important;
                                }
                                
                            }
                        }

                        .color_rgb_block{
                            margin-top: 0.5rem;
                            display: flex;
                            justify-content: space-between;
                            font-size: 1.4rem;
                            color: #343579;
                        }
                    }
                }
            }

            .submit_button{
                width: 9.8rem;
                height: 3.6rem;
                text-align: center;
                background: #343579;
                font-size: 1.4rem;
                line-height: 3.6rem;
                color: #FFFFFF;
                margin: 1.8rem auto 0;
                cursor: pointer;
            }
        }

        .element_replace_content_right{
            width: calc(100% - 37rem);
            height: 100%;
            background: #FFFFFF;

            .content_right_header{
                padding: 1.8rem 2.2rem 2.2rem;
                font-size: 1.6rem;
                color: #030303;

                .content_right_header_content{
                    height: 1.7rem;
                }
            }

            .content_right_search_block{
                padding: 0 2.2rem;
                display: flex;

                .search_input{
                    width: 50.3rem;
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

            

            .content_right_table_block{
                height: calc(100%  - 10.5rem);

                .table_block_header{
                    display: flex;
                    justify-content: space-between;
                    padding: 1.7rem 1.7rem 0 2.3rem;
                    border-bottom: 0.1rem solid #EBEBEC;

                    .table_block_header_left{
                        display: flex;
                        align-items: center;

                        .switch_type_item{
                            height: 4.2rem;
                            width: 6rem;
                            text-align: center;
                            line-height: 4.2rem;
                            line-height: 4rem;
                            font-size: 1.6rem;
                            margin-right: 3rem;
                            border-bottom: 0.2rem solid transparent;
                            color: #343579;
                            cursor: pointer;

                            &.select_swtich{
                                color: #343579;
                                border-bottom: 0.2rem solid #343579;
                            }
                        }
                        
                    }
                    

                    .select_block {

                        .ant-select-selector{
                            min-width: 8rem;
                        }

                        .icon-xiala{
                            color: #1A1A1A !important;
                        }
                    }
                }

                .table_img_list{
                    padding: 2rem 0 0 2.3rem;
                    height: calc(100%  - 13rem);
                    overflow-y: auto;

                    .table_img_item_block{
                        display: inline-block;
                        vertical-align: top;
                        margin:0 1.6rem 3rem 0;
                        cursor: pointer;

                        .img_item_block{
                            width: 16.5rem;
                            height: 16.5rem;
                            border: 0.1rem solid #343579;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            .print_img_body{
                                width: 100%;
                                height: 100%;
                            }

                            .img_item_body{
                                max-width: 100%;
                                max-height: 100%;
                            }
                        }

                        .img_item_name{
                            white-space: nowrap;
                            overflow:hidden;
                            text-overflow: ellipsis;
                            font-size: 1.4rem;
                            color: #343579;
                            text-align: center;
                            width: 16.5rem;
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
</style>
