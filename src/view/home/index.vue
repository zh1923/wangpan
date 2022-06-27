<script lang="ts">
import { codePreview } from '@/components';
import { fileSuffixCodeModeMap, imageType, MenuList, officeFileType, SERVER } from '@/const';
import { FileManageService, FileOfficeService } from '@/service';
import { computeMD5, handleImageUrl } from '@/utils';
import {
  AppstoreOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DragOutlined,
  EditOutlined,
  EllipsisOutlined,
  FolderAddOutlined,
  FormOutlined,
  MenuOutlined,
  ShareAltOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue';
import { YesNo } from '@micros-common-vue/enum';
import { UserUtil } from '@micros-common-vue/util';
import {
  Button,
  Dropdown,
  Empty,
  Image,
  Input,
  InputSearch,
  Menu,
  MenuItem,
  message,
  Spin,
  Upload,
} from 'ant-design-vue';
import moment from 'moment';
import { defineComponent, nextTick, reactive, ref, useAttrs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { List, Table } from './component';
import { moveCopyModal, removeModal } from './modal';

export default defineComponent({
  components: {
    Input,
    'a-button': Button,
    InputSearch,
    'a-dropdown': Dropdown,
    'a-menu': Menu,
    'a-empty': Empty,
    'a-spin': Spin,
    'a-upload': Upload,
    'a-image': Image,
    MenuItem,
    UploadOutlined,
    FolderAddOutlined,
    MenuOutlined,
    AppstoreOutlined,
    ShareAltOutlined,
    DownloadOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    DragOutlined,
    CopyOutlined,
    FormOutlined,
    EditOutlined,
    'z-table': Table,
    'z-list': List,
    removeModal,
    moveCopyModal,
    codePreview,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { transferState } = useAttrs() as TransferOptions;

    const visible = ref<boolean>(false);
    const previewImg = ref<string>('111');

    const setVisible = (value: boolean): void => {
      visible.value = value;
    };

    const timer = ref<any>(null);

    const onSearch = (isRoll?: boolean, isCategory?: boolean, isSearch?: boolean) => {
      if (!timer.value || isCategory) {
        timer.value = setTimeout(() => {
          clearTimeout(timer);
          timer.value = null;
        }, 1000);
        return new Promise(async (resolve) => {
          state.loading = true;
          let res;
          if (!isSearch) {
            state.searchContent = undefined;
            state.isSearch = false;
            res = await FileManageService.page({
              filePath:
                !route.query.category || route.query.category === 'all'
                  ? state.path && state.path.length > 0
                    ? '/' + state.path.join('/')
                    : '/'
                  : undefined,
              fileType:
                route.query.category && route.query.category !== 'all'
                  ? route.query.category
                  : undefined,
              pageSize: 100,
              current: state.currentPage,
            });
          } else {
            state.isSearch = true;
            if (!state.searchContent) {
              message.error('请输入搜索词');
              state.loading = false;
              return false;
            }
            res = await FileManageService.search({
              fileName: state.searchContent,
              pageSize: 100,
              current: state.currentPage,
            });
          }

          if (res?.success) {
            state.total = res.data.total;
            state.indeterminate = false;
            state.checkAll = false;
            state.checkItem = [];
            if (isRoll) {
              state.mockData.push(
                ...(res.data?.records?.map((val: FilePageVO) => {
                  const fileIndex = val.filePath.split('/');
                  const showPath = fileIndex?.[fileIndex.length - 1];
                  return {
                    ...val,
                    edit: false,
                    newFileName: '',
                    showPath: showPath && showPath !== '' ? showPath : '全部文件',
                  };
                }) ?? []),
              );
            } else {
              state.mockData =
                res.data?.records?.map((val: FilePageVO) => {
                  const fileIndex = val.filePath.split('/');
                  const showPath = fileIndex?.[fileIndex.length - 1];
                  return {
                    ...val,
                    edit: false,
                    newFileName: '',
                    showPath: showPath && showPath !== '' ? showPath : '全部文件',
                  };
                }) ?? [];
            }
          }
          resolve(res);
          state.loading = false;
        });
      }
    };

    const checkboxItem = () => {
      findList.value = [];

      nextTick(() => {
        state.indeterminate =
          state.checkItem.length > 0 && state.checkItem.length < state.mockData.length;
        state.checkAll = state.checkItem.length === state.mockData.length;
        if (state.checkItem.length === 1) {
          getDetail();
        } else {
          findData.value = {};
        }
      });
    };

    const checkboxAll = () => {
      findList.value = [];
      nextTick(() => {
        state.indeterminate = false;
        state.checkItem = state.checkAll ? state.mockData.map((val) => val.id ?? '') : [];
        if (state.checkItem.length === 1) {
          getDetail();
        } else {
          findData.value = {};
        }
      });
    };
    const clearCheck = () => {
      state.indeterminate = false;
      state.checkAll = false;
      state.checkItem = [];
    };

    const rename = (item: Partial<FilePageVO>) => {
      state.mockData.map((val) => {
        val.edit = false;
      });
      item.newFileName = item.fileName;
      item.edit = true;
    };

    const cancelRename = (item?: Partial<FilePageVO>) => {
      if (item) {
        item.newFileName = '';
        item.edit = false;
      } else {
        state.isFolder = false;
        state.folderForm = {};
      }
    };

    const confirmRename = async (item?: Partial<FilePageVO>) => {
      if (item) {
        item.fileName = item.newFileName;
        let res = await FileManageService.rename({
          fileName: item.newFileName,
          id: item.id,
        });

        if (res && res.success) {
          message.success('重命名成功');
          await onSearch();
          cancelRename(item);
        }
      } else {
        let res = await FileManageService.create({
          fileName: state.folderForm.name,
          filePath: state.path && state.path.length > 0 ? `/${state.path.join('/')}` : '/',
        });

        if (res && res.success) {
          message.success('新建文件夹成功');
          await onSearch();
          cancelRename();
        }
      }
    };

    const addFolder = () => {
      state.isFolder = true;
      state.folderForm.time = moment().format('YYYY-MM-DD HH:mm:ss');
    };

    const fileOperation = (operationType: 'move' | 'copy' | 'delete', item?: Partial<DataType>) => {
      fileOperState.operId = item ? item.id : undefined;
      fileOperState.operationType = operationType;
      if (operationType === 'delete') {
        fileOperState.removeShowModal = true;
      } else {
        fileOperState.moveCopyShowModal = true;
      }
    };

    const fileOperationConfirm = (
      operationType: 'move' | 'copy' | 'delete',
      filePath?: string[],
    ) => {
      fileOperState.loading = true;
      FileManageService.save(fileOperState.operId ? [fileOperState.operId] : state.checkItem, {
        opera: operationType,
        filePath: filePath
          ? '/' + filePath?.filter((val, index) => index !== 0).join('/')
          : undefined,
      })
        .then((res) => {
          if (res && res.success) {
            fileOperState.removeShowModal = false;
            fileOperState.moveCopyShowModal = false;
            onSearch();
            message.success('操作成功');
          }
        })
        .finally(() => (fileOperState.loading = false));
    };

    const jump = (item: Partial<FilePageVO>, isEdit?: boolean) => {
      if (item.isDir === YesNo.YES) {
        state.path.push(item.fileName ?? '');
        const query = JSON.parse(JSON.stringify(route.query));
        query.path = state.path.join();
        query.category = 'all';
        router.push({
          path: route.path,
          query,
        });
        clearCheck();
      } else if (imageType.includes(item.extendName ?? '') && item.id) {
        setVisible(true);
        previewImg.value = `/api${SERVER}/file/transfer/preview?id=${item.id}&isMin=false`;
      } else if (
        fileSuffixCodeModeMap.has(item.extendName ?? '') ||
        (item.isDir === YesNo.NO && !item.extendName)
      ) {
        state.codeEditShow = true;
      } else if (officeFileType.includes(item.extendName ?? '') && item.id) {
        FileOfficeService.preview({
          id: item.id,
        }).then((res) => {
          const { href } = router.resolve({
            path: '/only-office',
            query: {
              ot: !isEdit ? 'detail' : 'edit',
              id: item.id,
            },
          });
          window.open(href, '_blank');
          // if (res.success) {
          //   window.open(res.data.file.editorConfig.callbackUrl);
          // }
        });
      }
    };

    const goBackPath = (index?: number) => {
      const query = JSON.parse(JSON.stringify(route.query));
      if (index !== undefined) {
        state.path.splice(index + 1);
      } else {
        state.path = [];
      }
      query.path = state.path.join();
      router.push({
        path: route.path,
        query,
      });
      if (state.isSearch) {
        nextTick(() => {
          onSearch(false, false, false);
        });
      }
      clearCheck();
    };

    const goBackLevel = () => {
      if (state.isSearch) {
        nextTick(() => {
          onSearch(false, false, false);
        });
      } else {
        const query = JSON.parse(JSON.stringify(route.query));
        state.path.splice(state.path.length - 1);
        query.path = state.path.join();
        router.push({
          path: route.path,
          query,
        });
      }

      clearCheck();
    };

    const beforeUpload = (file: any) => {
      let uploadTime: any;
      transferState.showModal = true;
      if (transferState.limitNumber < 5) {
        transferState.limitNumber++;
        clearInterval(uploadTime);
        uploadTime = null;
        computeMD5(file, transferState, route as any, state);
      } else {
        uploadTime = setInterval(() => {
          if (transferState.limitNumber < 5) {
            transferState.limitNumber++;
            computeMD5(file, transferState, route as any, state);
            clearInterval(uploadTime);
            uploadTime = null;
          }
        }, 100);
      }
      return false;
    };

    const findData = ref<Partial<FilePageVO & { path: string[] }>>({});
    const findList = ref<FilePageVO[]>([]);
    const findLoading = ref<boolean>(false);
    const getDetail = () => {
      findData.value = state.mockData.find((val) => val.id === state.checkItem[0]) ?? {};

      findData.value.path = findData.value.filePath?.split('/') ?? [];

      if (findData.value.isDir === YesNo.YES) {
        findLoading.value = true;
        FileManageService.page({
          filePath:
            (findData.value.filePath && findData.value.filePath !== '/'
              ? `${findData.value.filePath}/`
              : '/') + findData.value.fileName,
          pageSize: 20,
          current: 1,
        })
          .then((res) => {
            if (res && res.success && res.data.records) {
              findList.value = res.data.records;
            }
          })
          .finally(() => (findLoading.value = false));
      }
    };

    const uploadFile = async (item?: Partial<FilePageVO>) => {
      const loginInfo = await UserUtil.getLoginInfo<any>();
      let url = '/api/zhiyun-file/file/transfer/download';
      if (item) {
        url += `?ids=${item.id}`;
      } else {
        url += `?ids=${state.checkItem.join()}`;
      }

      url += loginInfo?.access_token
        ? `&accessToken=${loginInfo?.token_type} ${loginInfo?.access_token}`
        : '(no access token)';

      // window.location.href = url;
      window.open(url);
    };

    const state = reactive<HomeState>({
      loading: false,
      indeterminate: false,
      checkAll: false,
      checkItem: [],
      mockData: [],
      checkboxItem,
      checkboxAll,
      path: [],
      jump,
      rename,
      confirmRename,
      cancelRename,
      currentPage: 1,
      total: 100,
      onSearch,
      fileOperation,
      fileOperationConfirm,
      getDetail,
      isFolder: false,
      folderForm: {},
      uploadFile,
      codeForm: {},
    });

    const fileOperState = reactive<FileOperationState>({
      loading: false,
      removeShowModal: false,
      moveCopyShowModal: false,
      operationType: 'delete',
    });

    const status = ref<string>('1');

    return {
      state,
      transferState,
      fileOperState,
      route,

      visible,
      previewImg,
      setVisible,

      onSearch,
      MenuList,
      status,

      findData,
      findList,
      findLoading,
      getDetail,

      goBackPath,
      goBackLevel,
      fileOperation,
      addFolder,
      beforeUpload,

      YesNo,
      SERVER,
      officeFileType,
      imageType,
      handleImageUrl,
    };
  },
  mounted() {
    if (this.$route.query.path) {
      this.state.path = `${this.$route.query.path}`.split(',');
    }
    this.onSearch();
    this.status = sessionStorage.getItem('exhibition_mode') ?? '1';
    this.state.mockData = [];
  },
  watch: {
    '$route.query': {
      handler(newVal, oldVal) {
        if (newVal.path !== oldVal.path || newVal.category !== oldVal.category) {
          if (newVal.category && newVal.category !== 'all') {
            this.state.path = [];
          }
          this.state.path =
            (newVal.path as string | undefined)?.split(',').filter((val) => !!val) ?? [];
          this.onSearch(false, true);
        }
      },
      deep: true,
    },
    '$store.state.home.count': {
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          6;
          this.state.currentPage = 1;
          this.onSearch(false, !!this.state.isSearch);
        }
      },
    },
  },
  methods: {
    exhibitionMode(status: string) {
      if (this.state.mockData.filter((val) => val.edit).length > 0) return false;
      this.status = status;
      sessionStorage.setItem('exhibition_mode', status);
    },
    rename() {
      if (this.state.checkItem.length === 1) {
        const index = this.state.mockData.indexOf(
          this.state.mockData.find((val) => val.id === this.state.checkItem[0])!,
        );
        this.state.mockData[index].newFileName = this.state.mockData[index].fileName;
        this.state.mockData[index].edit = true;
      }
    },
  },
});
</script>

