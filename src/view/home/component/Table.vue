<script lang="ts">
import { imageType, officeFileType, SERVER } from '@/const';
import { bytesToSize, handleImageUrl } from '@/utils';
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DragOutlined,
  EditOutlined,
  EllipsisOutlined,
  FormOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue';
import { YesNo } from '@micros-common-vue/enum';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Dropdown,
  Input,
  Menu,
  MenuItem,
  Tooltip,
} from 'ant-design-vue';
import { defineComponent, useAttrs } from 'vue';

export default defineComponent({
  components: {
    CheckboxGroup,
    'a-checkbox': Checkbox,
    'a-tooltip': Tooltip,
    'a-menu': Menu,
    'a-dropdown': Dropdown,
    'a-input': Input,
    'a-button': Button,
    MenuItem,
    ShareAltOutlined,
    DownloadOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    DragOutlined,
    CopyOutlined,
    FormOutlined,
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
  },
  setup() {
    const { state } = useAttrs() as HomeOptions;

    return {
      state,
      YesNo,
      imageType,
      SERVER,
      officeFileType,

      bytesToSize,
      handleImageUrl,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 滚动的容器
      const el = document.querySelector('.demo-infinite-container') as any;
      const offsetHeight = el.offsetHeight;
      el.onscroll = () => {
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        if (offsetHeight + scrollTop - scrollHeight >= -1) {
          if (this.state.total > this.state.mockData.length) {
            this.state.currentPage += 1;
            this.state.onSearch(true);
          }
        }
      };
    });
  },
  methods: {
    selectTr(item: Partial<FilePageVO>) {
      if (this.state.checkItem.length === 1 && this.state.checkItem[0] === item.id) {
        this.state.checkItem = [];
      } else {
        this.state.checkItem = [`${item.id}`];
        this.state.getDetail();
      }
    },
    goPath(item: Partial<FilePageVO>) {
      this.state.isSearch = false;
      this.state.searchContent = undefined;
      this.state.indeterminate = false;
      this.state.checkAll = false;
      this.state.checkItem = [];

      this.$router.push({
        path: '/home',
        query: {
          path: item.filePath
            ?.split('/')
            .filter((val, index) => index !== 0)
            .join(','),
        },
      });
    },
  },
});
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th align="left" style="width: 43px; padding-left: 18px">
            <a-checkbox
              v-model:checked="state.checkAll"
              :indeterminate="state.indeterminate"
              @change="state.checkboxAll"
            />
          </th>
          <th align="left">
            {{
              state.checkItem.length > 0 ? `已选中${state.checkItem.length}个文件/文件夹` : '文件名'
            }}
          </th>
          <th align="left" style="width: 180px">修改时间</th>
          <th align="left" style="width: 80px">大小</th>
          <th align="left" style="width: 130px" v-if="state.isSearch">所在目录</th>
        </tr>
      </thead>
      <checkbox-group v-model:value="state.checkItem" style="width: 100%; display: contents">
        <tbody class="demo-infinite-container">
          <tr v-if="state.isFolder">
            <td style="width: 43px; padding-left: 18px; overflow: hidden">
              <a-checkbox :disabled="true" />
            </td>
            <td>
              <div class="name">
                <img :src="handleImageUrl('dir')" />
                <div class="edit-name" @click.stop>
                  <a-input
                    v-model:value="state.folderForm.name"
                    size="small"
                    @keyup.enter.native="state.confirmRename()"
                  />
                  <a-button type="primary" size="small" @click="state.confirmRename()">
                    <template #icon><check-outlined /></template>
                  </a-button>
                  <a-button type="primary" size="small" @click="state.cancelRename()">
                    <template #icon><close-outlined /></template>
                  </a-button>
                </div>
              </div>
            </td>
            <td style="width: 180px">
              <div class="time-size">
                {{ state.folderForm.time }}
              </div>
            </td>
            <td style="width: 130px"></td>
          </tr>
          <tr
            v-for="(item, index) in state.mockData"
            :key="index"
            :class="{ 'active': state.checkItem.includes(item.id!) }"
            @click="selectTr(item)"
            @dblclick.stop="state.jump(item)"
          >
            <td style="width: 43px; padding-left: 18px; overflow: hidden">
              <a-checkbox @click.stop :value="item.id" @change="state.checkboxItem" class="check" />
            </td>
            <td>
              <div class="name">
                <img
                  :src="
                    handleImageUrl(
                      item.isDir === YesNo.YES ? 'dir' : item.extendName ?? 'unknown',
                      item.id,
                    )
                  "
                />
                <a-tooltip v-if="!item.edit">
                  <template #title>{{ item.fileName ?? '-' }}</template>
                  <div class="name-content" @click.stop="state.jump(item)">
                    {{ item.fileName }}
                  </div>
                </a-tooltip>
                <div v-else class="edit-name" @click.stop>
                  <a-input
                    v-model:value="item.newFileName"
                    size="small"
                    @keyup.enter.native="state.confirmRename(item)"
                  />
                  <a-button type="primary" size="small" @click="state.confirmRename(item)">
                    <template #icon><check-outlined /></template>
                  </a-button>
                  <a-button type="primary" size="small" @click="state.cancelRename(item)">
                    <template #icon><close-outlined /></template>
                  </a-button>
                </div>
              </div>
            </td>
            <td style="width: 180px">
              <div class="time time-size">
                {{ item.updateTime ?? item.createTime }}
              </div>
              <div class="button" @click.stop>
                <share-alt-outlined />
                <download-outlined @click="state.uploadFile(item)" />
                <a-dropdown>
                  <ellipsis-outlined />
                  <template #overlay>
                    <a-menu>
                      <menu-item
                        key="0"
                        class="button-more"
                        @click="state.fileOperation('delete', item)"
                        ><delete-outlined />删除</menu-item
                      >
                      <menu-item key="1" class="button-more" @click="state.rename(item)"
                        ><form-outlined />重命名</menu-item
                      >
                      <menu-item
                        key="2"
                        class="button-more"
                        @click="state.fileOperation('copy', item)"
                        ><copy-outlined />复制</menu-item
                      >
                      <menu-item
                        key="3"
                        class="button-more"
                        @click="state.fileOperation('move', item)"
                        ><drag-outlined />移动</menu-item
                      >
                      <menu-item
                        key="4"
                        class="button-more"
                        @click="state.jump(item, true)"
                        v-if="
                          officeFileType.includes(item.extendName ?? '') &&
                          item.extendName !== 'pdf'
                        "
                        ><edit-outlined />在线编辑</menu-item
                      >
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </td>
            <td style="width: 80px">
              <div class="time-size">
                {{ item.isDir !== YesNo.YES ? bytesToSize(item.fileSize ?? 0) ?? '-' : '-' }}
              </div>
            </td>
            <td style="width: 130px" v-if="state.isSearch">
              <a-tooltip>
                <template #title>{{ item.filePath ?? '-' }}</template>
                <div class="time-size path" @click.stop="goPath(item)">
                  {{ item.showPath }}
                </div>
              </a-tooltip>
            </td>
          </tr>
        </tbody>
      </checkbox-group>
    </table>
  </div>
</template>

<style lang="less" scoped>
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
          &.path {
            line-height: 1;
            text-decoration: underline;
            cursor: pointer;
          }
        }
        .check {
          display: none;
          height: 20px;
        }
        .button {
          display: none;
          padding-left: 16px;
          .anticon {
            margin-left: 4px;
            color: #06a7ff;
            font-size: 12px;
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
            display: inline-block;
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
  height: calc(~'100vh - 164px');
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
</style>
