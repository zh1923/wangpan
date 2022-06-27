/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module 'mockjs';
declare module 'spark-md5';
declare module 'lodash';
declare module 'vue-codemirror';
