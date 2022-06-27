import axios from 'axios';
import { UserUtil } from '@micros-common-vue/util';
import { SERVER } from '@/const';
import qs from 'qs';

/**
 * 导出文件
 * @param exportData 请求参数
 * @param path 请求路径
 */
export const ExportFile = async (exportData: any, path: string) => {
  return await UserUtil.getLoginInfo().then(async (info: any) => {
    await axios
      .get('/api' + SERVER + path, {
        responseType: 'blob',
        xsrfHeaderName: 'Authorization',
        params: {
          ...exportData,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },

        headers: {
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + info.access_token,
        },
        timeout: 20000
      })
      .then((res: any) => {
        const fileName = window.decodeURI(res.headers['content-disposition'].split('"')[1]);
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', `${fileName}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 下载完成移除元素
        window.URL.revokeObjectURL(url); // 释放掉blob对象
      });

    return true;
  });
};
