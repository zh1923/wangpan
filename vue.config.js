const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { qiankunConfig } = require('./qiankun.config');
const { splitConfig } = require('./split.config');

const { VUE_APP_ID, VUE_APP_NAME, ANALYZER } = process.env;

const plugins = [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)];

if (ANALYZER) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  publicPath: `/apps/${VUE_APP_ID}`,

  lintOnSave: false,
  productionSourceMap: false,

  css: {
    loaderOptions: {
      less: {
        sourceMap: false,
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },

  configureWebpack: {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        './@': path.resolve(__dirname, 'src'),
        '../@': path.resolve(__dirname, 'src'),
      },
    },
  },

  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      // eslint-disable-next-line no-param-reassign
      args[0].title = VUE_APP_NAME;
      return args;
    });

    splitConfig(config);

    qiankunConfig(config, VUE_APP_ID);
  },
};
