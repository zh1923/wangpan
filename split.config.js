/**
 * 代码抽离
 */
const splitConfig = (config) => {
  config.performance.hints(false);
  config.optimization.splitChunks({
    chunks: 'all',
    minChunks: 1,
    maxInitialRequests: Infinity,
    minSize: 0,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          return `chunk~${packageName.replace('@', '')}`;
        },
      },
    },
  });

  config.optimization.runtimeChunk({
    name: 'runtime',
  });
};

module.exports = { splitConfig };
