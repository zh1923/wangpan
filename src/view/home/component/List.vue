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
  Checkbox,
  CheckboxGroup,
  Dropdown,
  Image,
  Input,
  Menu,
  MenuItem,
  Tooltip,
} from 'ant-design-vue';
import { defineComponent, useAttrs } from 'vue';

export default defineComponent({
  components: {
    'a-checkbox': Checkbox,
    CheckboxGroup,
    'a-dropdown': Dropdown,
    'a-tooltip': Tooltip,
    'a-menu': Menu,
    'a-input': Input,
    'a-image': Image,
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

      imageType,
      SERVER,
      YesNo,
      officeFileType,

      bytesToSize,
      handleImageUrl,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 滚动的容器
      const el = document.querySelector('.demo-infinite-container-list') as any;
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
    handleTime(item: Partial<FilePageVO>) {
      return (item.updateTime ?? item.createTime)?.substring(5, 16) ?? '-';
    },
    handleFolderTime(time: string) {
      return time.substring(5, 16) ?? '-';
    },
  },
});
</script>

<template>
  <div>
    <div class="nd-file-grid-list__nav">
      <a-checkbox
        v-model:checked="state.checkAll"
        :indeterminate="state.indeterminate"
        @change="state.checkboxAll"
        >{{
          state.checkItem.length > 0 ? `已选中${state.checkItem.length}个文件/文件夹` : '全选'
        }}</a-checkbox
      >
    </div>
    <div
      class="demo-infinite-container-list"
      style="width: 100%; overflow-y: auto; max-height: calc(100vh - 152px)"
    >
      <checkbox-group v-model:value="state.checkItem">
        <div class="list-content">
          <div class="item-list" v-if="state.isFolder">
            <div class="edit-content">
              <div class="title">
                <div class="button check" @click.stop>
                  <check-outlined @click="state.confirmRename()" />
                  <close-outlined @click="state.cancelRename()" />
                </div>
              </div>
              <img :src="handleImageUrl('dir')" />
              <div class="edit-name">
                <a-input v-model:value="state.folderForm.name" size="small" />
                <div class="time-or-size">
                  {{ handleFolderTime(state.folderForm.time) }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="item-list"
            v-for="(item, index) in state.mockData"
            :key="index"
            :class="{ 'active': state.checkItem.includes(item.id!) || item.edit }"
          >
            <div class="item-content" v-if="!item.edit" @click="state.jump(item)">
              <div class="title" @click.stop>
                <a-checkbox :value="item.id" @change="state.checkboxItem" class="check" />
                <div class="button">
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
              </div>
              <img
                :src="
                  handleImageUrl(
                    item.isDir === YesNo.YES ? 'dir' : item.extendName ?? 'unknown',
                    item.id,
                  )
                "
              />
              <div>
                <a-tooltip placement="top">
                  <template #title>
                    <div class="tooltip-content">
                      <div class="item">
                        <label>名称：</label><span>{{ item.fileName ?? '-' }}</span>
                      </div>
                      <div class="item">
                        大小：
                        {{
                          item.isDir !== YesNo.YES ? bytesToSize(item.fileSize ?? 0) ?? '-' : '-'
                        }}
                      </div>
                      <div class="item">修改日期：{{ item.updateTime ?? item.createTime }}</div>
                    </div>
                  </template>
                  <div class="name">{{ item.fileName ?? '-' }}</div>
                  <div class="time-or-size">
                    {{
                      item.isDir === YesNo.YES
                        ? handleTime(item)
                        : bytesToSize(item.fileSize ?? 0) ?? '-'
                    }}
                  </div>
                </a-tooltip>
              </div>
            </div>
            <div v-else class="edit-content">
              <div class="title">
                <div class="button check" @click.stop>
                  <check-outlined @click="state.confirmRename(item)" />
                  <close-outlined @click="state.cancelRename(item)" />
                </div>
              </div>
              <img
                :src="
                  handleImageUrl(
                    item.isDir === YesNo.YES ? 'dir' : item.extendName ?? 'unknown',
                    item.id,
                  )
                "
              />
              <div class="edit-name">
                <a-input v-model:value="item.newFileName" size="small" />
                <div class="time-or-size">
                  {{ handleTime(item) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </checkbox-group>
    </div>
  </div>
</template>

<style lang="less" scoped>
.nd-file-grid-list__nav {
  padding: 10px 0 8px 16px;
  & :deep(.ant-checkbox-wrapper) {
    font-size: 12px;
  }
}
.list-content {
  display: flex;
  flex-flow: wrap;

  .item-list {
    display: inline-block;
    width: 112px;
    height: 152px;
    margin: 0 0 24px 32px;
    padding: 4px;
    text-align: center;
    border-radius: 8px;
    .item-content {
      cursor: pointer;
    }
    .title {
      display: flex;
      justify-content: space-between;
      height: 27px;
      padding-top: 4px;
      padding-left: 4px;
      text-align: left;
      .check {
        display: none;
      }
      .button {
        display: none;
        padding-right: 4px;
        background-color: #fff;
        .anticon {
          margin-left: 4px;
          color: #06a7ff;
          font-size: 12px;
        }
      }
    }
    img {
      width: 58px;
      height: 58px;
      margin-top: 8px;
    }
    .name {
      height: 18px;
      margin-top: 10px;
      overflow: hidden;
      color: #333;
      font-size: 12px;
      line-height: 18px;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:hover {
        color: #06a7ff;
      }
    }

    .time-or-size {
      margin-top: 2px;
      color: #afb3bf;
      font-size: 12px;
      line-height: 18px;
    }
    .edit-content {
      .title {
        justify-content: flex-end;
      }
      .edit-name {
        margin-top: 4px;
      }
      .button {
        cursor: pointer;
      }
    }
    &:hover {
      background-color: #f0faff;
      .title {
        .check,
        .button {
          display: block;
        }
      }
    }
    &.active {
      background-color: #f0faff;
      .title {
        .check {
          display: block;
        }
      }
    }
  }
}
.tooltip-content {
  font-size: 12px;
  line-height: 18px;
  .item {
    display: flex;
    label {
      white-space: nowrap;
    }
    span {
      flex: 1;
      overflow: hidden;
    }
  }
}
:deep(.button-more .ant-dropdown-menu-title-content) {
  color: #03081a;
  font-size: 12px;
}
</style>
