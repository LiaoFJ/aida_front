<template>
    <div>
        <a-modal class="design_detail_modal_component" 
            v-model:visible="designDetailShow" 
            :footer="null" 
            title="Mailbox binding"
            width="80%"
            :maskClosable="false"
            :centered="true"
        >
            <template #closeIcon>
                <div class="close_icon" @click.stop="closeModal()"><span class="icon iconfont icon-guanbi"></span></div>
            </template>
            <div class="turn_button turn_left_button" v-show="designShowPrview == 1" @click="changeDesignItem('last')"><span class="icon iconfont icon_turn icon-shangyibu"></span></div>
            <div class="turn_button turn_right_button" v-show="designShowPrview == 1" @click="changeDesignItem('next')"><span class="icon iconfont icon_turn icon-xiayibu"></span></div>
            
            <div class="design_detail_modal_body" v-show="designShowPrview == 1">
                <div class="detail_modal_body_left" @click="showDesignImgDetail()">
                    <img class="detial_img" :src="designItemDetail.designItemUrl">
                </div>
                <div class="detail_modal_body_right">
                    <div class="detail_modal_right_top scroll_style">
                        <div class="clothes_detail_item">
                            <div class="clothes_item_header"><span class="icon iconfont icon-dangqianweizhi"></span>Apparel</div>
                            <div class="clothes_item_content">
                                <Draggable  :list="designItemDetail.clothes" item-key="id" :animation="100">
                                    <template #item="{ element,index }">
                                        <div class="clothes_item_img_block"  @click="clothesDetail(element,index)">
                                            <img class="clothes_item_img" :src="element.path">
                                        </div>
                                    </template>
                                </Draggable>
                                
                            </div>
                        </div>

                        <div class="clothes_detail_item" v-show="designItemDetail.others && designItemDetail.others.length">
                            <div class="clothes_item_header"><span class="icon iconfont icon-dangqianweizhi"></span>Others</div>
                            <div class="clothes_item_content others_clothes_item_content">
                                <div class="clothes_item_img_block" v-for="(element,index) in designItemDetail.others" :key="element.path" @click="othersDetail(element,index)">
                                    <img class="clothes_item_img" :src="element.path">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="detail_modal_right_bottom">
                        <div class="detail_page_num">{{parentData.index + 1}}/{{parentData.collectionList.length}}</div>
                        <div class="detail_redesign_button" @click="redesignItem()">Redesign</div>
                    </div>
                </div>
            </div>

            <div class="design_detail_perview" v-show="designShowPrview == 2">
                <div class="design_detail_perview_content" >
                    <img class="perview_img"   v-lazy="designItemDetail.designItemUrl || ''" :key="designItemDetail.designItemUrl">
                    <!-- <div class="generate_button" v-show="designItemDetail.singleOverall == 'overall'" @click="generateHighDesign()">Generate Product lmage</div> -->
                </div>
            </div>

            <div class="design_detail_perview design_detail_perview_second" v-show="designShowPrview == 3">
                <div class="design_detail_perview_content" >
                    <img class="perview_img"  v-lazy="designItemDetail.designItemUrl || ''" :key="designItemDetail.designItemUrl">
                </div>
                <div class="design_detail_perview_content" >
                    <img class="perview_img" v-lazy="generateHighDesignImg || ''" :key="generateHighDesignImg">
                    <div class="img_item_hover">
                        <div class="img_operate_block delete_img_block" @click.stop="deleteGeneratePic()">
                            <span class="icon iconfont icon-shanchu operate_icon"></span>
                        </div>
                    </div>
                </div>
            </div>
        </a-modal>
        <ElementReplace ref="ElementReplace"></ElementReplace>
        <AccessoryReplace ref="AccessoryReplace"></AccessoryReplace>

         <div class="mark_loading" v-show="loadingShow">
            <a-spin size="large" />
        </div>
    </div>
    
