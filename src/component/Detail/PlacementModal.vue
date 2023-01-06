<template>
    <div  v-show="placementShow">
        <a-modal class="placement_modal_component" 
            v-model:visible="placementShow" 
            :footer="null" 
            width="111.5rem"
            :maskClosable="false"
            :centered="true"
        >
            <template #closeIcon>
                <div class="close_icon" @click.stop="closeModal()"><span class="icon iconfont icon-guanbi"></span></div>
            </template>
            <div class="placement_modal_body" >
                <div class="palcement_modal_header">
                    <div class="placement_modal_title">Placement</div>
                    <div class="placement_operate_list">
                        <div class="operate_item" @click="submitPlacement">
                            <div class="icon iconfont icon-baocun1 operate_icon"></div>
                            <div class="operate_item_des">Submit</div>
                        </div>
                        <div class="operate_item" @click="printPreview">
                            <div class="icon iconfont icon-shengchengyulan operate_icon"></div>
                            <div class="operate_item_des">Preview</div>
                        </div>
                        <div class="operate_item" v-show="perviewUrl" @click="backPreview">
                            <div class="icon iconfont icon-fanhui1 operate_icon"></div>
                            <div class="operate_item_des">Back</div>
                        </div>
                        <div class="operate_item" @click="restoreLocationList">
                            <div class="icon iconfont icon-huifu operate_icon"></div>
                            <div class="operate_item_des">Restore</div>
                        </div>
                    </div>
                </div>
                <div class="placement_modal_content">
                    <div class="placement_content_operate_list">
                        <!-- <div class="placement_content_operate_item" @click="overallClick()">
                            <div class="placement_overall_icon">
                                <div class="placement_overall_content" v-show="!printObject.ifSingle"></div>
                            </div>
                            <div class="placement_content_operate_des">Overall</div>
                        </div> -->

                        <div class="placement_content_operate_item">
                            <div class="print_scale_value">{{placement_sacle}}%</div>
                            <a-slider
                                id="placement_silder"
                                :tooltipVisible="false"
                                v-model:value="placement_sacle"
                                :min="30"
                                :max="300"
                            />
                            <div class="placement_content_operate_des">Print Scale</div>
                        </div>

                        <!-- <div class="placement_content_operate_item" @mousedown="AddDian()" v-show="!perviewUrl">
                            <div class="placement_add_point_block">
                                <div class="placement_add_point_content"></div>
                            </div>
                            <div class="placement_content_operate_des" >Add Point</div>
                        </div>

                        <div class="placement_content_operate_item" @click="changeRemoveStatus" v-show="!perviewUrl">
                            <div class="placement_remove_point_block"></div>
                            <div class="placement_content_operate_des">Remove Point</div>
                        </div> -->
                    </div>

                    <div class="img_preview_block"  >
                        <div class="perview_mark_loading" v-show="isShowMark">
                            <a-spin size="large" />
                        </div>
                        <div class="img_content_block" ref="imgbox" @mousemove="startMove($event)">
                            <img class="placement_img"  v-lazy="perviewUrl || clothesData?.path" :key="perviewUrl || clothesData?.path">
                            <div :class="['ponit_click',isRemoveStatus?'remove_point_click':'']" v-show="!perviewUrl" v-for="(item,index) in locationList" :key="item" :style="{left:item.left+'px', top:item.top+'px'}" @mousedown="getMouseDown($event,item,index)"  @mousemove="startMove($event)">
                                <div class="placement_add_point_content" v-show="!isRemoveStatus"></div>
                                <div class="icon iconfont icon-guanbi" v-show="isRemoveStatus"></div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
    
