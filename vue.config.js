const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: true,
  lintOnSave:false,
  configureWebpack: {
    resolve: {
      alias: {
        'assets':'@/assets',
        'components':'@/components',
        'network':'@/network',
        'views':'@/views',
        'store':'@/store',
        'router':'@/router',
        'untils':'@/untils',
        'style':'@/style',
      },
    },
  },
}
