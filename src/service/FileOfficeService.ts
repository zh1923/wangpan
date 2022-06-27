import { request } from '@/axios';
import { SERVER } from '@/const';

const url = `${SERVER}/file/office`;

/**
 * 网盘Office文件
 */
export const FileOfficeService = {
  /** office文件预览 */
  preview: async (params: any) => await request.get(`${url}/preview`, params),

  /** office文件预览 */
  edit: async (params: any) => await request.other(`${url}/edit`, 'put', {}, params),
};
