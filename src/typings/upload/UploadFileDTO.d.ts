/** 文件上传VO对象 */
type UploadFileDTO = {
  /** 切片数量 */
  chunkNumber: number;

  /** 切片大小 */
  chunkSize: number;

  /** 当前切片大小 */
  currentChunkSize: number;

  /** 文件名 */
  fileName: string;

  /** 文件路径 */
  filePath: string;

  /** 文件MD5码 */
  identifier: string;

  /** 相对路径 */
  relativePath: string;

  /** 文件总分片数 */
  totalChunks: number;

  /** 文件总大小 */
  totalSize: number;

  /** 文件 */
  file: any
};
