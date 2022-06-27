type FileOperationState = {
  loading: boolean;
  /** 删除弹窗 show */
  removeShowModal: boolean;

  operId?: string;

  /** 移动或者复制弹窗 show */
  moveCopyShowModal: boolean;

  operationType: "move" | "copy" | "delete",
};
