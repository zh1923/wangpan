import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}

export default () => {
  return defineConfig({
    envPrefix: 'VUE_',
    root: './test',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': pathResolve('src'),
        _c: pathResolve('src'),
        _public: pathResolve('public'),
      },
    },
    optimizeDeps: {
      include: ['axios'],
    },
    server: {
      cors: true,
      host: true, // 本机的局域网IP
      port: 9528, // 端口号，一般情况下为8080
      proxy: {
        '/api': {
          target: 'http://micro.gz-zhiyun.com', //代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  });
};
