
const port = 7651; // dev port
// let prependDataStr = Object.keys(styleVariables)
//   .map(k => `\$${k.replace(/_/g, '-')}: ${styleVariables[k]};`)
//   .join('\n');

  const path = require('path');
  const { name } = require('./package');
  const devConfig = require('../../scripts/devConfig');
  
  function resolve(dir) {
    return path.join(__dirname, dir);
  }  

module.exports = {
  lintOnSave: false,
  // publicPath: './',
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  css: {
    loaderOptions: {
      sass: {
        // prependData: '@import "@/assets/css/variable.scss";@import "@/assets/css/max-variable.scss";'
        // prependData: Object.keys(styleVariables)
        //   .map(k => `\$${k.replace('_', '-')}: ${styleVariables[k]};`)
        //   .join('\n')
      }
    }
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      symlinks: true,
      alias: {
        '@': resolve('src')
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: '@gwi/queue',
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    },
    module:devConfig.module
  }
};