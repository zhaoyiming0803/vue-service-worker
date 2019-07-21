const path = require('path');
const resolve = dir => path.resolve(__dirname, '../', dir);

module.exports = {
  build: {
    assetsRoot: resolve('dist'),
    index: resolve('index.html'),
    assetsPublicPath: '/vue-sw/',
    assetsSubDirectory: 'static'
  },
  dev: {
    host: 'localhost',
    port: 8100,
    assetsPublicPath: '/'
  }
};