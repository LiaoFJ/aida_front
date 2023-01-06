<template>
    <div>
        <a-modal class="my_material_modal" 
            v-model:visible="myMaterialModalShow" 
            :footer="null" 
            width="80%"
            :maskClosable="false"
            :centered="true"
        >
            <div class="my_material_header">
                <div class="my_material_title">My Library</div>
                <div class="my_material_header_right">
                    <div class="content_search_block">
                        <input class="search_input" placeholder="Please input" v-model="searchPictureName"  @keydown.enter="getLibraryList()">
                        <div class="search_icon_block" @click="getLibraryList()"><span class="icon iconfont icon-sousuo"></span></div>
                    </div>

                    <div class="icon iconfont icon-guanbi icon_close" @click="closeModal"></div>
                </div>
            </div>

            <div class="my_material_content">
                <div class="material_content_top">
                    <div class="material_content_top_title"></div>
                    <div class="material_content_top_right">
                        <div class="select_block" v-show="selectCode == 'Sketchboard' || selectCode == 'MarketingSketch'">
                            <a-select
                                ref="select"
                                v-model:value="designType"
                                :options="disignTypeList"
                                placeholder="All"
                                :allowClear="true"
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
                        <div :class="['check_all_block',selectImgList.length == imgList.length ? 'check_all' : '']" @click="selectAllImg()"  v-show="imgList.length">
                            <div class="check_block"><div class="check_block_body" v-show="selectImgList.length == imgList.length && imgList.length"></div></div>
                            <div>all</div>
                        </div>
                    </div>
                </div>
                <div class="material_content_body scroll_style">
                    <div class="content_img_item" v-for="(img) in imgList" :key="img.id" @click="selectImgItem(img)">
                        <div :class="['content_img_item_block', selectImgListIds.indexOf(img.id) > -1 ? 'select_item_img' :'']">
                            <img :class="[selectCode == 'Moodboard' || selectCode == 'Printboard' ? 'print_content_img' : 'content_img']" v-lazy="img.url" :key="img.url"/>
                        </div>
                        <div class="content_img_name">{{img.name}}</div>
                    </div>
                    <div class="no_data_block" v-show="!imgList.length && !isShowLoading">
                        <img src="@/assets/images/homePage/null_img.png">
                    </div>
                </div>
                <div class="no_data_block loading_block" v-show="isShowLoading">
                    <a-spin size="large"></a-spin>
                </div>
                <div class="material_confirm" @click="confirmSelect()"  v-show="imgList.length">Confirm</div>
                <div class="table_pagination" v-show="imgList.length">
                    <a-pagination
                        
                        v-model:current="currentPage"
                        v-model:pageSize="pageSize"
                        :total="total"
                        :showSizeChanger="false"
                        :showQuickJumper="true"
                        @change="changePage"
                    />
                </div>
            </div>
        </a-modal>
    </div>
    
