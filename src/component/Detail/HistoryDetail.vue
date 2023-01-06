<template>
    <a-modal class="hsitory_detail_modal_component" 
            v-model:visible="hsitoryDetailShow" 
            :footer="null" 
            :title="collectionName"
            width="80%"
            :maskClosable="false"
            :centered="true"
        >
            <template #closeIcon>
                <div class="close_icon" @click.stop="changeDetailShow()"><span class="icon iconfont icon-guanbi"></span></div>
            </template>
            <div class="history_detail_content scroll_style">
                <div class="history_img_block" v-for="img in groupDetails" :key="img">
                    <div class="history_img_item" >
                        <img class="element_img"  :src="img.url">
                    </div>
                </div>
                
            </div>
    </a-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props:{
        groupDetails:{
            default:{},
        },
        collectionName:{
            default:''
        }
    },
    setup() {
        
    },
    data(){
        return{
            hsitoryDetailShow:false,
        }
    },
    methods:{
        changeDetailShow(){
            this.hsitoryDetailShow = !this.hsitoryDetailShow
        }
    }
})
</script>
<style lang="less">
.hsitory_detail_modal_component{

    .ant-modal-close{
        width: 3.6rem;
        height: 3.6rem;
        position: absolute;
        top: -1.8rem;
        right: -1.8rem;
    }

    .ant-modal-header{
        background: #F7F7F7;
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

    .history_detail_content{
        padding: 2.6rem 2.0rem 2.6rem 3.7rem;
        height: 100%;
        width: 100%;
        overflow-y:auto; 
        background: #FFFFFF;

        .history_img_block{
            width: 16.5rem;
            height: 16.5rem;
            border: 0.1rem solid #343579;
            margin: 0 1.7rem 1.7rem 0;
            display: inline-block;

            .history_img_item{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }

            .element_img{
                max-width: 100%;
                max-height: 100%;
            }
        }
    }
}
</style>
