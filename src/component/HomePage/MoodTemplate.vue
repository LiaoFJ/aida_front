<template>
    <div class="mood_template_component">
        <div class="mood_template_item template_three" v-show="moodTemplateId == 3">
            <div class="img_template three_1" :style="{backgroundImage:`url(${fileList[0]?.imgUrl})`}"></div>
            <div class="img_template three_2" :style="{backgroundImage:`url(${fileList[1]?.imgUrl})`}"></div>
            <div class="img_template three_1" :style="{backgroundImage:`url(${fileList[2]?.imgUrl})`}"></div>
        </div>
        <div class="mood_template_item template_four" v-show="moodTemplateId == 4">
            <div class="img_template four_1" :style="{backgroundImage:`url(${fileList[0]?.imgUrl})`}"></div>
            <div class="img_template four_2" :style="{backgroundImage:`url(${fileList[1]?.imgUrl})`}"></div>
            <div class="img_template four_3" :style="{backgroundImage:`url(${fileList[2]?.imgUrl})`}"></div>
            <div class="img_template four_4" :style="{backgroundImage:`url(${fileList[3]?.imgUrl})`}"></div>
        </div>
        <div class="mood_template_item template_five" v-show="moodTemplateId == 5">
            <div class="img_template five_1" :style="{backgroundImage:`url(${fileList[0]?.imgUrl})`}"></div>
            <div class="img_template five_2" :style="{backgroundImage:`url(${fileList[1]?.imgUrl})`}"></div>
            <div class="img_template five_3" :style="{backgroundImage:`url(${fileList[2]?.imgUrl})`}"></div>
            <div class="img_template five_4" :style="{backgroundImage:`url(${fileList[3]?.imgUrl})`}"></div>
            <div class="img_template five_5" :style="{backgroundImage:`url(${fileList[4]?.imgUrl})`}"></div>
        </div>
        <div class="mood_template_item template_six" v-show="moodTemplateId == 6">
            <div class="img_template six_1" :style="{backgroundImage:`url(${fileList[0]?.imgUrl})`}"></div>
            <div class="img_template six_2" :style="{backgroundImage:`url(${fileList[1]?.imgUrl})`}"></div>
            <div class="img_template six_3" :style="{backgroundImage:`url(${fileList[2]?.imgUrl})`}"></div>
            <div class="img_template six_4" :style="{backgroundImage:`url(${fileList[3]?.imgUrl})`}"></div>
            <div class="img_template six_5" :style="{backgroundImage:`url(${fileList[4]?.imgUrl})`}"></div>
            <div class="img_template six_6" :style="{backgroundImage:`url(${fileList[5]?.imgUrl})`}"></div>
        </div>
        <div class="mood_template_item template_seven" v-show="moodTemplateId == 7">
            <div class="img_template seven_1" :style="{backgroundImage:`url(${fileList[0]?.imgUrl})`}"></div>
            <div class="img_template seven_2" :style="{backgroundImage:`url(${fileList[1]?.imgUrl})`}"></div>
            <div class="img_template seven_3" :style="{backgroundImage:`url(${fileList[2]?.imgUrl})`}"></div>
            <div class="img_template seven_4" :style="{backgroundImage:`url(${fileList[3]?.imgUrl})`}"></div>
            <div class="img_template seven_5" :style="{backgroundImage:`url(${fileList[4]?.imgUrl})`}"></div>
            <div class="img_template seven_6" :style="{backgroundImage:`url(${fileList[5]?.imgUrl})`}"></div>
            <div class="img_template seven_7" :style="{backgroundImage:`url(${fileList[6]?.imgUrl})`}"></div>
        </div>
        <div class="mood_template_item template_eight" v-show="moodTemplateId == 8">
            <div class="img_template eight_1" :style="{backgroundImage:`url(${fileList[0]?.imgUrl})`}"></div>
            <div class="img_template eight_2" :style="{backgroundImage:`url(${fileList[1]?.imgUrl})`}"></div>
            <div class="img_template eight_3" :style="{backgroundImage:`url(${fileList[2]?.imgUrl})`}"></div>
            <div class="img_template eight_4" :style="{backgroundImage:`url(${fileList[3]?.imgUrl})`}"></div>
            <div class="img_template eight_5" :style="{backgroundImage:`url(${fileList[4]?.imgUrl})`}"></div>
            <div class="img_template eight_6" :style="{backgroundImage:`url(${fileList[5]?.imgUrl})`}"></div>
            <div class="img_template eight_7" :style="{backgroundImage:`url(${fileList[6]?.imgUrl})`}"></div>
            <div class="img_template eight_8" :style="{backgroundImage:`url(${fileList[7]?.imgUrl})`}"></div>
        </div>
        <div class="mood_template_item template_nine" v-show="moodTemplateId == 9">
            <div class="img_template nine_1" :style="{backgroundImage:`url(${fileList[0]?.imgUrl})`}"></div>
            <div class="img_template nine_2" :style="{backgroundImage:`url(${fileList[1]?.imgUrl})`}"></div>
            <div class="img_template nine_3" :style="{backgroundImage:`url(${fileList[2]?.imgUrl})`}"></div>
            <div class="img_template nine_4" :style="{backgroundImage:`url(${fileList[3]?.imgUrl})`}"></div>
            <div class="img_template nine_5" :style="{backgroundImage:`url(${fileList[4]?.imgUrl})`}"></div>
            <div class="img_template nine_6" :style="{backgroundImage:`url(${fileList[5]?.imgUrl})`}"></div>
            <div class="img_template nine_7" :style="{backgroundImage:`url(${fileList[6]?.imgUrl})`}"></div>
            <div class="img_template nine_8" :style="{backgroundImage:`url(${fileList[7]?.imgUrl})`}"></div>
            <div class="img_template nine_9" :style="{backgroundImage:`url(${fileList[8]?.imgUrl})`}"></div>
        </div>
        <div class="mood_template_item template_ten" v-show="moodTemplateId == 10">
            <div class="img_template ten_1" :style="{backgroundImage:`url(${fileList[0]?.imgUrl})`}"></div>
            <div class="img_template ten_2" :style="{backgroundImage:`url(${fileList[1]?.imgUrl})`}"></div>
            <div class="img_template ten_3" :style="{backgroundImage:`url(${fileList[2]?.imgUrl})`}"></div>
            <div class="img_template ten_4" :style="{backgroundImage:`url(${fileList[3]?.imgUrl})`}"></div>
            <div class="img_template ten_5" :style="{backgroundImage:`url(${fileList[4]?.imgUrl})`}"></div>
            <div class="img_template ten_6" :style="{backgroundImage:`url(${fileList[5]?.imgUrl})`}"></div>
            <div class="img_template ten_7" :style="{backgroundImage:`url(${fileList[6]?.imgUrl})`}"></div>
            <div class="img_template ten_8" :style="{backgroundImage:`url(${fileList[7]?.imgUrl})`}"></div>
            <div class="img_template ten_9" :style="{backgroundImage:`url(${fileList[8]?.imgUrl})`}"></div>
            <div class="img_template ten_10" :style="{backgroundImage:`url(${fileList[9]?.imgUrl})`}"></div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props:['fileList','moodTemplateId'],
    setup() {
        
    },
})
</script>
<style lang="less" scoped>
.mood_template_component{
    width: 40.8rem;
    background: #fff;

    .mood_template_item{
        width: 100%;
        position: relative;
    }
    .template_three{
        height: 18.7rem;
        display: flex;

        .img_template{
            position: relative;
        }

        .three_1{
            width: 10.2rem;
            height: 100%;
        }
        .three_2{
            width: 19.6rem;
            margin: 0 0.4rem;
        }
    }

    .template_four{
        height: 21.1rem;

        .four_1{
            left: 0;
            top: 0;
            width: 20.1rem;
            height: 10.7rem;
        }

        .four_2{
            left: 0;
            top: 11.1rem;
            width: 9.6rem;
            height: 10rem;
        }
        .four_3{
            left: 9.9rem;
            top: 11.1rem;
            width: 10.2rem;
            height: 10rem;
        }
        .four_4{
            right: 0;
            top: 0;
            width: 20.1rem;
            height: 21.1rem;
        }
    }

    .template_five{
        height: 24.2rem;

        .five_1{
            left: 0;
            top: 0;
            width: 15.2rem;
            height: 15.3rem;
        }
        .five_2{
            left: 0;
            top: 15.3rem;
            width: 15.2rem;
            height: 8.7rem;
        }
        .five_3{
            left: 15.2rem;
            top: 0;
            width: 14.5rem;
            height: 24rem;
        }
        .five_4{
            right: 0;
            top: 0;
            width: 11.1rem;
            height: 12rem;
        }
        .five_5{
            right: 0;
            top: 12rem;
            width: 11.1rem;
            height: 12rem;
        }
    }

    .template_six{
        height: 27.4rem;

        .six_1{
            left: 0;
            top: 0;
            width: 13.4rem;
            height: 13.8rem;
        }
        .six_2{
            left: 0;
            top: 13.8rem;
            width: 14.3rem;
            height: 13.6rem;
        }
        .six_3{
            left: 13.4rem;
            top: 0;
            width: 13.9rem;
            height: 13.8rem;
        }
        .six_4{
            left: 14.3rem;
            top: 13.8rem;
            width: 18.6rem;
            height: 13.6rem;
        }
        .six_5{
            right: 0;
            top: 0;
            width: 13.5rem;
            height: 13.8rem;
        }
        .six_6{
            right: 0;
            top: 13.8rem;
            width: 7.9rem;
            height: 13.6rem;
        }
    }

    .template_seven{
        height: 21rem;

        .seven_1{
            left: 0;
            top: 0;
            width: 7.3rem;
            height: 7.6rem;
        }
        .seven_2{
            left: 0;
            top: 7.5rem;
            width: 7.3rem;
            height: 13.2rem;
        }
        .seven_3{
            left: 7.5rem;
            top: 0;
            width: 12.1rem;
            height: 11.7rem;
        }
        .seven_4{
            left: 7.5rem;
            top: 11.9rem;
            width: 12.1rem;
            height: 9.1rem;
        }
        .seven_5{
            left: 19.7rem;
            top: 0;
            width: 10.4rem;
            height: 10.1rem;
        }
        .seven_6{
            left: 19.7rem;
            top: 10.3rem;
            width: 10.4rem;
            height: 10.7rem;
        }
        .seven_7{
            right: 0;
            top: 0;
            width: 10.6rem;
            height: 21rem;
        }
    }
    
    .template_eight{
        height: 24.9rem;

        .eight_1{
            left: 0;
            top: 0;
            width: 8.5rem;
            height: 9.1rem;
        }
        .eight_2{
            left: 0;
            top: 9.3rem;
            width: 8.5rem;
            height: 15.5rem;
        }
        .eight_3{
            left: 8.7rem;
            top: 0;
            width: 13.8rem;
            height: 13.8rem;
        }
        .eight_4{
            left: 8.7rem;
            top: 14rem;
            width: 10.9rem;
            height: 10.8rem;
        }
        .eight_5{
            left: 19.8rem;
            top: 14rem;
            width: 4.9rem;
            height: 10.8rem;
        }
        .eight_6{
            right: 0;
            top: 0;
            width: 18.1rem;
            height: 13.8rem;
        }
        .eight_7{
            left: 24.9rem;
            top: 14rem;
            width: 10.5rem;
            height: 10.8rem;
        }
        .eight_8{
            right: 0;
            top: 14rem;
            width: 5.2rem;
            height: 10.8rem;
        }
    }

    .template_nine{
        height: 19.3rem;

        .nine_1{
            left: 0;
            top: 0;
            width: 6rem;
            height: 6.4rem;
        }
        .nine_2{
            left: 0;
            top: 6.6rem;
            width: 6rem;
            height: 12.5rem;
        }
        .nine_3{
            left: 6.3rem;
            top: 0;
            width: 10.2rem;
            height: 19.1rem;
        }
        .nine_4{
            left: 16.7rem;
            top: 0;
            width: 5.9rem;
            height: 5.8rem;
        }
        .nine_5{
            left: 16.7rem;
            top: 5.9rem;
            width: 5.9rem;
            height: 13.2rem;
        }
        .nine_6{
            left: 22.7rem;
            top: 0;
            width: 9.3rem;
            height: 9.4rem;
        }
        .nine_7{
            left: 22.7rem;
            top: 9.5rem;
            width: 9.3rem;
            height: 9.6rem;
        }
        .nine_8{
            right: 0;
            top: 0;
            width: 8.7rem;
            height: 6.7rem;
        }
        .nine_9{
            right: 0;
            top: 6.8rem;
            width: 8.7rem;
            height: 12.3rem;
        }
    }

    .template_ten{
        height: 21.2rem;

        .ten_1{
            left: 0;
            top: 0;
            width: 9.9rem;
            height: 10.6rem;
        }
        .ten_2{
            left: 0;
            top: 10.8rem;
            width: 9.9rem;
            height: 10.4rem;
        }
        .ten_3{
            left: 10rem;
            top: 0;
            width: 9.9rem;
            height: 21.2rem;
        }
        .ten_4{
            left: 20rem;
            top: 0;
            width: 8.1rem;
            height: 15rem;
        }
        .ten_5{
            left: 20rem;
            top: 15.3rem;
            width: 8.1rem;
            height: 5.9rem;
        }
        .ten_6{
            left:28.2rem;
            top: 0;
            width: 6.4rem;
            height: 6.3rem;
        }
        .ten_7{
            left:28.2rem;
            top: 6.4rem;
            width: 6.4rem;
            height: 14.7rem;
        }
        .ten_8{
            right: 0;
            top: 0;
            width: 6.1rem;
            height: 6rem;
        }
        .ten_9{
            right: 0;
            top: 6.2rem;
            width: 6.1rem;
            height: 6.1rem;
        }
        .ten_10{
            right: 0;
            top: 12.5rem;
            width: 6.1rem;
            height: 8.7rem;
        }
    }
    .img_template{
        position: absolute;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
}
</style>