</template>
<script lang="ts">
import { defineComponent,ref} from 'vue'
import { Https } from "@/tool/https";
import { useStore } from "vuex";
export default defineComponent({
    setup() {
        const store = useStore()
        let oldLocationList:any = ref([])
        let locationList:any = ref([])
        let printObject:any = ref({})
        let imgBox:any = ref({})
        let intObj:any = ref(null)
        let currentSign:any = ref({})
        let clothesData:any = ref({})
        return {
            store,
            oldLocationList,
            locationList,
            printObject,
            imgBox,
            intObj,
            currentSign,
            clothesData
        }
    },
    data(){
        return{
            placementShow:false,
            collectionIndex:0,
            startDian:false,
            moveOriginal:{posX: 0, posY: 0},
            isRemoveStatus:false,
            placement_sacle:30,
            perviewUrl:'',//预览的图片地址
            isShowMark:false,
        }
    }, 
    methods:{
        formatter(value:number){
            return `${value}%`;
        },

        showPlacementModal(data:any){
            this.clothesData = JSON.parse(JSON.stringify(data.clothesData))
            this.printObject = this.clothesData.printObject
            this.collectionIndex = data.index
            this.placement_sacle = this.printObject.scale ? this.printObject.scale * 100 : 30
            this.placementShow = true
            setTimeout(()=>{
                let imgbox:any = this.$refs.imgbox
                let position = imgbox.getBoundingClientRect()
                this.imgBox = {
                    width:imgbox.clientWidth,
                    height:imgbox.scrollHeight,
                    left : position.left,
                    top:position.top,
                    scrollTop:imgbox.scrollTop || 0,
                }
                this.getLocationList(this.imgBox)
            },500)
        },

        getLocationList(imgBox:any){
            if(this.printObject.location){
                this.locationList = this.printObject.location.map((v:any)=>{
                    let data = {
                        left:(v[0] * imgBox.width) - 12,
                        top:(v[1] * imgBox.height) -12
                    }
                    return data
                })
                this.oldLocationList = JSON.parse(JSON.stringify(this.locationList))
            }
        },

        overallClick(){
            this.printObject.ifSingle = !this.printObject.ifSingle
        },

        AddDian(){
            this.startDian = true
            this.isRemoveStatus = false
            this.intObj = true
        },

        changeRemoveStatus(){
            this.isRemoveStatus = true
        },

        startMove(event:any){
            if(this.isRemoveStatus){
                return
            }
            let imgbox:any = this.$refs.imgbox
            let scrollTop = imgbox.scrollTop;
            if(this.intObj){
                this.currentSign.left = event.clientX - this.imgBox.left
                this.currentSign.top =  event.clientY + scrollTop - this.imgBox.top 
                this.locationList.push(this.currentSign)
                this.printObject.ifSingle = true
                this.intObj = null
            }else{
                if(this.startDian){
                    this.currentSign.left = event.clientX - this.imgBox.left - this.moveOriginal.posX
                    this.currentSign.top =  event.clientY + scrollTop - this.imgBox.top -this.moveOriginal.posY
                    document.addEventListener('mouseup', this.getMouseOver);
                    this.$forceUpdate()
                    this.setBoundarySign()
                }
            }
        },

      

         // 在边界上的签名域处理
         setBoundarySign() {
            let imgbox:any = this.$refs.imgbox
            let height = imgbox.offsetHeight + imgbox.scrollTop;
            // 2 为签名域的边框
            let maxPosHeight = height - 24
            let maxPosWidth = imgbox.clientWidth - 24 //+ this.signBox.paddLeft;
            if (this.currentSign.top <= 0) {
                this.currentSign.top = 0
            } else if (this.currentSign.top >= maxPosHeight ) {
                this.currentSign.top = maxPosHeight;
            }
            if (this.currentSign.left <= 0) {
                this.currentSign.left = 0
            } else if (this.currentSign.left >= maxPosWidth) {
                this.currentSign.left = maxPosWidth;
            }
        },

        getMouseDown(event:any,item:any,index:number){
            if(this.isRemoveStatus){
                this.locationList.splice(index,1)
            }else{
                this.currentSign = item
                // 计算出鼠标在签名域上的偏移
                this.moveOriginal.posX = event.offsetX
                this.moveOriginal.posY = event.offsetY // 1为边框
                this.startDian = true
            }
            
        },
     
        getMouseOver(){
            this.startDian = false
            this.currentSign = {}
            document.removeEventListener('mouseup', this.getMouseOver);
        },

        closeModal(){
            this.oldLocationList = []
            this.locationList = []
            this.printObject = {}
            this.intObj = null
            this.currentSign = {}
            this.isRemoveStatus = false
            this.placementShow = false
            this.perviewUrl = ''
        },

        restoreLocationList(){
            this.locationList = JSON.parse(JSON.stringify(this.oldLocationList))
        },

        submitPlacement(){
            this.printObject.scale = this.placement_sacle / 100
            this.printObject.location = this.printObject.ifSingle ? this.getPrintLocation() : []
            this.$emit('submitPlacement',this.printObject)
            this.closeModal()

        },

        getPrintLocation(){
            let {width , height} = this.imgBox
            let location = this.locationList.map((v:any)=>{
                let left = ((v.left + 12) / width).toFixed(4)
                let top = ((v.top + 12) / height).toFixed(4)
                let data = [left,top]
                return data
            })
            return location
        },

        printPreview(){
            this.printObject.scale = this.placement_sacle / 100
            this.printObject.location = this.printObject.ifSingle ? this.getPrintLocation() : []
            let designItemDetail = JSON.parse(JSON.stringify(this.store.state.DesignDetailModule.designItemDetail))
            designItemDetail.clothes[this.collectionIndex] = this.clothesData
            delete designItemDetail.designItemUrl
            let priority = designItemDetail.clothes.map((v:any)=>{
                return v.type
            })
            let data = {
                ...designItemDetail,
                priority:priority,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            if(this.isShowMark){
                return
            }
            this.isShowMark = true
            Https.axiosPost(Https.httpUrls.detailPrintDot, data).then(
                (rv: any) => {
                    this.perviewUrl = rv
                    this.isShowMark = false
                }
            ).catch(res=>{
                this.isShowMark = false
            });
        },

        backPreview(){
            this.perviewUrl = ''
        }
    }
})
</script>
<style lang="less">
.placement_modal_component{

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

    .placement_modal_body{
        width: 100%;
        height: 100%;

        .palcement_modal_header{
            position: relative;
            height: 6.6rem;
            width: 100%;
            background: #F7F7F7;

            .placement_modal_title{
                position: absolute;
                height: 100%;
                line-height: 6.6rem;
                left: 3.7rem;
                top: 0;
                font-size: 1.8rem;
                color: #030303;
            }
            .placement_operate_list{
                display: flex;
                align-items: center;
                margin:0 auto;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                height: 100%;

                .operate_item{
                    margin-right: 4rem;
                    text-align: center;
                    cursor: pointer;

                    .operate_icon{
                        font-size: 2.1rem;
                        color: #64686D;
                    }

                    .operate_item_des{
                        height: 1.2rem;
                        font-size: 1.3rem;
                        color: #64686D;
                    }
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
        }

        .placement_modal_content{
            position: relative;
            height: calc(100% - 6.6rem);
            width: 100%;
            padding: 1.1rem 0;

            .placement_content_operate_list{
                width: 9rem;
                background: #EBECF4;
                position: absolute;
                left: 0;
                top:6.8rem;

                .placement_content_operate_item{
                    padding: 1.5rem 0;
                    text-align: center;
                    cursor: pointer;

                    .placement_overall_icon{
                        width: 2.4rem;
                        height: 2.4rem;
                        padding: 0.3rem;
                        background: #EBECF4;
                        border: 0.1rem solid #64686D;
                        margin: 0 auto 0.4rem;

                        .placement_overall_content{
                            width: 100%;
                            height: 100%;
                            background: #343579;
                        }
                    }

                    .placement_content_operate_des{
                        width: 100%;
                        font-size: 1.3rem;
                        color: #64686D;
                        -moz-user-select:none;
                        user-select:none
                    }

                    .print_scale_value{
                        height: 1.1rem;
                        font-size: 1.2rem;
                        text-align: center;
                        margin-bottom: 0.3rem;
                        color: #64686D;
                    }

                    .ant-tooltip-placement-top{
                        top: -37px !important;
                    }

                    .ant-slider-track{
                        background: #343579;
                    }
                    .ant-slider-handle{
                        border-color: #343579;
                    }

                    .placement_add_point_block{
                        width: 2.4rem;
                        height: 2.4rem;
                        position: relative;
                        border: 2px solid #6E70FF;
                        border-radius: 50%;
                        margin: 0 auto 0.4rem;

                        .placement_add_point_content{
                            width: 0.4rem;
                            height: 0.4rem;
                            border-radius: 50%;
                            background: #6E70FF;
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%);
                        }
                    }
                    .placement_remove_point_block{
                        width: 2.4rem;
                        height: 2.4rem;
                        border: 2px solid #000000;
                        border-radius: 50%;
                        margin: 0 auto 0.4rem;
                    }
                }
            }

            .img_preview_block{
                width: 40.8rem;
                background: #ffffff;
                margin: 0 auto;
                position: relative;
                user-select:none;
                -moz-user-select:none;
                position: relative;

                .img_content_block{
                    width: 40.8rem;
                    height: 100%;
                    max-height: 63.2rem;
                    overflow-y: auto;
                    -ms-overflow-style: none;
                    overflow: -moz-scrollbars-none;
                    position: relative;

                    &::-webkit-scrollbar { width: 0 !important }
                }

                .perview_mark_loading{
                    position: absolute;
                    left: 0;
                    height: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    z-index: 9;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                }

                .placement_img{
                    width: 100%;
                    user-select:none;
                    -moz-user-select:none;
                }

                .ponit_click{
                    width: 24px;
                    height: 24px;
                    position: absolute;
                    border: 2px solid #6E70FF;
                    border-radius: 50%;
                    -moz-user-select:none; /* Firefox私有属性 */
                    -webkit-user-select:none; /* WebKit内核私有属性 */
                    -ms-user-select:none; /* IE私有属性(IE10及以后) */
                    -khtml-user-select:none; /* KHTML内核私有属性 */
                    -o-user-select:none; /* Opera私有属性 */
                    user-select:none; /* CSS3属性 */
                    cursor: pointer;

                    &.remove_point_click{
                        border-color: transparent;
                        background: #EF3C3C;
                    }

                    .placement_add_point_content{
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                        background: #6E70FF;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                    }

                    .icon-guanbi{
                        font-size: 20px;
                        line-height: 20px;
                        color:#ffffff;
                    }
                }
            }
        }
    }
}

</style>
