<template>
      <a-modal class="modal_component cut_pricture_modal" 
        v-model:visible="cutPicuterModal" 
        :footer="null" 
        title="Cut picture"
        width="115rem"
        :maskClosable="false"
        :centered="true"
    >
        <template #closeIcon>
            <div class="header_right_block" @click.stop="">
                <div class="next_step_button" @click.stop="finishCropper()">Finish</div>
                <div class="header_cancel_button" @click.stop="cancleCropper()">Cancel</div>
            </div>
        </template>
        <div class="collection_modal_body">
            <div class="cut_picture_left">
                <div class="cut_picture_body">
                    <VueCropper
                        ref="cropper"
                        :original="option.original"
                        :img="option.img"
                        :outputSize="option.size"
                        :outputType="option.outputType"
                        :auto-crop="option.autoCrop"
                        :auto-crop-width="option.autoCropWidth"
                        :auto-crop-height="option.autoCropHeight"
                        :center-box="option.centerBox"
                        :can-move="option.canMove" :can-move-box="option.canMoveBox" 
                        @real-time="realTime"
                    ></VueCropper>
                </div>
                <div class="cur_picture_opterate">
                    <div class="cur_picture_opterate_item" @click="rotateLeft()"><span class="icon iconfont icon-chexiao operate_icon"></span></div>
                    <div class="cur_picture_opterate_item" @click="rotateRight()"><span class="icon iconfont icon-chexiao operate_icon icon_chexiao_sec"></span></div>
                    <div class="cur_picture_opterate_item" @click="changeScale(-1)"><span class="operate_icon icon_font">-</span></div>
                    <div class="cur_picture_opterate_item" @click="changeScale(1)"><span class="operate_icon icon_font">+</span></div>
                    <div class="cur_picture_opterate_item" @click="refreshCrop()"><span class="icon iconfont icon-shuaxin operate_icon"></span></div>
                </div>
            </div>
            <div class="cut_picture_right">
                <div class="cur_picture_right_header">
                    <div class="review_logo icon iconfont icon-yulan"></div>
                    <div>Crop Preview</div>
                </div>
                <div class="cut_picture_review_block">
                    <div class="cut_picture_review_item">
                        <div class="cut_picture_review_content" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden'}">
                            <div :style="previews.div" >
                                <img class="previews_image" :style="previews.img" :src="previews.url">    
                            </div>
                        </div>
                    </div>
                    <div class="cut_picture_review_item">
                        <div class="cut_picture_review_block_sec" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden'}">
                                <div :style="previews.div" >
                                <img class="previews_image" :style="previews.img" :src="previews.url">    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
