import { request } from '@/axios';
import { SERVER } from '@/const';

const url = `${SERVER}/file/manage`;

/**
 * 网盘文件管理
 */
export const FileManageService = {
  page: async (params: any) => await request.get(`${url}/page`, params),

  /**   列表搜索查询 */
  search: async (params: any) => await request.get(`${url}/search`, params),

  /** 文件树查询 */
  folderTree: async () => await request.get(`${url}/folder-tree`),

  /** 文件重命名 */
  rename: async (data: any) => await request.other(`${url}/rename`, 'put', data),

  /** 文件操作(移动、复制、删除) */
  save: async (data: any, params: any) => await request.post(`${url}`, data, {}, params),

  /** 新建文件夹 */
  create: async (data: any) => await request.post(`${url}/create`, data),
};
