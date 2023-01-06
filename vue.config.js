const {defineConfig} = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  lintOnSave:false,//关闭语法检查
  devServer: {
    // hot: true, // 热更新
    port: '8060',
    proxy: {
      "/api": {
        target: 'https://www.aida.com.hk', //后端接口地址
        changeOrigin: true, //是否允许跨越
      }
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 存放less变量文件的路径
        path.resolve(__dirname, "./src/assets/style/style.less")

      ]

    }

  },

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#ec6800'
          },
          javascriptEnabled: true,
        },

      },

    },

  }
})