import {request} from "../axios";
import { AUTH} from "../const";
import { StoreUtil, UserUtil } from "@micros-common-vue/util";
import { Client, PagePath } from '@micros-common-vue/const';

class Service {
  API_LOGOUT = `${AUTH}/logout`;
  API_LOGIN = `${AUTH}/login`;
  API_REFRESH = `${AUTH}/refresh-token`;

  /**
   * 登录
   */
  login = async (data: any) => {
    const rs = await request.post(
      this.API_LOGIN,
      data,
      {
        Authorization: Client.CLIENT_ID,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    );
    if (rs.success && rs.data) {
      await UserUtil.setLoginInfo(rs.data);
    }
    return rs;
  };
}

/**
 * 认证接口服务
 */
export const AuthService = new Service();
