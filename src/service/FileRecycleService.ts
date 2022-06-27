import { SERVER } from "@/const";
import { request } from "@/axios";

const url = `${SERVER}/file/recycle`;

/**
 * 网盘回收站管理
 */
export const FileRecycleService = {
  list: async () => await request.get(`${url}/list`),

  /** 还原文件 */
  restore: async (data: string[]) => await request.post(`${url}/restore`, data),

  /** 彻底删除 */
  remove: async (data: string[]) =>
    await request.other(`${url}`, "delete", data),

  /** 清空回收站 */
  clear: async () => await request.other(`${url}/clear`, "delete"),
};
