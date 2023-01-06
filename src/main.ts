import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'
import flexible from './tool/flexible.js'
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
import './assets/style/style.less'
import VueLazyload from "vue-lazyload";
flexible()

let loadingParam =  {
    loading: require('./assets/images/homePage/loading.gif'),
    attempt: 1
    }

createApp(App).use(store).use(router).use(Antd).use(VueLazyload,loadingParam).mount('#app')
