<template>
    <a-modal class="accessory_replace_modal" 
        v-model:visible="accessoryReplaceShow" 
        :footer="null" 
        width="40rem"
        :maskClosable="false"
        :centered="true"
    >
        <template #closeIcon>
            <div class="close_icon" @click.stop="closeModal()"><span class="icon iconfont icon-guanbi"></span></div>
        </template>

        <div class="accessory_replace_content">
            <div class="new_accessory_block">
                <div class="new_accessory_title">New {{othersData?.type}}</div>
                <div class="new_accessory_img_block">
                    <img class="element_img"  :src="othersData?.path">
                    <div class="element_img_loading" v-show="loadingShow">
                        <a-spin :indicator="indicator"/>
                    </div>
                </div>
                <div class="new_accessory_operate_list">
                    <div class="new_accessory_operate_button pervious_button" @click="changeElement('PREV')">Previous</div>
                    <div class="new_accessory_operate_button fetch_button" @click="changeElement('NEXT')">Re-fetch</div>
                </div>
            </div>

             <div class="accessory_color_block" v-show="othersData?.type !== 'Earring' && othersData?.type !== 'Hairstyle'">
                <div class="accessory_color_block_header">Modify Color</div>
                <div class="accessory_color_block_body">
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

            <div class="submit_button" @click="submitOthers()">Submit</div>
        </div>
    </a-modal>
</template>
<script lang="ts">
import { defineComponent,ref,h} from 'vue'
import { Chrome,Slider } from '@ans1998/vue3-color'
import { Https } from "@/tool/https";
import { useStore } from "vuex";
import { LoadingOutlined } from '@ant-design/icons-vue';
export default defineComponent({
    components:{Chrome,Slider},
     setup(){
         let selectColor:any = ref({rgba:{}}) //顔色选择器默认颜色
         let othersData:any = ref({})
         const store = useStore();
        return {
            selectColor,
            othersData,
            store
        }
    },
    data(){
        return{
            loadingShow:false,
            accessoryReplaceShow:false,
            modifyColor:{r:255,g:255,b:255},
            othersIndex:0, //该元素在列表中的索引
            indicator : h(LoadingOutlined, {
                style: {
                    fontSize: '2.4rem',
                },
                spin: true,
            }),
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
    methods:{
         showAccessoryReplaceModal(data:any){
            this.othersData = JSON.parse(JSON.stringify(data.others))
            this.othersIndex = data.index
            this.accessoryReplaceShow = true
            let color = this.othersData.color ? this.othersData.color.split(' ') :''
            this.selectColor = {rgba:{r:color[0],g:color[1],b:color[2]}}
        },

        //关闭弹窗
        closeModal(){
            this.accessoryReplaceShow = false
            this.othersData = {}
            this.othersIndex = 0
        },

        //切换元素
        changeElement(type:string){
            let url = Https.httpUrls.getNextSysElement + `?id=${this.othersData.id}&operateType=${type}&type=${this.othersData.type}`
            this.loadingShow = true
            Https.axiosGet(url).then(
                (rv: any) => {
                    this.othersData.id = rv.id
                    this.othersData.path = rv.path
                    this.loadingShow = false
                }
            ).catch(rv=>{
                this.loadingShow = false
            })
        },

        //提交
        submitOthers(){
            this.othersData.color = this.othersData.color ? `${this.modifyColor.r} ${this.modifyColor.g} ${this.modifyColor.b}` : ''
            let data = {
                others:this.othersData,
                index:this.othersIndex
            }
            this.store.commit('setDesignItemOthers',data)
            this.closeModal()
        }
    }
})
</script>
<style lang="less">
.accessory_replace_modal{

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
        padding: 2rem 1.8rem 3rem;
        box-sizing: border-box;
        background: #F2F3FB;
        overflow-y: hidden;
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

    .accessory_replace_content{

        .new_accessory_block{
             padding: 2rem 2rem 1.2rem;
            background: #ffffff;
            width: 100%;

            .new_accessory_title{
                font-size: 1.6rem;
                line-height: 1.6rem;
                color: #030303;
                margin-bottom: 1.3rem;
            }
            .new_accessory_img_block{
                width: 20rem;
                height: 16rem;
                background: #FFFFFF;
                border: 0.1rem solid #F5F5F5;
                display: flex;
                justify-content: center;
                align-items: center;
                margin:0 auto 1.7rem;
                position: relative;

                .element_img{
                    max-width: 100%;
                    max-height: 100%;
                }

                .element_img_loading{
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    position: absolute;
                    left: 0;
                    top: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

            }

            .new_accessory_operate_list{
                display: flex;
                justify-content: center;

                .new_accessory_operate_button{
                    padding: 0 1.5rem;
                    height: 3.2rem;
                    text-align: center;
                    line-height: 3.2rem;
                    font-size: 1.2rem;
                    cursor: pointer;
                }
                .pervious_button{
                    background: #343579;
                    color: #ffffff;
                    margin-right: 2rem;
                }
                .fetch_button{
                    background: #E6E6F6;
                    color: #343579;
                }
            }
        }

        .accessory_color_block{
            width: 100%;
            background: #FFFFFF;
            padding: 0 2rem;
            margin: 1.3rem 0 1.8rem;

            .accessory_color_block_header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 3.7rem;
                font-size: 1.6rem;
                color: #030303;
            }

            .accessory_color_block_body{
                padding:0 1.5rem 1.5rem;
                display: flex;
                justify-content: space-between;

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
}
</style>
