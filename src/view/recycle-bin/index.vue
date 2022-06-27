<script lang="ts">
import { imageType, SERVER } from '@/const';
import { FileRecycleService } from '@/service';
import { bytesToSize, handleImageUrl } from '@/utils';
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DragOutlined,
  EllipsisOutlined,
  FormOutlined,
  ShareAltOutlined,
  UndoOutlined,
} from '@ant-design/icons-vue';
import { YesNo } from '@micros-common-vue/enum';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Dropdown,
  Empty,
  Menu,
  MenuItem,
  message,
  Modal,
  Result,
  Spin,
  Tooltip,
} from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import { removeModal } from './modal';

export default defineComponent({
  components: {
    CheckboxGroup,
    'a-checkbox': Checkbox,
    'a-tooltip': Tooltip,
    'a-menu': Menu,
    'a-dropdown': Dropdown,
    'a-spin': Spin,
    'a-button': Button,
    'a-result': Result,
    'a-empty': Empty,
    MenuItem,
    Modal,
    ShareAltOutlined,
    DownloadOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    DragOutlined,
    CopyOutlined,
    FormOutlined,
    CheckOutlined,
    CloseOutlined,
    UndoOutlined,

    removeModal,
  },
  setup() {
    const mockData = ref<FileRecycleVO[]>([]);

    const loading = ref<boolean>(false);

    const checkItem = ref<string[]>([]);
    const checkAll = ref<boolean>(false);
    const indeterminate = ref<boolean>(false);

    const onSearch = () => {
      loading.value = true;
      FileRecycleService.list()
        .then((res) => {
          if (res.success) {
            mockData.value = res.data ?? [];
            checkItem.value = [];
            checkAll.value = false;
            indeterminate.value = false;
          }
        })
        .finally(() => (loading.value = false));
    };
    const removeShowModal = ref<boolean>(false);
    const removeLoading = ref<boolean>(false);
    const removeId = ref<string[]>([]);

    const operType = ref<'reduction' | 'remove' | 'clear'>('reduction');

    return {
      mockData,
      loading,
      removeId,
      removeShowModal,
      removeLoading,
      operType,

      checkItem,
      checkAll,
      indeterminate,

      YesNo,
      imageType,
      SERVER,

      bytesToSize,
      onSearch,
      handleImageUrl,
    };
  },

  mounted() {
    this.onSearch();
    // this.$nextTick(() => {
    //   // 滚动的容器
    //   const el = document.querySelector(".demo-infinite-container") as any;
    //   const offsetHeight = el.offsetHeight;
    //   el.onscroll = () => {
    //     const scrollTop = el.scrollTop;
    //     const scrollHeight = el.scrollHeight;
    //     if (offsetHeight + scrollTop - scrollHeight >= -1) {
    //       if (this.state.total > this.state.mockData.length) {
    //         this.state.currentPage += 1;
    //         this.state.onSearch(true);
    //       }
    //     }
    //   };
    // });
  },
  methods: {
    selectTr(item: FileRecycleVO) {
      if (this.checkItem.length === 1 && this.checkItem[0] === item.id) {
        this.checkItem = [];
      } else {
        this.checkItem = [`${item.id}`];
      }
    },

    checkboxItem() {
      this.$nextTick(() => {
        this.indeterminate =
          this.checkItem.length > 0 && this.checkItem.length < this.mockData.length;
        this.checkAll = this.checkItem.length === this.mockData.length;
      });
    },

    checkboxAll() {
      this.$nextTick(() => {
        this.indeterminate = false;
        this.checkItem = this.checkAll ? this.mockData.map((val) => val.id ?? '') : [];
      });
    },
    reduction(item?: FileRecycleVO) {
      this.removeShowModal = true;
      this.operType = 'reduction';
      if (item) {
        this.removeId = [item.id];
      } else {
        this.removeId = this.checkItem;
      }
    },
    remove(item: FileRecycleVO) {
      this.removeShowModal = true;
      this.removeId = [item.id];
      this.operType = 'remove';
    },
    clear() {
      this.removeShowModal = true;
      this.removeId = [];
      this.operType = 'clear';
    },
    onConfirm() {
      this.removeLoading = true;
      if (this.operType === 'remove') {
        FileRecycleService.remove(this.removeId)
          .then((res) => {
            if (res.success) {
              message.success('删除成功');
              this.removeShowModal = false;
              this.removeId = [];
              this.onSearch();
            }
          })
          .finally(() => (this.removeLoading = false));
      } else if (this.operType === 'reduction') {
        FileRecycleService.restore(this.removeId)
          .then((res) => {
            if (res.success) {
              message.success('还原成功');
              this.removeShowModal = false;
              this.removeId = [];
              this.onSearch();
            }
          })
          .finally(() => (this.removeLoading = false));
      } else {
        FileRecycleService.clear().then((res) => {
          if (res.success) {
            message.success('清空回收站成功');
            this.removeShowModal = false;
            this.removeId = [];
            this.onSearch();
          }
        });
      }
    },
  },
});
</script>

