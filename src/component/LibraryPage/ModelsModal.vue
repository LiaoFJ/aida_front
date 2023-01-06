<template>
    <div>
        <a-modal class="models_modal" 
            v-model:visible="modelsModalShow" 
            :footer="null" 
            width="80%"
            :maskClosable="false"
            :centered="true"
        >
            <div class="models_header">
                <div class="models_title">Select Mannequin</div>
                <div class="models_header_right">
                    <div class="content_search_block">
                        <input class="search_input" placeholder="Search by name" v-model="searchPictureName"  @keydown.enter="getLibraryList()">
                        <div class="search_icon_block" @click="getLibraryList()"><span class="icon iconfont icon-sousuo"></span></div>
                    </div>

                    <div class="icon iconfont icon-guanbi icon_close" @click="closeModal"></div>
                </div>
            </div>

            <div class="models_content">

                <div class="models_content_left">
                    <div class="content_left_header">
                        <div class="left_header_title">Current Mannequin</div>
                        <div class="system_button" @click="setSystemModel()">Standard Mannequin</div>
                    </div>
                    <div class="content_left_perview">
                        <img class="perview_img" :src="selectImg"/>
                    </div>
                    <div class="sure_button" @click="confimSure()">ok</div>
                </div>
                <div class="models_content_right">
                    <div class="models_content_body scroll_style">
                        <div class="content_img_item" v-for="(img) in imgList" :key="img.id" @click="selectImgItem(img)">
                            <div :class="['content_img_item_block', selectImgListId == img.libraryModelPoint.templateId ? 'select_item_img' :'']">
                                <img :src="img.url" class="content_img"/>
                            </div>
                            <div class="content_img_name">{{img.name}}</div>
                        </div>
                        <div class="no_data_block" v-show="!imgList.length && !isShowLoading">
                            <img src="@/assets/images/homePage/null_img.png">
                        </div>
                        <div class="no_data_block" v-show="isShowLoading">
                            <a-spin size="large"></a-spin>
                        </div>
                    </div>

                    <div class="table_pagination">
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
        </a-modal>
    </div>
    
</template>
<script lang="ts">
import { defineComponent, ref} from 'vue'
import { Https } from "@/tool/https";
import {useStore} from 'vuex'
import { message } from 'ant-design-vue';
const systemImg = require('../../assets/images/homePage/system_model.png')
export default defineComponent({
    setup() {
        const store = useStore();
        let searchPictureName = ref('')
        let modelsModalShow = ref(false)
        let currentPage:any = ref(1)
        let pageSize = ref(12)
        let total = ref(0)
        let imgList:any = ref([])
        let isShowLoading:any = ref(false)
        let selectImgListId:any = ref('')
        let selectImg:any = ref('')
      
        return{
            store,
            searchPictureName,
            modelsModalShow,
            currentPage,
            pageSize,
            total,
            imgList,
            isShowLoading,
            selectImgListId,
            selectImg
        }
    },
    methods:{

        init(code:any){
          this.modelsModalShow = true
          this.selectImg = this.store.state.HomeStoreModule.templateImgUrl || systemImg
          this.selectImgListId = this.store.state.HomeStoreModule.templateId
          this.getLibraryList()
        },
        
        selectImgItem(imgData:any){
           this.selectImgListId = imgData.libraryModelPoint.templateId
           this.selectImg = imgData.url
        },


        //改变页码
        changePage(current: number, pageSize: number){
            this.currentPage = current
            this.pageSize = pageSize
            this.getLibraryList()
        },

        getLibraryList(){
            let data = {
                level1Type:'Models',
                level2Type:'',
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

      

        closeModal(){
            this.modelsModalShow = false
            this.searchPictureName = ''
            this.imgList = []
            this.currentPage = 1
            this.pageSize = 10
            this.total = 0
        },

        setSystemModel(){
            this.selectImg = systemImg
            this.selectImgListId = ''
        },

        //确定选择model
        confimSure(){
            this.$emit('sureSelectModel',{id:this.selectImgListId,url:this.selectImg})
            this.closeModal()
        }
    }
})
</script>
<style lang="less">
.models_modal{

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

    .models_header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 6.6rem;
        background: #F7F7F7;
        padding: 0 3.4rem 0 3rem;

        .models_title{
            font-size: 1.8rem;
            color: #030303;
            font-weight: 500;
        }

        .models_header_right{
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

    .models_content{
        padding-right: 1.4rem;
        height: calc(100% - 6.6rem);
        position: relative;
        display: flex;
        justify-content: space-between;

        .models_content_left{
            width: 36.4rem;
            height: 100%;
            background: #FFFFFF;
            flex-shrink: 0;

            .content_left_header{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.3rem 1rem 0.9rem 3rem;

                .left_header_title{
                    font-size: 1.6rem;
                    color: #333333;
                }

                .system_button{
                    padding: 0 1rem;
                    height: 3.2rem;
                    line-height: 3.2rem;
                    background: #E6E6F6;
                    font-size: 1.2rem;
                    color: #343579;
                    cursor: pointer;
                }
            }

            .content_left_perview{
                width: 100%;
                height: calc(100% - 13.8rem);
                padding: 1.9rem 3rem 0;
                box-sizing: border-box;
                margin-bottom: 1.3rem;
                display: flex;
                align-items: center;
                justify-content: center;

                .perview_img{
                    max-width: 100%;
                    max-height: 100%;
                }
            }

            .sure_button{
                width: 9.8rem;
                height: 3.6rem;
                background: #343579;
                font-size: 1.4rem;
                color: #FFFFFF;
                text-align: center;
                line-height: 3.6rem;
                margin: 0 auto;
                cursor: pointer;
            }
        }

        .models_content_right{
            width: calc(100% - 37rem);
            height: 100%;
            background: #FFFFFF;
            padding: 1.5rem 1rem 1rem 1rem;

            .models_content_body{
                width: 100%;
                height: calc(100% - 6rem);
                overflow-y: auto;

                .content_img_item{
                    display: inline-block;
                    vertical-align: top;
                    padding: 0 0.91rem;
                    margin-bottom: 1rem;

                    .content_img_item_block{
                        border: 0.1rem solid #F5F5F5;;
                        width: 16.5rem;
                        height: 25.1rem;
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

                    }
                    .content_img_name{
                        width: 16.5rem;
                        height: 3.4rem;
                        line-height: 3.4rem;
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
                width: 100%;
                text-align: center;
                margin-top: 2rem;
            }
        }

        
    }
}
</style>