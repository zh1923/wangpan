<template>
  <div class="report-onlyoffice">
    <div id="placeholder"></div>
  </div>
</template>

<script lang="ts">
import { FileOfficeService } from '@/service';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const docEditor = ref<any>(null);

    const platform = ref<string>('desktop');
    return {
      docEditor,
      platform,
    };
  },
  computed: {
    // 文件信息，来自于路由参数query
    fileInfo() {
      return this.$route.query;
    },
  },
  created() {
    this.judgePlatform();
  },
  mounted() {
    this.$nextTick(() => {
      switch (this.fileInfo.ot) {
        // 添加
        case 'add':
          this.initOnlyoffice();
          break;
        // 编辑
        case 'edit':
          this.editDoc();
          break;
        // 详情
        case 'detail':
          this.showDocDetail();
          break;
      }
    });
  },
  destroyed() {
    this.docEditor.destroyEditor();
  },
  methods: {
    /**
     * 初始化 onlyoffice
     */
    initOnlyoffice() {
      let data = {
        userFileId: this.fileInfo.userFileId,
        fileId: this.fileInfo.fileId,
        fileName: this.fileInfo.fileName,
        filePath: this.fileInfo.filePath,
        fileCategory: this.fileInfo.fileCategory,
        type: this.fileInfo.type,
        memo: this.fileInfo.memo,
      };
      FileOfficeService.edit(data).then((res) => {
        if (res.code === 200) {
          let config = {
            ...res.data.file,
            type: this.platform,
          };
          // config.editorConfig.callbackUrl = config.editorConfig.callbackUrl.replace('/IndexServlet', ONLYOFFICE_BASE_URL + '/IndexServlet')
          this.initDocEditor(res.data.docserviceApiUrl, config);
        }
      });
    },
    /**
     * 初始化文档编辑器
     * @param {string} docserviceApiUrl 文档服务API url
     * @param {object} config 文件相关配置信息
     */
    initDocEditor(docserviceApiUrl: string, config: any) {
      this.loadOnlyOfficeAPI(docserviceApiUrl).then(() => {
        /* global DocsAPI */
        // @ts-expect-error
        this.docEditor = new DocsAPI.DocEditor('placeholder', {
          ...config,
          editorConfig: {
            ...config.editorConfig,
            lang: 'zh', //  语言设置为中文
            customization: {
              ...config.editorConfig.customization,
              zoom: 100, //  缩放比例为 100
            },
          },
        });
      });
    },
    /**
     * 判断当前平台
     */
    judgePlatform() {
      this.platform = 'desktop'; // 浏览平台
      if (
        /AppleWebKit.*Mobile/i.test(navigator.userAgent) ||
        /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(
          navigator.userAgent,
        )
      ) {
        if (window.location.href.indexOf('?mobile') < 0) {
          try {
            if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
              this.platform = 'mobile';
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    },
    /**
     * 展示文档详情
     */
    showDocDetail() {
      let data = {
        id: this.fileInfo.id,
      };
      FileOfficeService.preview(data).then((res) => {
        if (res.success) {
          let config = {
            ...res.data.file,
            type: this.platform,
          };
          config.document.permissions.edit = false; //  预览模式下编辑权限为 false
          this.initDocEditor(res.data.docserviceApiUrl, config);
        }
      });
    },
    /**
     * 编辑文档
     */
    editDoc() {
      let data = {
        id: this.fileInfo.id,
      };
      FileOfficeService.edit(data).then((res) => {
        if (res.success) {
          let config = {
            ...res.data.file,
            type: this.platform,
          };
          config.document.permissions.edit = true; //  预览模式下编辑权限为 false
          this.initDocEditor(res.data.docserviceApiUrl, config);
        }
      });
    },
    /**
     * 加载 onlyoffice api
     * @return {Promise} 返回 api 加载状态
     */
    loadOnlyOfficeAPI(src: string) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        document.body.appendChild(script);
        script.onload = () => {
          resolve('');
        };
        script.onerror = () => {
          reject();
        };
      });
    },
  },
});
</script>

<style lang="less" scoped>
.report-onlyoffice {
  width: 100%;
  height: 100%;
}
#app .main-content {
  width: 100%;
  height: 100%;
}
</style>