<template>
  <div>
    <a-spin :spinning="state.loading">
      <div class="home-container">
        <div class="toolbar">
          <div class="toolbar-lt">
            <a-dropdown v-if="state.checkItem.length === 0">
              <a class="ant-dropdown-link" @click.prevent>
                <a-upload :showUploadList="false" :multiple="true" :before-upload="beforeUpload">
                  <a-button type="primary" style="border-radius: 16px">
                    <template #icon><upload-outlined /></template>上传
                  </a-button>
                </a-upload>
              </a>
              <template #overlay>
                <a-menu>
                  <a-upload
                    :showUploadList="false"
                    :multiple="true"
                    :before-upload="beforeUpload"
                    style="display: block"
                  >
                    <menu-item>上传文件</menu-item>
                  </a-upload>
                  <a-upload
                    :showUploadList="false"
                    :multiple="true"
                    :before-upload="beforeUpload"
                    style="display: block"
                    directory
                  >
                    <menu-item>上传文件夹</menu-item>
                  </a-upload>
                </a-menu>
              </template>
            </a-dropdown>
            <div class="add-files">
              <div
                class="add-item"
                v-if="
                  state.checkItem.length === 0 &&
                  (!route.query.category || route.query.category === 'all')
                "
              >
                <a-button type="link" @click="addFolder"
                  ><template #icon><folder-add-outlined /></template>新建文件夹</a-button
                >
              </div>
              <div class="add-item" v-if="state.checkItem.length > 0">
                <a-button type="link">
                  <template #icon> <share-alt-outlined /> </template>分享
                </a-button>
                <a-button type="link" @click="state.uploadFile()">
                  <template #icon> <download-outlined /> </template>下载
                </a-button>
                <a-button type="link" @click="fileOperation('delete')">
                  <template #icon> <delete-outlined /> </template>删除
                </a-button>
                <a-button type="link" v-if="state.checkItem.length === 1" @click="rename">
                  <template #icon> <form-outlined /> </template>重命名
                </a-button>
                <a-button type="link" @click="state.fileOperation('copy')">
                  <template #icon> <copy-outlined /> </template>复制
                </a-button>
                <a-button type="link" @click="state.fileOperation('move')">
                  <template #icon> <drag-outlined /> </template>移动
                </a-button>
                <a-button
                  v-if="
                    officeFileType.includes(findData.extendName ?? '') &&
                    findData.extendName !== 'pdf'
                  "
                  type="link"
                  @click="state.jump(findData, true)"
                >
                  <template #icon> <edit-outlined /> </template>在线编辑
                </a-button>
              </div>
            </div>
          </div>
          <div class="toolbar-rt">
            <input-search
              v-model:value="state.searchContent"
              placeholder="搜索我的文件"
              enter-button="搜索"
              @search="() => onSearch(false, true, true)"
            />
          </div>
        </div>
        <div class="title">
          <div class="title-lt" v-if="state.path.length === 0 && !state.isSearch">
            {{ $route.query.category === '4' ? '其它' : '全部'
            }}{{
        $route.query.category === "all" || $route.query.category === "4"
          ? "文件"
          : MenuList.find((val: MenuType) => val.value === $route.query.category)?.label
            }}
          </div>
          <div class="title-lt" v-else>
            <span class="selector__nav-item">
              <span class="selector__nav-item-title" @click="goBackLevel">返回上一级</span>
              <span class="selector__nav-item-sep">|</span>
            </span>
            <span class="selector__nav-item">
              <span class="selector__nav-item-title" @click="goBackPath()">全部文件</span>
              <span class="selector__nav-item-sep">&gt;</span>
            </span>
            <span
              v-if="!state.isSearch"
              class="selector__nav-item"
              v-for="(item, index) in state.path.filter(
                (val, index) => index !== state.path.length - 1,
              )"
              :key="index"
            >
              <span class="selector__nav-item-title" @click="goBackPath(index)">{{ item }}</span>
              <span class="selector__nav-item-sep">&gt;</span>
            </span>
            <span class="selector__nav-item is-disable-nav">
              <span class="selector__nav-item-title" v-if="!state.isSearch">
                {{ state.path[state.path.length - 1] }}
              </span>
              <span class="selector__nav-item-title" v-else> 搜索：{{ state.searchContent }} </span>
              <span class="selector__nav-item-sep"></span>
            </span>
          </div>
          <div class="title-rt">
            {{
              state.mockData.length > 0
                ? state.total === state.mockData.length
                  ? `已全部加载，共${state.mockData.length}个`
                  : `已加载${state.mockData.length}个`
                : ''
            }}
            <appstore-outlined @click="exhibitionMode('2')" v-if="status === '1'" />
            <menu-outlined @click="exhibitionMode('1')" v-else />
          </div>
        </div>
        <div class="content">
          <div class="content-lt">
            <div class="empty" v-if="state.mockData.length === 0 && !state.isFolder">
              <a-empty
                :image="handleImageUrl('empty')"
                :image-style="{
                  height: '60px',
                }"
              >
                <template #description>
                  <span> 空空如也 </span>
                </template>
                <a-upload
                  :showUploadList="false"
                  :multiple="true"
                  :before-upload="beforeUpload"
                  style="display: block"
                >
                  <a-button type="primary">上传</a-button>
                </a-upload>
              </a-empty>
            </div>

            <div v-else>
              <z-table v-bind="{ state, fileOperState }" v-show="status === '1'" />
              <z-list v-bind="{ state, fileOperState }" v-show="status === '2'" />
            </div>
          </div>
          <div class="content-rt">
            <div class="content-detail-title">
              {{
                state.checkItem.length === 0
                  ? '文件详情'
                  : state.checkItem.length > 1
                  ? `共选中${state.checkItem.length}个文件`
                  : state.checkItem.length === 1
                  ? findData.isDir === YesNo.YES
                    ? '文件夹内容'
                    : '文件详情'
                  : ''
              }}
            </div>
            <div class="detail-content">
              <div v-if="state.checkItem.length === 0" class="detail-none">
                <a-empty
                  :image="handleImageUrl('empty')"
                  :image-style="{
                    height: '60px',
                  }"
                >
                  <template #description>
                    <span style="font-size: 12px; color: #878c9c">选中文件，查看详情</span>
                  </template>
                </a-empty>
              </div>
              <div
                v-else-if="state.checkItem.length === 1 && findData.isDir === YesNo.YES"
                class="detail-have"
              >
                <div class="detail-filelist__name">
                  <img src="../../assets/icon_resources.png" />
                  <span>我的资源</span>
                </div>
                <a-spin :spinning="findLoading">
                  <div class="detail-filelist__list">
                    <div>
                      <div class="detail-filename" v-for="(item, index) in findList" :key="index">
                        <img
                          :src="
                            handleImageUrl(
                              item.isDir === YesNo.YES ? 'dir' : item.extendName ?? 'unknown',
                              item.id,
                            )
                          "
                        />
                        <span class="detail-filename__title-text">{{ item.fileName }}</span>
                      </div>
                    </div>
                  </div>
                </a-spin>
              </div>
              <div v-else-if="state.checkItem.length === 1" class="detail-have">
                <div>
                  <div class="detail__img" v-if="imageType.includes(findData.extendName ?? '')">
                    <img
                      :src="`/api${SERVER}/file/transfer/preview?id=${findData.id}&isMin=false`"
                    />
                  </div>
                  <div class="detail__props">
                    <div class="detail__name">
                      <img
                        :src="
                          handleImageUrl(
                            findData.isDir === YesNo.YES ? 'dir' : findData.extendName ?? 'unknown',
                            findData.id,
                            true,
                          )
                        "
                        class="icon"
                      />
                      <span>{{ findData.fileName ?? '-' }}</span>
                    </div>
                    <div class="prop">创建时间: {{ findData.createTime ?? '-' }}</div>
                    <div class="prop">最后修改: {{ findData.updateTime ?? '-' }}</div>
                    <div class="prop"></div>
                    <div class="prop">
                      <span>所在目录: </span>
                      <div class="file-main__nav simple">
                        <div class="file-main__nav-left">
                          <div>
                            <span class="file-selector__nav-item"
                              ><span
                                class="file-selector__nav-item-title text-ellip"
                                @click="goBackPath()"
                                >全部文件</span
                              ><span
                                class="file-selector__nav-item-sep"
                                v-if="findData.path && findData.path.length > 0"
                                >&gt;</span
                              >
                            </span>
                            <span
                              class="file-selector__nav-item"
                              v-for="(item, index) in findData.path?.filter(
                                (val, index) =>
                                  val !== '' &&
                                  index !== 0 &&
                                  index !== (findData.path?.length ?? 0) - 1,
                              )"
                              :key="index"
                              ><span
                                class="file-selector__nav-item-title text-ellip"
                                @click="goBackPath(index)"
                                >{{ item }}</span
                              ><span class="file-selector__nav-item-sep">&gt;</span>
                            </span>
                            <span class="file-selector__nav-item is-disable-nav"
                              ><span class="file-selector__nav-item-title text-ellip">{{
                                findData.path?.[(findData.path?.length ?? 1) - 1]
                              }}</span
                              ><span class="file-selector__nav-item-sep">&gt;</span></span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="detail-multiple">
                <div class="detail__img">
                  <img :src="handleImageUrl('multiple')" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
    <!-- 
    <a-image
      :preview="{
        visible,
        onVisibleChange: () => setVisible(false),
      }"
      :src="previewImg"
    /> -->
    <a-image
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        visible,
        onVisibleChange: setVisible,
      }"
      :src="previewImg"
    />

    <remove-modal v-bind="{ state, fileOperState }" />
    <move-copy-modal v-bind="{ state, fileOperState }" />
    <code-preview v-bind="{ state }" />
  </div>
</template>

<style lang="less" scoped>
@import './index.less';
:deep(.ant-upload.ant-upload-select) {
  display: block;
}
</style>