</template>
<script lang="ts">
import { defineComponent,computed,ref } from 'vue'
import ElementReplace from '@/component/Detail/ElementReplace.vue'
import AccessoryReplace from '@/component/Detail/AccessoryReplaceModal.vue'
import Draggable from 'vuedraggable'
import { Https } from "@/tool/https";
import { useStore } from "vuex";
export default defineComponent({
    components:{
        ElementReplace,
        AccessoryReplace,
        Draggable,
    },
    setup() {
        const store = useStore();
        let designItemDetail :any = computed(()=>{return store.state.DesignDetailModule.designItemDetail})
        let parentData:any = ref({
            design:{},
            index:0,
            collectionList:[],
            type:'',
        })//父组件传过来的数据
        return{
            designItemDetail,
            store,
            parentData
        }
    },
    data(){
        return{
            loadingShow:false,
            designDetailShow:false,
            designShowPrview:1, //展示图片预览步骤
            generateHighDesignImg:'',//点击generate按钮生成的高级设计图
            
        }
    },
    methods:{
        closeModal(){
            if(this.designShowPrview == 1){
                this.designDetailShow = false
            }else if(this.designShowPrview == 2){
                this.designShowPrview = this.designShowPrview - 1
            }else if(this.designShowPrview == 3){
                this.designShowPrview = 1
            }
        },

        showDesignDetailModal(data:any){
            let url = Https.httpUrls.getDesignDetail + `?designItemId=${data.design.designItemId}`
            this.parentData = data
            this.loadingShow = true
            Https.axiosGet(url).then(
                (rv: any) => {
                    this.store.commit('setDesignItemDetail',rv)
                    this.generateHighDesignImg = rv.highDesignUrl
                    this.designShowPrview = 1
                    this.designDetailShow = true
                    this.loadingShow = false
                }
            ).catch(rv=>{
                this.loadingShow = false
            })
        },

        //切换上一张或下一张图的详情
        changeDesignItem(type:string){
            let {design,index,collectionList} = this.parentData
            let newDesign = {}
            let newIndex = 0
            if(type === 'last'){
                if(index>0){
                    newIndex = this.parentData.index - 1
                }else{
                    newIndex = this.parentData.collectionList.length - 1
                }
            }else{
                if(index <  this.parentData.collectionList.length - 1){
                    newIndex = this.parentData.index + 1
                }else{
                    newIndex = 0
                }
            }
            newDesign = collectionList[newIndex]
            let data = {
                design:newDesign,
                index:newIndex,
                collectionList:collectionList
            }
            this.showDesignDetailModal(data)
        },

        //显示图片详情
        showDesignImgDetail(){
            if(this.generateHighDesignImg){
                this.designShowPrview = 3
            }else{
                this.designShowPrview = 2
            }
        },

        //生成高级图片
        generateHighDesign(){
            let design:any = this.parentData.design
            let data = {
                designItemId: design.designItemId,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            this.loadingShow = true
             Https.axiosPost(Https.httpUrls.generateHighDesign,data).then(
                (rv: any) => {
                    this.generateHighDesignImg = rv
                    this.loadingShow = false
                    this.designShowPrview = 3
                }
            ).catch(rv=>{
                this.loadingShow = false
            })
        },

        //删除生成的真人图
        deleteGeneratePic(){
            let design:any = this.parentData.design
            let data = {
                designItemId: design.designItemId,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            this.loadingShow = true
            Https.axiosPost(Https.httpUrls.deleteHighDesign,data).then(
                (rv: any) => {
                    this.loadingShow = false
                    this.generateHighDesignImg = ''
                    this.designShowPrview = 2
                }
            ).catch(rv=>{
                this.loadingShow = false
            })
        },

        //元素替换
        clothesDetail(clothes:any, index:number){
            let elementReplace:any = this.$refs.ElementReplace
            let data ={
                clothes:clothes,
                index:index,
            }
            elementReplace.showelementReplaceModal(data)
        },

        othersDetail(others:any, index:number){
            let accessoryReplace:any = this.$refs.AccessoryReplace
            let data ={
                others:others,
                index:index,
            }
            accessoryReplace.showAccessoryReplaceModal(data)
        },

        //重新设计
        redesignItem(){
            let designItemDetail = JSON.parse(JSON.stringify(this.store.state.DesignDetailModule.designItemDetail))
            delete designItemDetail.designItemUrl
            let priority = designItemDetail.clothes.map((v:any)=>{
                return v.type
            })
            let data = {
                ...designItemDetail,
                priority:priority,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            this.loadingShow = true
            Https.axiosPost(Https.httpUrls.designSingle, data).then(
                (rv: any) => {
                    this.parentData.design.designItemUrl = rv.designItemUrl
                    this.$emit('finishRedesign',this.parentData)
                    this.closeModal()
                    this.loadingShow = false
                    this.closeModal()
                }
            ).catch(res=>{
                this.loadingShow = false
            });
        }



        
    }
})
</script>
<style lang="less">
.design_detail_modal_component{
    color: #000;

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

    .turn_button{
        width: 3.6rem;
        height: 3.6rem;
        background: #000000;
        border-radius: 50%;
        position: absolute;
        top: calc(50% - 1.8rem);
        cursor: pointer;
        line-height: 3.6rem;
        text-align: center;

        &.turn_left_button{
            left: -8rem;
        }

        &.turn_right_button{
            right: -8rem;
        }

        .icon_turn{
            font-size: 2.4rem;
            color: #ffffff;
        }
    }

    

    .design_detail_modal_body{
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 1.5rem 1rem 2.5rem;
        box-sizing: border-box;

        .detail_modal_body_left{
            width: 43.3rem;
            height: 100%;
            background: #FFFFFF;
            display: flex;
            justify-content: center;
            align-items: center;

            .detial_img{
                max-width: 100%;
                max-height: 100%;
            }
        }

        .detail_modal_body_right{
            width: calc(100% - 44rem);
            height: 100%;

            .detail_modal_right_top{
                width: 100%;
                height: calc(100% - 3.9rem);
                background: #fff;
                overflow-y: auto;

                .clothes_detail_item{
                    padding-left: 1.5rem;

                    .clothes_item_header{
                        height: 6.4rem;
                        display: flex;
                        align-items: center;
                        font-size: 18px;
                        color: #000000;

                        .icon-dangqianweizhi{
                            font-size: 1.8rem;
                            color: #000000;
                            margin-right: 1rem;
                        }
                    }

                    .clothes_item_content{
                        padding:0 0.5rem 2.3rem;
                        border-bottom: 0.1rem solid #F2F3FB;

                        &.others_clothes_item_content{
                            border-bottom:none
                        }

                        .clothes_item_img_block{
                            width: 20.5rem;
                            height: 20.5rem;
                            border: 0.1rem solid #F5F5F5;
                            display: inline-block;
                            text-align: center;
                            line-height: 21.3rem;
                            margin-right: 1rem;
                            margin-bottom: 1rem;

                            .clothes_item_img{
                                max-width: 100%;
                                max-height: 100%;
                            }
                        }
                    }
                }
            }

            .detail_modal_right_bottom{
                position: relative;

                .detail_page_num{
                    position: absolute;
                    top: 2rem;
                    left: 12.4rem;
                    font-size: 1.8rem;
                    font-family: Roboto;
                    font-weight: 400;
                    color: #000000;
                }

                .detail_redesign_button{
                    position: absolute;
                    top: 1.4rem;
                    right: 0;
                    padding: 0 1.8rem;
                    text-align: center;
                    height: 3.6rem;
                    line-height: 3.6rem;
                    background: #343579;
                    font-size: 14px;
                    font-family: Roboto;
                    color: #FFFFFF;
                    cursor: pointer;
                }
            }
        }
    }

    .design_detail_perview{
        width: 100%;
        height: 100%;
        padding: 0.7rem 0 0.6rem;

        &.design_detail_perview_second{
            width: 100%;
            height: 100%;
            padding: 0.7rem 9.1rem 0.6rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .design_detail_perview_content{
            width: 46.2rem;
            height: 100%;
            background: #fff;
            position: relative;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;

            .perview_img{
                max-width: 100%;
                max-height: 100%;
            }
            .generate_button{
                position: absolute;
                top: 0;
                right: -20.2rem;
                padding: 0 1.5rem;
                text-align: center;
                height: 3.6rem;
                line-height: 3.6rem;
                background: #343579;
                font-size: 14px;
                font-family: Roboto;
                color: #FFFFFF;
                cursor: pointer;
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
                background: rgba(0,0,0,0.4);
                display: none;

                .img_operate_block{
                    width: 3.6rem;
                    height: 3.6rem;
                    background: rgba(0,0,0,0.6);
                    border-radius: 50%;
                    position: absolute;
                    right: 2.2rem;
                    text-align: center;
                    line-height: 3.6rem;
                    cursor: pointer;

                    &.delete_img_block{
                        top: 2rem;
                    }

                    .operate_icon{
                        font-size: 1.8rem;
                        color: #fff;
                    }
                }
            }
        }

        
    }

   
    
}
</style>
