<script lang="ts">
import { FileManageService } from '@/service';
import { Modal, Spin } from 'ant-design-vue';
import { defineComponent, ref, useAttrs } from 'vue';

export default defineComponent({
  components: { Modal, Spin },
  setup() {
    const { state, fileOperState } = useAttrs() as HomeOptions;

    const folderTree = ref<FolderVO[]>();
    const folderList = ref<FolderVO[]>();

    const folderParams = ref<string[]>(['/']);

    const goBackLevel = () => {
      folderParams.value.splice(folderParams.value.length - 1);
    };

    const goBackPath = (index?: number) => {
      if (index !== undefined) {
        folderParams.value.splice(index + 2);
        console.log(folderParams.value)
      } else {
        folderParams.value = ['/'];
      }
    };

    const goPath = (item: FolderVO) => {
      folderParams.value.push(item.fileName);
    };

    return {
      state,
      fileOperState,

      folderTree,
      folderList,
      folderParams,

      goBackLevel,
      goBackPath,
      goPath,
    };
  },
  watch: {
    'fileOperState.moveCopyShowModal': {
      handler(newVal) {
        if (newVal) {
          this.folderParams = ['/'];
          this.fileOperState.loading = true;
          FileManageService.folderTree()
            .then((res) => {
              if (res && res.success && res.data) {
                this.folderTree = res.data;
              }
            })
            .finally(() => (this.fileOperState.loading = false));
        } else {
          this.folderTree = [];
        }
      },
    },
    folderParams: {
      handler() {
        const { folderParams, folderTree } = this;
        this.folderList = folderTree ? this.returnPath(folderTree, 0, folderParams) : [];
      },
      deep: true,
    },
    folderTree: {
      handler() {
        const { folderParams, folderTree } = this;
        this.folderList = folderTree ? this.returnPath(folderTree, 0, folderParams) : [];
      },
      deep: true,
    },
  },
  methods: {
    returnPath(folderTree: FolderVO[], level: number, folderParams: string[]): FolderVO[] {
      let result: FolderVO[] = [];
      for (let index = 0; index < folderTree.length; index++) {
        if (folderTree[index].fileName === folderParams[folderParams.length - 1]) {
          return folderTree[index].children;
        } else if (folderTree[index].fileName === folderParams[level]) {
          result = this.returnPath(folderTree[index].children, level++, folderParams);
        }
      }
      return result;
    },
  },
});
</script>

<template>
  <modal
    v-model:visible="fileOperState.moveCopyShowModal"
    :title="(fileOperState.operationType === 'move' ? '移动' : '复制') + '到'"
    cancel-text="取消"
    :okText="(fileOperState.operationType === 'move' ? '移动' : '复制') + '到此'"
    class="move-copy-modal"
    @ok="state.fileOperationConfirm(fileOperState.operationType, folderParams)"
    :confirm-loading="fileOperState.loading"
  >
    <spin :spinning="fileOperState.loading">
      <div class="home-container">
        <div class="title">
          <div class="title-lt" v-if="folderParams.length <= 1">全部文件</div>
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
              class="selector__nav-item"
              v-for="(item, index) in folderParams.filter(
                (val, index) => index !== folderParams.length - 1 && index !== 0,
              )"
              :key="index"
            >
              <span class="selector__nav-item-title" @click="goBackPath(index)">{{ item }}{{index}}</span>
              <span class="selector__nav-item-sep">&gt;</span>
            </span>
            <span class="selector__nav-item is-disable-nav">
              <span class="selector__nav-item-title">
                {{ folderParams[folderParams.length - 1] }}
              </span>
              <span class="selector__nav-item-sep"></span>
            </span>
          </div>
        </div>
        <div class="folder" v-if="folderList && folderList.length > 0">
          <div class="item" v-for="item in folderList" @click="goPath(item)">
            <img src="@/assets/file/file_dir.png" />
            <span>{{ item.fileName }}</span>
          </div>
        </div>
        <div class="none-folder" v-else>
          <div>
            <div class="img"><img src="@/assets/file/file_multiple.png" /></div>
            <div class="name">
              移动到
              {{ folderParams.length > 1 ? folderParams[folderParams.length - 1] : '全部' }}
              文件夹
            </div>
          </div>
        </div>
      </div>
    </spin>
  </modal>
</template>

<style lang="less" scoped>
@import '../index.less';
.folder {
  height: 230px;
  overflow: auto;

  .item {
    display: flex;
    align-items: center;
    height: 50px;
    padding-left: 24px;
    color: #03081a;
    font-size: 12px;
    border-bottom: 1px solid rgb(249, 249, 249);
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
      margin-right: 5px;
    }
  }
}
.none-folder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;

  & > div {
    .img {
      display: flex;
      justify-content: center;
    }
    img {
      width: 90px;
      height: 90px;
      margin: 0 auto;
    }
    .name {
      margin-top: 8px;
      color: #afb3bf;
      font-size: 14px;
      line-height: 18px;
      text-align: center;
    }
  }
}
</style>

<style lang="less">
.move-copy-modal {
  .ant-modal-body {
    min-height: 300px;
    padding: 0 0 16px;
    .home-container .title {
      width: 100%;
    }
  }
}
</style>
