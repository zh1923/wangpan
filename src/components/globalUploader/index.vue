<script lang="ts">
import { bytesToSize, computeMD5, handleImageUrl } from '@/utils';
import {
  ArrowUpOutlined,
  CloseOutlined,
  FolderOutlined,
  FullscreenOutlined,
  MinusOutlined,
  PauseOutlined,
  UndoOutlined,
} from '@ant-design/icons-vue';
import { Button, Empty, Progress } from 'ant-design-vue';
import { defineComponent, useAttrs } from 'vue';

export default defineComponent({
  components: {
    'a-button': Button,
    'a-progress': Progress,
    'a-empty': Empty,
    CloseOutlined,
    FolderOutlined,
    ArrowUpOutlined,
    PauseOutlined,
    UndoOutlined,
    MinusOutlined,
    FullscreenOutlined,
  },
  setup() {
    const { transferState } = useAttrs() as TransferOptions;

    return {
      transferState,

      bytesToSize,
      handleImageUrl,
    };
  },
  methods: {
    goFolder(item: Partial<FilePageVO>) {
      this.transferState.menuIndex = 'all';
      this.$router.push({
        path: '/home',
        query: {
          category: 'all',
          path:
            item.filePath
              ?.split('/')
              .filter((val) => !!val)
              .join() ?? undefined,
        },
      });
      setTimeout(() => {
        this.$store._actions.actionSetTestData[0]();
      });
    },
    suspend(item: Partial<FilePageVO>) {
      item.isSuspend = true;
    },
    continueUpload(item: Partial<FilePageVO>, index: number) {
      item.isSuspend = false;
      this.transferState.uploadData.splice(index, 1);
      computeMD5(
        item.file,
        this.transferState,
        { query: { path: item.filePath ?? '' } },
        undefined,
        this.$store,
      );
    },
    cancelUpload(item: Partial<FilePageVO>, index: number) {
      this.transferState.uploadData.splice(index, 1);
    },
    againUpload(item: Partial<FilePageVO>, index: number) {
      this.transferState.uploadData.splice(index, 1);
      computeMD5(
        item.file,
        this.transferState,
        { query: { path: item.filePath ?? '' } },
        undefined,
        this.$store,
      );
    },
  },
});
</script>

<template>
  <div
    class="upload-modal"
    :class="{ 'is-show': !transferState.showModal, 'is-hide': transferState.isHide }"
  >
    <div class="title">
      <div class="title-lt">
        上传列表<span>（{{ transferState.uploadData.length }}）</span>
      </div>
      <div class="title-oper">
        <MinusOutlined v-if="!transferState.isHide" @click="transferState.isHide = true" />
        <FullscreenOutlined v-else @click="transferState.isHide = false" />
        <CloseOutlined @click="transferState.showModal = false" />
      </div>
    </div>
    <div class="global-upload" v-if="transferState.uploadData.length > 0">
      <div class="list" v-for="(item, index) in transferState.uploadData" :key="index">
        <div class="file-name">
          <img :src="handleImageUrl(`${item.extendName}` as any)" />
          <div class="info">
            <div class="name">{{ item.fileName }}</div>
            <div v-if="item.status === 'active'">
              <a-progress
                :show-info="false"
                :status="item.status"
                :percent="((item.progress ?? 0) / (item.totalChunks ?? 1)) * 100"
              />
            </div>
            <div class="size">{{ bytesToSize(item.fileSize ?? 0) }}</div>
          </div>
        </div>
        <div class="oper">
          <div class="oper-list" v-if="item.status === 'success'">
            <FolderOutlined @click="goFolder(item)" />
          </div>
          <div
            class="oper-list"
            v-if="item.status !== 'success' && item.status !== 'exception' && !item.isSuspend"
          >
            <PauseOutlined @click="suspend(item)" />
          </div>
          <div class="oper-list" v-if="item.status !== 'success' && item.isSuspend">
            <ArrowUpOutlined @click="continueUpload(item, index)" />
          </div>
          <div class="oper-list" v-if="item.status === 'active'">
            <CloseOutlined @click="cancelUpload(item, index)" />
          </div>
          <div class="oper-list" v-if="item.status === 'exception'">
            <UndoOutlined @click="againUpload(item, index)" />
          </div>
        </div>
      </div>
    </div>
    <div class="global-upload" v-else>
      <a-empty description="暂无数据" style="margin-top: 50px" />
    </div>
  </div>
</template>

<style lang="less" scoped>
@import './index.less';
</style>

<style lang="less">
.global-modal .ant-modal-body {
  max-height: 55vh;
  overflow: auto;
}
</style>
