import { request } from '@/axios';
import { SERVER } from '@/const';

const url = `${SERVER}/file/transfer`;

/**
 * 网盘文件传输
 */
export const FileTransferService = {
  /** 极速上传 */
  getUpload: async (data: Partial<UploadFileDTO>) =>
    await request.get<UploadFileVO>(`${url}/upload`, data),

  /** 文件上传 */
  upload: async (data: FormData, header: any) =>
    await request.post<UploadFileVO>(`${url}/upload`, data, header),

  /** 文件下载 */
  download: async (params: any) => await request.get<any>(`${url}/download`, params),
};
