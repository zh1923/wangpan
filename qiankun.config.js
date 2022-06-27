/**
 * qiankun 处理静态资源
 */
const qiankunConfig = (config, APP_ID) => {
  // https://github.com/neutrinojs/webpack-chain
  config.output
    .library(`${APP_ID}-[name]`)
    .libraryTarget('umd')
    .jsonpFunction(`webpackJsonp_${APP_ID}`);

  config.module.rule('fonts').use('url-loader').loader('url-loader').options({}).end();

  config.module.rule('images').use('url-loader').loader('url-loader').options({}).end();
};

module.exports = { qiankunConfig };
