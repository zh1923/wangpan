<script lang="ts">
import { codeMirrorThemeList, fileSuffixCodeModeMap } from '@/const';
import { BulbOutlined, CloseOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue';
import { Checkbox, Form, FormItem, message, Select, Tooltip } from 'ant-design-vue';
import { defineComponent, ref, useAttrs, reactive } from 'vue';
import Codemirror from "codemirror-editor-vue3";
// import "codemirror-editor-vue3/dist/style.css";
// import "codemirror/mode/nginx/nginx.js"
// import "codemirror/theme/dracula.css"
// import "codemirror/mode/javascript/javascript.js";
import './theme.js' //  codemirror 高亮代码主题
import './mode.js' // codemirror 的解析语言模式
import './fold.js' //  codemirror 的代码折叠功能相关
import 'codemirror/lib/codemirror.css' // codemirror 样式

export default defineComponent({
  components: {
    'a-tooltip': Tooltip,
    'a-form': Form,
    'a-form-item': FormItem,
    'a-select': Select,
    'a-checkbox': Checkbox,
    CloseOutlined,
    BulbOutlined,
    VerticalAlignBottomOutlined,
    Codemirror,
  },
  setup() {
    const { state } = useAttrs() as HomeOptions;

    const codeMirrorText = ref<string>('');
    const originalCodeText = ref<string>('');

    const codeMirrorOptions = reactive<any>({
      tabSize: 4, //  制表符的宽度。默认为 4。
      mode: 'text/html', //  解析当前代码的模式，参考 https://codemirror.net/mode/ 每种语言的示例页面的底部都有对应的 MIME 类型，如果当前文件后缀没有匹配的语言，按照 html 来解析
      theme: 'default', //  代码高亮主题色，其他主题色参考 https://codemirror.net/theme/
      lineNumbers: true, //  是否在编辑器左侧显示行号
      line: true,
      autoCloseBrackets: true, //  自动补全括号
      foldGutter: true, //  创建带有指示可折叠块的标记的装订线
      lineWrapping: true, //  长行处理：false 滚动 | true 换行
      // 额外的装订线
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    });
    const isShow = ref<boolean>(true);
    const fontSizeList = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
    const codeMirrorCustomOptions = ref<any>({
      fontSize: 14,
    });
    const codeMirrorLoading = ref<boolean>(true);

    return {
      state,
      codeMirrorText,
      originalCodeText,
      codeMirrorOptions,
      isShow,
      codeMirrorCustomOptions,
      fontSizeList,
      fileSuffixCodeModeMap,
      codeMirrorThemeList,
      codeMirrorLoading,
    };
  },
  computed: {
    isModify() {
      const { originalCodeText, codeMirrorText } = this as any;
      return originalCodeText !== codeMirrorText;
    },
    fileCodeOptions() {
      let data = [];
      for (let val of fileSuffixCodeModeMap) {
        data.push({
          label: val[1].language,
          value: val[1].mime,
        });
      }
      return data;
    },
  },
  watch: {
    'state.codeEditShow': {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            document.addEventListener('keyup', (e) => {
              if (e.keyCode === 27) {
                this.closeCodePreview();
              }
            });
          });
        } else {
          document.removeEventListener('keyup', (e) => {
            if (e.keyCode === 27) {
              this.closeCodePreview();
            }
          });
        }
      },
    },
  },
  methods: {
    handleModifyFileContent() {
      message.success('保存成功');
    },
    closeCodePreview() {
      this.state.codeEditShow = false;
    },
    /**
     * codemirror 配置项改变时触发
     */
    handleChangeCodeMirrorOption() {
      this.isShow = false;
      this.isShow = true;
    },
  },
});
</script>

<template>
  <div
    class="code-preview-wrapper"
    v-if="state.codeEditShow"
    @keydown.s.ctrl.prevent="handleModifyFileContent"
  >
    <div class="tip-wrapper">
      <div class="name">
        {{ state.codeForm.title }}
        <span class="un-save" v-show="isModify">（未保存）</span>
      </div>
      <div class="editor-preveiw">在线编辑</div>
      <div class="tool-wrapper">
        <a class="item download-link" target="_blank">
          <VerticalAlignBottomOutlined title="下载" />
        </a>
        <a-tooltip effect="dark" placement="bottomRight">
          <template #title>
            操作提示: <br />
            1. 按 Esc 键可退出查看；<br />
            2. 支持在线编辑、保存、下载
          </template>
          <div class="item text-wrapper">
            <span class="text">操作提示</span>
            <BulbOutlined />
          </div>
        </a-tooltip>
        <div class="item text-wrapper">
          <CloseOutlined title="关闭预览" @click="closeCodePreview" />
        </div>
      </div>
    </div>
    <!-- 代码编辑区域 -->
    <div class="code-editor-wrapper">
      <div class="operate-wrapper">
        <i
          class="save-icon iconfont icon-baocun"
          title="保存（ctrl+s）"
          v-show="isModify"
          @click="handleModifyFileContent"
        ></i>
        <a-form
          class="editor-set-form"
          :model="codeMirrorOptions"
          :inline="true"
          size="small"
          label-position="right"
          label-suffix=":"
        >
          <a-form-item label-width="0px" class="line-wrapper">
            <a-checkbox
              v-model:checked="codeMirrorOptions.lineWrapping"
              @change="handleChangeCodeMirrorOption"
              >自动换行</a-checkbox
            >
          </a-form-item>
          <a-form-item label-width="0px" class="font-size">
            <a-select
              v-model:value="codeMirrorCustomOptions.fontSize"
              :options="
                fontSizeList.map((val, index) => {
                  return { label: `${val}px`, value: val };
                })
              "
              filterable
            >
            </a-select>
          </a-form-item>
          <a-form-item label-width="80px" label="代码语言" class="lanaguage">
            <a-select
              v-model:value="codeMirrorOptions.mode"
              filterable
              @change="handleChangeCodeMirrorOption"
              :options="fileCodeOptions"
            >
            </a-select>
          </a-form-item>
          <a-form-item label="主题" label-width="56px" class="theme">
            <a-select
              v-model:value="codeMirrorOptions.theme"
              filterable
              @change="handleChangeCodeMirrorOption"
              :options="
                codeMirrorThemeList.map((val, index) => {
                  return { label: `${val}px`, value: val };
                })
              "
            >
            </a-select>
          </a-form-item>
        </a-form>
      </div>
      <codemirror
        class="code-editor"
        ref="codemirrorRef"
        v-model="codeMirrorText"
        :options="codeMirrorOptions"
        v-if="isShow"
        :style="`font-size: ${codeMirrorCustomOptions.fontSize}px;`"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
@import './index.less';
</style>