</template>
<script lang="ts">
import { defineComponent, ref} from 'vue'
import { Https } from "@/tool/https";
import { message } from 'ant-design-vue';
export default defineComponent({
    setup() {
        let myMaterialModalShow = ref(false)
        let imgList = ref([])
        let selectImgList:any = ref([])
        let selectImgListIds:any = ref([])
        let isShowLoading:any = ref(false)
        let selectCode:any = ref('')
        let currentPage:any = ref(1)
        let searchPictureName = ref('')
        let pageSize = ref(20)
        let total = ref(0)
        let searcMaterialhName:any = ref('') //搜索名字
        let designType:any = ref(null)
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
        let boardList = {
            Moodboard:'Mood',
            Printboard:'Print',
            Sketchboard:'Sketch',
            MarketingSketch:'MarketingSketch'
        }
        return{
            myMaterialModalShow,
            imgList,
            selectImgList,
            selectImgListIds,
            isShowLoading,
            selectCode,
            currentPage,
            searchPictureName,
            pageSize,
            total,
            searcMaterialhName,
            designType,
            disignTypeList,
            boardList
        }
    },
    methods:{

        init(code:any){
            this.selectCode = code
            this.myMaterialModalShow = true
            this.getLibraryList()
        },
        
        selectImgItem(imgData:any){
            this.selectImgListIds =  this.selectImgList.map((v:any)=>v.id)
            if(this.selectImgListIds.indexOf(imgData.id) === -1){
                this.selectImgList.push(imgData)
                this.selectImgListIds.push(imgData.id)
            }else{
                let index = this.selectImgListIds.indexOf(imgData.id)
                this.selectImgList.splice(index,1)
                this.selectImgListIds.splice(index,1)
            }
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

        //选择所有的图片
        selectAllImg(){
            if(this.selectImgListIds.length == this.imgList.length){
                this.selectImgListIds = []
                this.selectImgList = []
            }else{
                this.selectImgListIds = this.imgList.map((v:any) => v.id)
                this.selectImgList = this.imgList
            }
        },

        getLibraryList(){
            let data = {
                level1Type:this.selectCode,
                level2Type:this.designType,
                page:this.currentPage,
                pictureName:this.searchPictureName,
                size:this.pageSize,
            }
            this.isShowLoading = true
            Https.axiosPost(Https.httpUrls.queryLibraryPage,data).then(
                (rv: any) => {
                    this.imgList = rv.content
                    this.total = rv.total
                    this.isShowLoading = false
                }
            ).catch((res)=>{
                this.isShowLoading = false
            });
        },

        confirmSelect(){
            if(!this.selectImgList.length){
                message.error('Please select at least one image')
                return
            }
            this.$emit('confirmSelect',this.selectImgList)
            this.closeModal()
        },

        closeModal(){
            this.myMaterialModalShow = false
            this.searchPictureName = ''
            this.designType = null
            this.selectImgList = []
            this.selectImgListIds = []
            this.imgList = []
            this.currentPage = 1
            this.pageSize = 10
            this.total = 0
        }
    }
})
</script>
<style lang="less">
.my_material_modal{

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

    .my_material_header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 6.6rem;
        background: #F7F7F7;
        padding: 0 3.4rem 0 3.1rem;

        .my_material_title{
            font-size: 1.8rem;
            color: #030303;
            font-weight: 500;
        }

        .my_material_header_right{
            display: flex;
            justify-content: space-between;
            align-items: center;

            .content_search_block{
                margin-right: 5rem;
                display: flex;

                .search_input{
                    width: 30rem;
                    padding-left: 1.5rem;
                    height: 4rem;
                    line-height: 3.8rem;
                    background: #FFFFFF;
                    border: 0.1rem solid #F1F1F1;
                    font-size: 1.6rem;
                    font-weight: 400;

                    &::placeholder {
                        color: #C2C2C2;
                    }
                }

                .search_icon_block{
                    width: 6rem;
                    height: 4rem;
                    line-height: 4rem;
                    text-align: center;
                    background: #343579;
                    cursor: pointer;

                    .icon-sousuo{
                        font-size: 2rem;
                        color: #FFFFFF;
                    }
                }
            }

            .icon_close{
                color: rgba(174, 178, 183, 1);
                font-size: 2.4rem;
                cursor: pointer;
            }
        }

        
    }

    .my_material_content{
        padding: 0 3rem 3.5rem 3rem;
        height: calc(100% - 6.6rem);
        position: relative;

        .material_content_top{
            padding: 1.3rem 0 2.1rem;
            height: 7rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;

            .material_content_top_title{
                font-size: 20px;
                color: #030303;
            }

            .material_content_top_right{
                display: flex;
                align-items: center;

                .select_block{
                    background: #FFFFFF;
                    color: #1A1A1A !important;
                    margin-right: 2.3rem;

                    .icon-xiala{
                        color: #1A1A1A !important;
                    }
                }

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

        }

        .material_content_body{
            width: 100%;
            height: calc(100% - 19rem);
            overflow-y: auto;
            position: relative;

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

                    .print_content_img{
                        width: 100%;
                        height: 100%;
                    }

                    .content_img{
                        max-width: 100%;
                        max-height: 100%;
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

            
        }

        .no_data_block{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 99;

            &.loading_block{
                background: rgba(0,0,0,0.2);
            }
        }

        .material_confirm{
            width: 9.8rem;
            height: 3.6rem;
            line-height: 3.6rem;
            font-size: 1.4rem;
            text-align: center;
            margin: 0 auto;
            color: #FFFFFF;
            background: #343579;
            cursor: pointer;
            margin-top: 2rem;
        }

        .table_pagination{
            position: absolute;
            bottom: 3.5rem;
            left: 0;
            width: 100%;
            text-align: center;
            margin-top: 5rem;
        }
    }
}
</style>
