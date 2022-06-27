import type { RouteRecordRaw } from 'vue-router';
import { Home, OnlyOffice, RecycleBin } from '../view';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: '首页',
    component: () => Promise.resolve(Home),
  },
  {
    path: '/recycle-bin',
    name: '回收站',
    component: () => Promise.resolve(RecycleBin),
  },
  {
    path: '/only-office',
    name: '文件预览',
    component: () => Promise.resolve(OnlyOffice),
  },
];
