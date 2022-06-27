type TransferState = {
  showModal: boolean;

  uploadData: Partial<FilePageVO>[];

  menuIndex: string;

  /** 限制上传数量 */
  limitNumber: number;

  /** 是否隐藏上传列表内容 */
  isHide?: boolean;
};
