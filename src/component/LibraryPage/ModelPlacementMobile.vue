<template>
    <div  v-show="placementShow">
        <a-modal class="models_placement_mobile_component" 
            v-model:visible="placementShow" 
            :footer="null" 
            width="111.5rem"
            :maskClosable="false"
            :centered="true"
        >
            <template #closeIcon>
                <div class="close_icon" @click.stop="closeModal()"><span class="icon iconfont icon-guanbi"></span></div>
            </template>
            <div class="models_placement_body" >
                <div class="palcement_modal_header">
                    <div class="models_placement_title">Registration</div>
                    <div class="placement_operate_list">
                        <div class="operate_item" v-show="locationList.length == 6" @click="submitPlacement">
                            <div class="icon iconfont icon-baocun1 operate_icon"></div>
                            <div class="operate_item_des">Submit</div>
                        </div>
                        <div class="operate_item" v-show="locationList.length == 6" @click="printPreview">
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
                <div class="models_placement_content" @touchmove="startMove($event)">
                    <div class="plcaement_point_content">
                        <div class="placement_point_item" v-for="(point,index) in pointList" :key="index"  >
                            <div class="ponit_title">{{point.title}}</div>
                            <div class="point_list">
                                <div class="point_item" v-for="item in point.pointList" :key="item.color" :style="{borderColor:item.color,visibility:item.show?'inherit':'hidden'}" @touchstart="AddDian(item)"><div class="point_block" :style="{background:item.color}"></div></div>
                            </div>
                        </div>
                    </div>

                    <div class="placement_content_operate_list">
                        <div class="placement_content_operate_item" @click="changeRemoveStatus">
                            <div class="placement_remove_point_block"></div>
                            <div class="placement_content_operate_des">Remove Point</div>
                        </div>
                    </div>

                    <div class="placement_tip_content">Please change the pure white inside the mannequin for another color to enhance your experience</div>

                    <div class="img_preview_block"  >
                        <div class="perview_mark_loading" v-show="isShowMark">
                            <a-spin size="large" />
                        </div>
                        <div class="img_content_block" ref="imgbox">
                            <img class="placement_img" :src="perviewUrl || printObject?.url">
                            <div :class="['ponit_click',isRemoveStatus?'remove_point_click':'']" v-for="(item,index) in locationList" :key="item" :style="{left:item.left+'px', top:item.top+'px',borderColor:item.color}" @touchstart="getMouseDown($event,item,index)"  @touchmove="startMove($event)">
                                <div class="placement_add_point_content" :style="{background:item.color}" v-show="!isRemoveStatus"></div>
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
import { defineComponent,ref,createVNode} from 'vue'
import { Https } from "@/tool/https";
import { useStore } from "vuex";
import { Modal,message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
export default defineComponent({
    setup() {
        const store = useStore()
        let oldLocationList:any = ref([])
        let locationList:any = ref([])
        let printObject:any = ref({})
        let imgBox:any = ref({})
        let intObj:any = ref(null)
        let currentSign:any = ref({})
        let oldPointList:any = ref([]) //备份点
        let pointList:any = ref([])
        let isSubmit:any = ref(false) //判断历史是否有提交过
        return {
            store,
            oldLocationList,
            locationList,
            printObject,
            imgBox,
            intObj,
            currentSign,
            oldPointList,
            pointList,
            isSubmit
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
            this.placementShow = true
            this.printObject = {
                ...data
            }
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
                this.getDefaultPointList(this.imgBox)
            },400)
        },

        //初始化可以使用的点位
        getDefaultPointList(imgBox:any){
            this.isSubmit = false
            this.pointList = [
                {
                    title:'SHOULDER',
                    pointList:[{type:'shoulderLeft',color:'#6E70FF',show:true,field:'shoulder'},{type:'shoulderRight',color:'#6E70FF',show:true,field:'shoulder'}]
                },
                {
                    title:'WAISTBAND',
                    pointList:[{type:'waistbandLeft',color:'#6FCEFF',show:true,field:'waistband'},{type:'waistbandRight',color:'#6FCEFF',show:true,field:'waistband'}]
                },
                {
                    title:'HAND',
                    pointList:[{type:'handLeft',color:'#CCFF7B',show:true,field:'hand'},{type:'handRight',color:'#CCFF7B',show:true,field:'hand'}]
                },
            ]
            if(this.printObject.templateId){//编辑
                this.isSubmit = true
                for(let ponit of this.pointList){
                    for(let pointItem of ponit.pointList){
                        if(this.printObject[pointItem.type]?.length){
                            pointItem.show = false
                            let data = {
                                left:this.printObject[pointItem.type][0] * imgBox.width - 12,
                                top:this.printObject[pointItem.type][1] * imgBox.height - 12,
                                color:pointItem.color,
                                type:pointItem.type,
                                field:pointItem.field,
                            }
                            this.locationList.push(data)
                        }
                    }
                }
                this.oldLocationList = JSON.parse(JSON.stringify(this.locationList))

            }
            
            this.oldPointList = JSON.parse(JSON.stringify(this.pointList))
        },


        AddDian(point:any){
            if(!point.show){
                return
            }
            this.startDian = true
            this.isRemoveStatus = false
            this.intObj = point
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
            if(event.targetTouches[0].pageX > this.imgBox.left){
                if(this.intObj){
                    this.currentSign.left = event.targetTouches[0].pageX - this.imgBox.left
                    this.currentSign.top =  event.targetTouches[0].pageY + scrollTop - this.imgBox.top
                    this.currentSign.color = this.intObj.color
                    this.currentSign.type= this.intObj.type
                    this.currentSign.field = this.intObj.field
                    this.locationList.push(this.currentSign)
                    this.intObj.show = false
                    this.intObj = null
                }else{
                    if(this.startDian){
                        this.currentSign.left = event.targetTouches[0].pageX - this.imgBox.left - this.moveOriginal.posX
                        this.currentSign.top =  event.targetTouches[0].pageY + scrollTop - this.imgBox.top -this.moveOriginal.posY
                        document.addEventListener('touchend', this.getMouseOver);
                        this.$forceUpdate()
                        this.setBoundarySign()
                    }
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
                for(let itemPoint of this.pointList){
                    for(let point of itemPoint.pointList){
                        if(item.id == point.id){
                            point.show = true
                            break
                        }
                    }
                }
                this.locationList.splice(index,1)
            }else{
                this.currentSign = item
                // 计算出鼠标在签名域上的偏移
                this.moveOriginal.posX = event.targetTouches[0].pageX - this.imgBox.left - this.currentSign.left
                this.moveOriginal.posY = event.targetTouches[0].pageY - this.imgBox.top- this.currentSign.top // 1为边框
                this.startDian = true
            }
            
        },
     
        getMouseOver(){
            this.startDian = false
            this.currentSign = {}
            document.removeEventListener('touchend', this.getMouseOver);
        },

        closeModal(){
            let _this = this
            if(!this.isSubmit){
                Modal.confirm({
                    title: "You haven't marked the image yet, and the model will not be uploaded. Are you sure you want to close it?",
                    icon: createVNode(ExclamationCircleOutlined),
                    okText: 'Ok',
                    cancelText: 'Cancel',
                    // centered:true,
                    onOk() {
                        // _this.getDefaultPointList(_this.imgBox)
                        _this.oldLocationList = []
                        _this.locationList = []
                        _this.intObj = null
                        _this.currentSign = {}
                        _this.isRemoveStatus = false
                        _this.placementShow = false
                    }
                });
            }else{
                // _this.getDefaultPointList(_this.imgBox)
                _this.oldLocationList = []
                _this.locationList = []
                _this.intObj = null
                _this.currentSign = {}
                _this.isRemoveStatus = false
                _this.placementShow = false
            }
        },

        restoreLocationList(){
            this.pointList = JSON.parse(JSON.stringify(this.oldPointList))
            this.locationList = JSON.parse(JSON.stringify(this.oldLocationList))
        },

        submitPlacement(){
            if(this.printObject.templateId){
                this.printObject.id = this.printObject.libraryId
                this.confrimSubmit()
            }else{
                this.customRequest().then((rv:any)=>{
                    this.isShowMark = false
                    this.printObject.id = rv.id
                    this.confrimSubmit()
                }).catch((res:any)=>{
                    this.isShowMark = false
                })
            }

        },

        confrimSubmit(){
            let param = {
                libraryId:this.printObject.id,
                templateId:this.printObject.templateId || null,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
                ...this.getPrintLocation()
            }
            this.isShowMark = true
            Https.axiosPost(Https.httpUrls.saveOrEditTemplatePoint, param).then(
                (rv: any) => {
                    this.isShowMark = false
                    this.isSubmit = true
                    this.$emit('submitModelPlacement')
                    this.closeModal()
                }
            ).catch(res=>{
                this.isShowMark = false
            });
        },

        customRequest(){
            let new_data = {
                file:this.printObject.file,
                level1Type:'Models',
                level2Type:'',
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            this.isShowMark = true
            return new Promise((resolve,reject)=>{
                Https.axiosPost(Https.httpUrls.libraryUpload, new_data,{headers:{'Content-Type': 'multipart/form-data'}}).then(
                    (rv: any) => {
                        resolve(rv)
                    }
                ).catch((res)=>{
                    reject(res)
                });
            })
            
        },


        getPrintLocation(){
            let {width , height} = this.imgBox
            let locationData:any = {}
            let returnData:any = {}
            let newLocationList = JSON.parse(JSON.stringify(this.locationList))
            //进行字段归类
            for(let item of newLocationList){
                locationData[item.field] = locationData[item.field] || []
                locationData[item.field].push(item)
            }
            for(let key in locationData){
                locationData[key].sort(this.sortBy("left")) //通过left字段进行排序
                locationData[key].forEach((v:any,index:any) => {
                    v.type = !index ?v.field + 'Left' :v.field +'Right' //第一个是left，第二个是right
                    v.left = ((v.left + 12) / width).toFixed(4)
                    v.top = ((v.top + 12) / height).toFixed(4)
                    returnData[v.type] = [v.left, v.top]
                });
            }
            return returnData
        },

        sortBy(field:any) {
            return function(a:any,b:any) {
                return a[field] - b[field];
            }
        },

        printPreview(){
            // this.printObject.scale = this.placement_sacle / 100
            // this.printObject.location = this.printObject.ifSingle ? this.getPrintLocation() : []
            // let designItemDetail = JSON.parse(JSON.stringify(this.store.state.DesignDetailModule.designItemDetail))
            // designItemDetail.clothes[this.collectionIndex] = this.clothesData
            // delete designItemDetail.designItemUrl
            // let priority = designItemDetail.clothes.map((v:any)=>{
            //     return v.type
            // })
            // let data = {
            //     ...designItemDetail,
            //     priority:priority,
            //     timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            // }
            // if(this.isShowMark){
            //     return
            // }
            // this.isShowMark = true
            // Https.axiosPost(Https.httpUrls.detailPrintDot, data).then(
            //     (rv: any) => {
            //         this.perviewUrl = rv
            //         this.isShowMark = false
            //     }
            // ).catch(res=>{
            //     this.isShowMark = false
            // });
        },

        backPreview(){
            this.perviewUrl = ''
        }
    }
})
</script>
<style lang="less">
.models_placement_mobile_component{

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

    .models_placement_body{
        width: 100%;
        height: 100%;

        .palcement_modal_header{
            position: relative;
            height: 6.6rem;
            width: 100%;
            background: #F7F7F7;

            .models_placement_title{
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

        .models_placement_content{
            position: relative;
            height: calc(100% - 6.6rem);
            width: 100%;
            padding: 1.1rem 0;

            .plcaement_point_content{
                width: 22rem;
                background: #EBECF4;
                position: absolute;
                left: 0;
                top:18.4rem;
                padding: 3rem 2.7rem 0 1.4rem;

                .placement_point_item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;

                    .ponit_title{
                        font-size: 1.3rem;
                        color: #64686D;
                        user-select:none; /* CSS3属性 */
                    }

                    .point_list{
                        display: flex;
                        align-items: center;
                        width: 6.2rem;
                        justify-content: space-between;

                        .point_item{
                            width: 2.4rem;
                            height: 2.4rem;
                            border-radius: 50%;
                            border:solid 0.2rem transparent;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            -moz-user-select:none; /* Firefox私有属性 */
                            -webkit-user-select:none; /* WebKit内核私有属性 */
                            -ms-user-select:none; /* IE私有属性(IE10及以后) */
                            -khtml-user-select:none; /* KHTML内核私有属性 */
                            -o-user-select:none; /* Opera私有属性 */
                            user-select:none; /* CSS3属性 */


                            .point_block{
                                width: 0.4rem;
                                height: 0.4rem;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }

            .placement_content_operate_list{
                width: 10.6rem;
                background: #EBECF4;
                position: absolute;
                right: 0;
                top:18.4rem;

                .placement_content_operate_item{
                    padding: 1.5rem 0;
                    text-align: center;
                    cursor: pointer;


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

                    .placement_remove_point_block{
                        width: 2.4rem;
                        height: 2.4rem;
                        border: 2px solid #000000;
                        border-radius: 50%;
                        margin: 0 auto 0.4rem;
                    }
                }
            }

            .placement_tip_content{
                position: absolute;
                right: 2rem;
                bottom: 2rem;
                width: 30rem;
                font-size: 1.3rem;
                color: #64686D;
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
                    border: 2px solid transparent;
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