<template>
  <div>
    <div class="title">
      <div class="name">
        回收站<span>已全部加载，共{{ mockData.length }}个</span>
      </div>
      <a-button type="primary" shape="round" @click="clear()">
        <template #icon><DeleteOutlined /></template>
        清空回收站
      </a-button>
    </div>
    <a-spin :spinning="loading">
      <table v-if="mockData.length > 0">
        <thead>
          <tr>
            <th align="left" style="width: 43px; padding-left: 18px">
              <a-checkbox
                v-model:checked="checkAll"
                :indeterminate="indeterminate"
                @change="checkboxAll"
              />
            </th>
            <th align="left">
              {{ checkItem.length > 0 ? `已选中${checkItem.length}个文件/文件夹` : '文件名' }}
              <a-button type="link" v-if="checkItem.length > 0" @click="reduction()">
                <template #icon><UndoOutlined /></template>
                还原
              </a-button>
            </th>
            <th align="left" style="width: 180px">删除时间</th>
            <th align="left" style="width: 130px">大小</th>
          </tr>
        </thead>
        <checkbox-group v-model:value="checkItem" style="width: 100%; display: contents">
          <tbody>
            <tr
              v-for="(item, index) in mockData"
              :key="index"
              :class="{ 'active': checkItem.includes(item.id!) }"
              @click="selectTr(item)"
            >
              <td style="width: 43px; padding-left: 18px; overflow: hidden">
                <a-checkbox @click.stop :value="item.id" @change="checkboxItem" class="check" />
              </td>
              <td>
                <div class="name">
                  <img
                    :src="
                      handleImageUrl(
                        item.isDir === YesNo.YES ? 'dir' : item.extendName ?? 'unknown',
                      )
                    "
                  />
                  <a-tooltip>
                    <template #title>{{ item.fileName ?? '-' }}</template>
                    <div class="name-content">
                      {{ item.fileName }}
                    </div>
                  </a-tooltip>
                </div>
              </td>
              <td style="width: 180px">
                <div class="time time-size">
                  {{ item.deleteTime }}
                </div>
                <div class="button" @click.stop>
                  <a-button type="link" @click="reduction(item)">
                    <template #icon><UndoOutlined /></template>
                    还原
                  </a-button>
                  <a-button type="link" @click="remove(item)">
                    <template #icon><DeleteOutlined /></template>
                    删除
                  </a-button>
                </div>
              </td>
              <td style="width: 130px">
                <div class="time-size">
                  {{ item.isDir !== YesNo.YES ? bytesToSize(item.fileSize ?? 0) ?? '-' : '-' }}
                </div>
              </td>
            </tr>
          </tbody>
        </checkbox-group>
      </table>
      <div class="no-data" v-else><a-empty description="暂无数据" /></div>
    </a-spin>

    <modal
      v-model:visible="removeShowModal"
      :title="operType === 'clear' ? '清空回收站' : operType === 'remove' ? '彻底删除' : '确认还原'"
      :footer="false"
    >
      <a-spin :spinning="removeLoading">
        <a-result style="padding: 16px 0">
          <template #subTitle>
            <span v-if="operType === 'clear'">确认清空回收站？</span>
            <span v-else-if="operType === 'remove'"
              >文件删除后将无法恢复，您确认要彻底删除所选文件吗？</span
            >
            <span v-else>确认还原选中的文件？</span>
          </template>
          <template #icon></template>
          <template #extra>
            <a-button key="console" @click="() => (removeShowModal = false)">取消</a-button>
            <a-button key="console" type="primary" @click="onConfirm()">确定</a-button>
          </template>
        </a-result>
      </a-spin>
    </modal>
  </div>
</template>

<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  .name {
    color: #03081a;
    font-weight: 700;
    span {
      padding-left: 8px;
      color: #afb3bf;
      font-weight: 400;
      font-size: 12px;
    }
  }
}
table {
  width: 100%;
  word-wrap: break-word;
  table-layout: fixed;
  tr {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f9f9f9;
  }
  thead {
    th {
      color: #03081a;
      font-size: 12px;
    }
  }
  tbody {
    tr {
      cursor: pointer;
      td {
        color: #05082c;
        font-size: 12px;
        .time-size {
          padding-left: 16px;
          color: #afb3bf;
        }
        .check {
          display: none;
          height: 20px;
        }
        .button {
          display: none;
          padding-left: 16px;

          .ant-btn {
            margin-right: 8px;
            padding: 4px 0;
          }
        }

        img {
          display: flex;
          min-width: 32px;
          height: 32px;
          margin-right: 8px;
        }
        .img-bor {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          margin-right: 8px;
          overflow: hidden;
          img {
            margin-right: 0;
          }
        }
        .name {
          display: flex;
          align-items: center;
          overflow: hidden;
          table-layout: fixed;
          .name-content {
            max-width: calc(~'100% - 60px');
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:hover {
              color: #06a7ff;
            }
          }
          .edit-name {
            display: flex;
            & :deep(.ant-btn) {
              min-width: 24px;
              margin-left: 6px;
            }
          }
        }
      }
      &:hover {
        background-color: #fafafc;
        border-color: #fafafc;
        td {
          .check {
            display: table-caption;
          }
          .button {
            display: inline-flex;
          }
          .time {
            display: none;
          }
        }
      }
      &.active {
        background-color: #fafafc;
        border-color: #fafafc;
        .check {
          display: table-caption;
        }
      }
    }
  }
}
:deep(.button-more .ant-dropdown-menu-title-content) {
  color: #03081a;
  font-size: 12px;
}

table,
tbody {
  display: block;
  height: calc(~'100vh - 138px');
  border: 0;
  border-collapse: collapse;
  border-spacing: 0;
  cursor: default;
}

tbody {
  overflow-y: scroll;
}

table thead,
tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: ~'calc(100vh - 68px)';
}
</style>
