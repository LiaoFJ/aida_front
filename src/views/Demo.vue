<template>
    <div class="move_page">
        <div class="move_click">
            <div class="move_click_dian" v-for="i in moveDian" :key="i" :style="{'background':i}" @mousedown="AddDian(i)"></div>
        </div>
        <div class="img_block" ref="imgbox" @mousemove="startMove($event)">
            <img ref="img" src="https://t7.baidu.com/it/u=1956604245,3662848045&fm=193&f=GIF" />
            <!-- <div class="img_mark"></div> -->
            <div class="img_click_dian" v-for="item in imgDian" :key="item" :style="{'background':item.color,left:item.left+'px', top:item.top+'px'}" @mousedown="getMouseDown($event,item)"  @mousemove="startMove($event)"></div>
        </div>
    </div>
</template>

<script>
import { defineComponent,h,ref} from "vue";
export default defineComponent({
    data(){
        return{
            moveDian:['red','yellow'],
            imgDian:[],
            intObj:null,
            startDian:false,
            currentSign:{},
            imgBox:{},
            moveOriginal:{posX: 0, posY: 0}
        }
   },
   mounted(){
     this.imgBox = {
        left : this.$refs.imgbox.offsetLeft,
        top:this.$refs.imgbox.offsetTop,
        scrollTop:this.$refs.scrollTop || 0,
     }

     console.log(this.imgBox)
   },   
   methods:{
        AddDian(color){
            this.startDian = true
            this.intObj = {
                color:color
            }   
            console.log(this.intObj)
        },

        startMove(event){
            let scrollTop = this.$refs.imgbox.scrollTop;
            if(this.intObj){
                this.currentSign.color = this.intObj.color
                this.currentSign.left = event.clientX - this.imgBox.left
                this.currentSign.top =  event.clientY + scrollTop - this.imgBox.top
                this.imgDian.push(this.currentSign)
                console.log(this.currentSign)
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
            let height = this.$refs.imgbox.offsetHeight + this.$refs.imgbox.scrollTop;
            // 2 为签名域的边框
            let maxPosHeight = height - 30
            // console.log(height,maxPosHeight,this.currentSign.pos_params.height)
            let maxPosWidth = this.$refs.imgbox.clientWidth - 30 //+ this.signBox.paddLeft;
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

        getMouseDown(event,item){
            this.currentSign = item
            // 计算出鼠标在签名域上的偏移
            this.moveOriginal.posX = event.offsetX
            // this.moveOriginal.posY = mousedownParam.event.clientY - this.currentSign.pos_params.top - this.signBox.boxTop;
            this.moveOriginal.posY = event.offsetY // 1为边框
            this.startDian = true
        },
     
        getMouseOver(){
            this.startDian = false
            this.currentSign = {}
            document.removeEventListener('mouseup', this.getMouseOver);
            document.removeEventListener('touchend', this.getMouseOver);
        }
   }
})

</script>
<style scoped>
.move_page{
    display: flex;

}
.move_click{
    width: 60px;
}

.move_click_dian{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-bottom: 60px;
    cursor: pointer;
    user-select:none; /* CSS3属性 */
}
.img_block{
    position: relative;
    user-select:none;
    -moz-user-select:none;
    overflow-y: auto;
    background: green;
}
.img_mark{
    width: 1200px;
    height: 600px;
    background: #ccc;
    /* width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0; */
}
img{
    user-select:none;
    -moz-user-select:none;
    width: 700px;
}
.img_click_dian{
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -moz-user-select:none; /* Firefox私有属性 */
    -webkit-user-select:none; /* WebKit内核私有属性 */
    -ms-user-select:none; /* IE私有属性(IE10及以后) */
    -khtml-user-select:none; /* KHTML内核私有属性 */
    -o-user-select:none; /* Opera私有属性 */
    user-select:none; /* CSS3属性 */
    cursor: pointer;
}
</style>
