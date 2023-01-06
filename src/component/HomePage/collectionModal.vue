<template>
    <div v-if="showCollectionModal">
         <a-modal class="modal_component collection_modal" 
            v-model:visible="showCollectionModal" 
            :footer="null" 
            width="80%"
            :maskClosable="false"
            :centered="true"
        >
            <template #title>
                <div v-show="collectionStep === 1">Moodboard Upload</div>
                <div v-show="collectionStep === 2"><span class="icon iconfont icon-fanhui header_icon_fanhui" @click="lastStep()"></span>Printboard Upload</div>
                <div v-show="collectionStep === 3"><span class="icon iconfont icon-fanhui header_icon_fanhui" @click="lastStep()"></span>Colorboard Upload</div>
                <div v-show="collectionStep === 4"><span class="icon iconfont icon-fanhui header_icon_fanhui" @click="lastStep()"></span>Sketchboard Upload</div>
                <div v-show="collectionStep === 5"><span class="icon iconfont icon-fanhui header_icon_fanhui" @click="lastStep()"></span>Markets Sketch</div>
            </template>
            <template #closeIcon>
                <div class="header_right_block" @click.stop="">
                    <div v-if="collectionStep < 5" class="next_step_button" @click.stop="nextStep()">Next Step</div>
                    <div v-else class="next_step_button" @click.stop="finishCollection()">Finish</div>
                    <div class="header_cancel_button" @click.stop="cancelDsign()">Cancel</div>
                </div>
            </template>
            <div class="collection_modal_body">
                <MoodboardUpload ref="MoodboardUpload" v-show="collectionStep === 1"></MoodboardUpload>
                <PrintboardUpload ref="PrintboardUpload" v-show="collectionStep === 2"></PrintboardUpload>
                <ColorboardUpload ref="ColorboardUpload" v-show="collectionStep === 3"></ColorboardUpload>
                <SketchboardUpload ref="SketchboardUpload" v-show="collectionStep === 4"></SketchboardUpload>
                <MarketingSketchUpload ref="MarketingSketchUpload" v-show="collectionStep === 5"></MarketingSketchUpload>
            </div>
        </a-modal>
    </div>
   
</template>
<script lang="ts">
import { defineComponent ,createVNode } from 'vue'
import MoodboardUpload from '@/component/HomePage/MoodboardUpload.vue'
import PrintboardUpload from '@/component/HomePage/PrintboardUpload.vue'
import ColorboardUpload from '@/component/HomePage/ColorboardUpload.vue'
import SketchboardUpload from '@/component/HomePage/SketchboardUpload.vue'
import MarketingSketchUpload from '@/component/HomePage/MarketingSketchUpload.vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal,message } from 'ant-design-vue';
import {useStore} from 'vuex'
export default defineComponent({
    components:{
        MoodboardUpload,
        PrintboardUpload,
        ColorboardUpload,
        SketchboardUpload,
        MarketingSketchUpload
    },
    data(){
        return{
            showCollectionModal:false,
            collectionStep:1,
            store:useStore()
        }
    },
    methods:{
        nextStep(){
            this.collectionStep = this.collectionStep + 1
        },

        lastStep(){
            this.collectionStep = this.collectionStep - 1
        },
        changeCollectionModal(type:boolean){
            this.showCollectionModal = type
        },

        recollection(){
            setTimeout(()=>{
                let childredCom = ['MoodboardUpload','PrintboardUpload','ColorboardUpload','SketchboardUpload','MarketingSketchUpload']
                for(let child of childredCom){
                    let childRef:any = this.$refs[child]
                    childRef.recollection()
                }
            },200)
            
        },


        //取消
        cancelDsign(){
            let _this = this
            Modal.confirm({
                title: 'The uploaded files will not be saved, being sure to continue? ',
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Yes',
                cancelText: 'No',
                // centered:true,
                onOk() {
                    _this.showCollectionModal = false
                    _this.store.commit('clearAllData')
                    _this.collectionStep = 1
                }
            });
        },

        //完成
        finishCollection(){
            let colorBoards = this.store.state.UploadFilesModule.colorBoards
            if(!colorBoards  ||  colorBoards?.length < 1){
                message.error('You must choose one or more colors for further process.')
                return
            }
            this.showCollectionModal =false
            this.collectionStep = 1
            this.$emit('finishCollection')
        }
    }
})
</script>
<style lang="less" scoped>
.collection_modal{
    .header_icon_fanhui{
        margin-right: 1rem;
        font-size: 2rem;
        cursor: pointer;
    }
    .header_right_block{
        display: flex;
        align-items: center;
        position: absolute;
        right: 2.1rem;
        height: 100%;

        .next_step_button{
            padding:  0 1.2rem;
            height: 3.2rem;
            background: #343579;
            font-size: 1.4rem;
            color: #FFFFFF;
            line-height: 3.2rem;
            margin-right: 1.6rem;
            white-space: nowrap;
            cursor: pointer;
        }

        .header_cancel_button{
            padding:  0 2.1rem;
            height: 3.2rem;
            background: #E4E5EB;
            font-size: 1.4rem;
            color: #030303;
            line-height: 3.2rem;
            white-space: nowrap;
            cursor: pointer;
        }
    }

    .collection_modal_body{
        height: 100%;
    }
}
</style>
