/** 文件上传VO对象 */
type UploadFileVO = {
  /** 是否需要合并分片 */
  needMerge: boolean;

  /** 跳过上传 */
  skipUpload: boolean;

  /** 时间戳 */
  timeStampName: string;

  /** 已经上传的分片 */
  uploaded: number[];
};
