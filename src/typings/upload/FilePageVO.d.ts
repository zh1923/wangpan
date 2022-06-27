import type { YesNo } from '@micros-common-vue/enum';
import { Entitys } from '@micros-common-vue/type';

declare global {
  interface FilePageVO extends Entitys.Base {
    /** 文件后缀扩展名 */
    extendName: FileType;

    /** 文件信息 */
    fileMeta: string;

    /** 文件名 */
    fileName: string;

    /** 文件路径 */
    filePath: string;

    /** 相对路径 */
    relativePath: string;

    /** 文件大小(单位B) */
    fileSize: number;

    /** 是否目录 */
    isDir: YesNo;

    edit: boolean;

    newFileName: string;

    /** 当前状态，手动拼写 */
    status: 'normal' | 'active' | 'success' | 'exception' | undefined;

    /** 进度 */
    progress: number;

    /** 总分片数量 */
    totalChunks: number;

    file: any;

    /** 是否暂停 */
    isSuspend: boolean;

    /** 搜索时展示的地址 */
    showPath: string;
  }
}
