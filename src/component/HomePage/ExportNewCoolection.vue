<template>
    <!-- 生成collention缩略图用的 -->
    <div class="export_new_collection_review">
        <div class="img_block_item" v-if="allBoardData?.moodTemplateId">
            <MoodTemplate :fileList="allBoardData?.moodboardFiles" :moodTemplateId="allBoardData?.moodTemplateId"></MoodTemplate>
        </div>
        <div class="img_block_item" v-else>
            <div class="lager_img_item"  v-for="(mood) in allBoardData.moodboardFiles" :key="mood">
                <div class="all_img_item_block">
                    <img class="all_img_content cover_img" :src="mood.imgUrl" > 
                </div>
            </div>
        </div>

        <div class="img_block_item">
            <div class="small_img_item"  v-for="(print) in allBoardData.printboardFiles" :key="print">
                <div class="all_img_item_block">
                    <img class="all_img_content cover_img" :src="print.imgUrl"> 
                </div>
            </div>
            <div class="small_img_item"  v-for="(generate) in allBoardData.generatePrintFiles" :key="generate">
                <div class="all_img_item_block">
                    <img class="all_img_content cover_img" :src="generate.imgUrl"> 
                </div>
            </div>
        </div>

        <div class="img_block_item">
            <div class="color_item"  v-for="(color) in allBoardData.colorBoards" :key="color">
                <div class="color_content" :style="{background:`rgb(${color?.rgbValue?.r},${color?.rgbValue?.g},${color?.rgbValue?.b})`}"></div>
                <div class="color_content_body">
                    <div class="color_des">{{color.tcx}}</div>
                    <div class="color_des">{{color.name}}</div>
                </div>
            </div>
        </div>

        <div class="img_block_item">
            <div class="lager_img_item"  v-for="(skecth) in allBoardData.skecthboardFiles" :key="skecth">
                <div class="all_img_item_block">
                    <img class="all_img_content" :src="skecth.imgUrl"> 
                </div>
            </div>
        </div>

        <div class="img_block_item">
            <div class="lager_img_item"  v-for="(marketing) in allBoardData.marketingSketchFiles" :key="marketing">
                <div class="all_img_item_block">
                    <img class="all_img_content" :src="marketing.imgUrl"> 
                </div>
            </div>
        </div>

        <div class="img_block_item">
            <div class="lager_img_item"  v-for="(design) in likeDesignCollectionList" :key="design.designItemUrl">
                <div class="all_img_item_block">
                    <img class="all_img_content" :src="design.designItemUrl"> 
                </div>
            </div>
        </div>
        
    </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import MoodTemplate from '@/component/HomePage/MoodTemplate.vue'
import { useStore } from "vuex";
export default defineComponent({
    components:{MoodTemplate},
    setup() {
        const store = useStore();
        let allBoardData:any = computed(()=>{return store.state.UploadFilesModule.allBoardData})
        let likeDesignCollectionList : any = computed(()=>{return store.state.HomeStoreModule.likeDesignCollectionList})
        return {
            allBoardData,
            likeDesignCollectionList,
        }
    }
})
</script>
<style lang="less" scoped>
.export_new_collection_review{
    width: 40.8rem;
    background: #fff;
    position: fixed;
    left: -100rem;
    top: 0;


    .img_block_item{
        margin-bottom: 2rem;

        // &.color_block_item{
        //     padding: 0 0.5rem 0 0.3rem;
        // }

        .lager_img_item{
            display: inline-block;
            width: 20.4rem;
            height: 20.4rem;
            vertical-align: top;
        }

        .sketch_img_item{
            display: inline-block;
            width: 20.4rem;
            height: 42.2rem;
            vertical-align: top;
        }

        .small_img_item{
            width: 6.8rem;
            height: 6.8rem;
            display: inline-block;
            vertical-align: top;
        }
        .color_item{
            display: inline-block;
            vertical-align: top;
            // padding: 0 0.5rem;
            margin-right: 1.6rem;
            margin-bottom: 0.5rem;

            &:nth-child(4n){
                margin-right: 0;
            }
        }

        .color_content{
            width: 9rem;
            height:6.2rem
        }
        .color_content_body{
            width: 9rem;
            padding: 0.7rem 0.2rem;
            background: #FEFEFE;
            border: 1px solid #E6E6E6;

            .color_des{
                font-size: 1rem;
                font-family: Roboto;
                font-weight: 500;
                color: #000000;
                margin-bottom: 0.5rem;
                line-height: 1.3rem;
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                &:last-child{
                    margin-bottom: 0;
                }
            }
        }

        .all_img_item_block{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;

            .all_img_content{
                max-height: 100%;
                max-width: 100%;

                &.cover_img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

}
</style>
