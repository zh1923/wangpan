<script lang="ts">
import { defineComponent, useAttrs } from "vue";
import { Modal, Result, Button, Spin } from "ant-design-vue";

export default defineComponent({
  components: { Modal, "a-result": Result, "a-button": Button, Spin },
  setup() {
    const { state, fileOperState } = useAttrs() as HomeOptions;

    return {
      state,
      fileOperState,
    };
  },
});
</script>

<template>
  <modal
    v-model:visible="fileOperState.removeShowModal"
    title="确定删除"
    :footer="false"
  >
    <spin :spinning="fileOperState.loading">
      <a-result
        title="确定删除所选的文件吗？"
        sub-title="删除的文件可通过回收站还原"
        style="padding: 16px 0"
      >
        <template #extra>
          <a-button
            key="console"
            @click="() => (fileOperState.removeShowModal = false)"
            >取消</a-button
          >
          <a-button
            key="console"
            type="primary"
            @click="state.fileOperationConfirm('delete')"
            >删除</a-button
          >
        </template>
      </a-result>
    </spin>
  </modal>
</template>
