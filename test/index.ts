import { routes } from '../src/router';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './index.vue';
import store from '../src/store'


import 'ant-design-vue/dist/antd.less'
// import 'ant-design-vue/dist/antd.css'
import '../src/styles/theme.less';
// import 'ant-design-vue/dist/antd.dark.less'

import "../src/styles/index.less";

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

createApp(App).use(router).use(store).mount('#app');
