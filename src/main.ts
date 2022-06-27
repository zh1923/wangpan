import { routes } from '@/router';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import store from '@/store'


import 'ant-design-vue/dist/antd.less'
// import 'ant-design-vue/dist/antd.css'
import '@/styles/theme.less';
// import 'ant-design-vue/dist/antd.dark.less'

import "@/styles/index.less";

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

createApp(App).use(router).use(store).mount('#app');
