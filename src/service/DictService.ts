import { request } from '@/axios';
import { Server } from '@micros-common-vue/const';
import { DictUtil } from '@micros-common-vue/util';

const CONTEXT = `${Server.SYSTEM}/dict`;

export class Service {
  /**
   * 查询所有字典
   */
  all = async () => {
    const rs = await request.get<Record<string, Record<any, any>>>(`${CONTEXT}/all`);
    if (rs.success) {
      await DictUtil.setValues(rs.data);
      return rs.data;
    }
    return undefined;
  };
}

/**
 * 字典接口服务
 */
export const DictService = new Service();
