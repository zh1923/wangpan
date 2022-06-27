import { YesNo } from "@micros-common-vue/enum";

declare global {
  type FileRecycleVO = {
    /** 删除时间 */
    deleteTime: string;

    /** 文件扩展名 */
    extendName: FileType;

    /** 文件名 */
    fileName: string;

    /** 文件路径 */
    filePath: string;

    /** 文件大小(单位B) */
    fileSize: number;

    /** 主键ID */
    id: string;

    /** 是否目录 */
    isDir: YesNo;
  };
}
