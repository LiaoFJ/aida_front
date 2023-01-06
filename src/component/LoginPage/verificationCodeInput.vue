<template>
  <div id="app">
    <div class="captcha">
      <input v-for="(c, index) in getCtData" :key="index"
        v-model="getCtData[index]" ref="input" 
        @input="e => {onInput(e.target.value, index)}" 
        @keydown.delete="e=>{onKeydown(e.target.value, index)}"
        @focus="onFocus"
        :disabled="loading"
        >
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props:['ct'],
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    getCtData(){
      return this.ct
    },
    ctSize() {
      return this.getCtData.length;
    },
    cIndex() {
      let i = this.getCtData.findIndex(item => item === '');
      i = (i + this.ctSize) % this.ctSize;
      return i;
    },
    lastCode() {
      return this.getCtData[this.ctSize - 1];
    }
  },
  watch: {
    cIndex() {
      this.resetCaret();
    },
    lastCode(val) {
      if (val) {
        this.$refs.input[this.ctSize - 1].blur();
        this.sendCaptcha();
      }
    }
  },
  mounted() {
    this.resetCaret();
  },
  methods: {
    onInput(val, index) {
      val = val.replace(/\D/g, '');
      if (index == this.ctSize - 1) {
        this.getCtData[this.ctSize - 1] = val[0];   // 最后一个码，只允许输入一个字符。
      } else if(val.length > 1) {
        let i = index;
        for (i = index; i < this.ctSize && i - index < val.length; i++) {
          this.getCtData[i] = val[i];
        }
        this.resetCaret();
      }else if(!(val+'')){
        this.getCtData[index] = ''
      }
    },
    // 重置光标位置。
    resetCaret() {
      this.$refs.input[this.ctSize-1].focus();
    },
    onFocus() {
      // 监听 focus 事件，将光标重定位到“第一个空白符的位置”。
      let index = this.getCtData.findIndex(item => item === '');
      index = (index + this.ctSize) % this.ctSize;
      this.$refs.input[index].focus();
    },
    onKeydown(val, index) {
      if (val === '') {
        // 删除上一个input里的值，并对其focus。
        if (index > 0) {
          this.getCtData[index - 1] = '';
          this.$refs.input[index - 1].focus();
        }
      }
    },

    sendCaptcha() {
      let password =  this.getCtData.map(item => item).join('');
      this.$emit('sendCaptcha',password)
    },

    reset() {
      // 重置。一般是验证码错误时触发。
      this.getCtData = this.getCtData.map(item => '');
      this.resetCaret();
    }
  }
})
</script>

<style scoped lang="less">
.captcha {
  display: flex;
  justify-content: space-between;
}
input {
  width: 4.8rem;
  height: 4.8rem;
  border: 0.1rem solid #B4BED7;
  border-radius: 0.8rem;
  text-align: center;
  font-size: 2.4rem;
  line-height: 4.8rem;
  outline: none;
}
input:last-of-type {
  margin-right: 0;
}
input:disabled {
  color: #000;
  background-color: #fff;
}
.msg {
  text-align: center;
}

</style>