import {base64toFile} from '@/tool/util'
export default defineComponent({
    props:['cropperFileData','isUpload'],
    components:{
        VueCropper,
    },
     data(){
        return {
            cutPicuterModal:false,
            option: {
                original:false,
                img: '',
                size: 1,
                full: false,
                outputType: 'png',
                autoCrop: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 360,
                autoCropHeight: 360,
                max: 99999,
                centerBox:true,
                canMove:true,
                canMoveBox:true,
            },
            previews:{},
        }
    },
    methods:{

        rotateLeft() {
            let cropper:any = this.$refs.cropper
            cropper.rotateLeft();
        },
        rotateRight() {
            let cropper:any = this.$refs.cropper
            cropper.rotateRight();
        },
        refreshCrop() {
            let cropper:any = this.$refs.cropper
            cropper.refresh();
        },
        
        changeScale(num:any) {
            num = num || 1;
            let cropper:any = this.$refs.cropper
            cropper.changeScale(num);
        },
        // 实时预览函数
        realTime(data:any) {
            this.previews = data;
        },

        getOptionImg(img:any){
            this.option.img = img
        },

        changeShowModal(type:any){
            this.cutPicuterModal = type
        },

        finishCropper(){
            let cropper:any = this.$refs.cropper,
                that = this
            cropper.getCropData((data:any) => {
            // 转换为File对象
                let file = base64toFile(data,this.cropperFileData.name);
                this.$emit('handleCropperSuccess',{file:file, fileData:this.cropperFileData})
            })
        },

        closeCropper(){
            this.cutPicuterModal = false
            this.option.img = ''
        },

        cancleCropper(){
            this.cutPicuterModal = false
            this.option.img = ''
            this.$emit('closeCropper')
        }

    }
})
</script>
<style lang="less" scoped>
.cut_pricture_modal{
    .header_right_block{
        display: flex;
        align-items: center;
        position: absolute;
        right: 2.1rem;
        height: 100%;

        .next_step_button{
            padding:  0 1.2rem;
            height: 3.2rem;
            background: linear-gradient(160deg, #AC2A3B, #292161);
            border-radius: 1.6rem;
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
            border-radius: 1.6rem;
            font-size: 1.4rem;
            color: #030303;
            line-height: 3.2rem;
            white-space: nowrap;
            cursor: pointer;
        }
    }

    .collection_modal_body{
        height: 100%;
        padding: 1rem 2.5rem 1.4rem 1.4rem;
        box-sizing: border-box;
        background: #F2F3FB;
        display: flex;
        justify-content: space-between;

        .cut_picture_left{
            width: 70.7rem;
            height: 100%;
            background: #fff;
            border-radius: 2rem;
            padding: 1.3rem 1.3rem 2rem;
            box-sizing: border-box;

            .cut_picture_body{
                width: 100%;
                height: 53rem;
                background: yellow;
            }

            .cur_picture_opterate{
                margin: 2.7rem auto 0;
                border-radius: 1.6rem;
                display: flex;
                overflow: hidden;
                border: 1px solid #E2E2E4;
                width: 24rem;

                .cur_picture_opterate_item{
                    width: 4.7rem;
                    height: 4rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: 0.1rem solid #E6E8EA;
                    cursor: pointer;

                    .icon_chexiao_sec{
                        transform: rotateY(180deg);   /* 垂直镜像翻转 */
                    }

                    .operate_icon{
                        font-size: 1.8rem;
                        color: rgba(102, 102, 102, 1);
                        font-weight: bold;
                    }

                    .icon_font{
                        font-size: 2.5rem;
                        position: relative;
                        top: -0.3rem;
                        user-select:none;
                    }

                    .icon-shuaxin{
                        font-size: 1.4rem;
                    }

                    &:last-child{
                        border: none;
                    }
                }
            }
        }

        .cut_picture_right{
            width: 39.2rem;
            height: 100%;
            background: #fff;
            border-radius: 2rem;

            .cur_picture_right_header{
                padding: 2rem;
                display: flex;
                align-items: center;
                font-size: 1.6rem;
                font-weight: 400;
                color: #030303;
                line-height: 1.8rem;
                font-weight: bold;

                .review_logo{
                    font-size: 1.8rem;
                    color: #333;
                    margin-right: 1rem;
                }
            }

            .cut_picture_review_block{
                width: 100%;
                padding: 0 2rem;
                height: calc(100% - 5.8rem);

                .cut_picture_review_item{
                    width: 100%;
                    height: 50%;
                    position: relative;

                    .cut_picture_review_content{
                        transform-origin: 0 0;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: scale(0.45) translate(-50%, -50%);
                        background: rgba(91,94,105,0.8);
                        box-shadow: 0 0.2rem 0.5rem 0 rgba(216,213,239,0.3);
                        border-radius: 1rem;
                    }

                    .cut_picture_review_block_sec{
                        transform-origin: 0 0;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: scale(0.45) translate(-50%, -50%);
                        border-radius: 100%;
                        background: rgba(91,94,105,0.8);
                        box-shadow: 0 0.2rem 0.5rem 0 rgba(216,213,239,0.3);
                    }

                }
            }
        }
    }
}
</style>
