import { FileTransferService } from '@/service';
import { message } from 'ant-design-vue';
import SparkMD5 from 'spark-md5';

/**
 * 计算md5，实现断点续传及秒传
 * @param file
 */
/**
 * 计算md5，实现断点续传及秒传
 * @param file
 */
export const computeMD5 = (
  file: any,
  transferState: TransferState,
  route: { query: { path: string } },
  state?: HomeState,
  store?: any,
) => {
  let fileReader = new FileReader();
  let blobSlice = File.prototype.slice;
  let currentChunk = 0;
  const chunkSize = 1 * 1024 * 1024;
  let chunks = Math.ceil(file.size / chunkSize);
  let spark = new SparkMD5.ArrayBuffer();

  const query = JSON.parse(JSON.stringify(route.query));

  const fileNameList = file.name.split('.') ?? [];

  const fileName = fileNameList[fileNameList.length - 1] ?? '';

  let lastIndex = file.webkitRelativePath.lastIndexOf('/');
  let newPath = file.webkitRelativePath
    ? '/' + file.webkitRelativePath.substr(0, lastIndex)
    : undefined;

  transferState.uploadData.push({
    extendName: fileName,
    fileName: file.name,
    fileSize: file.size,
    status: 'active',
    totalChunks: chunks,
    progress: 0,
    file: file,
    filePath: newPath
      ? (query.path?.split(',').join('/') ?? '') + newPath
      : query.path?.split(',').join('/')
      ? `/${query.path?.split(',').join('/')}`
      : '',
    relativePath: file.webkitRelativePath,
  });

  let dataIndex =
    transferState.uploadData.length - 1 >= 0 ? transferState.uploadData.length - 1 : 0;

  // 分片后的文件
  let paramsData: UploadFileDTO[] = [];

  file.id = 'md5';

  loadNext();

  fileReader.onload = async (e: any) => {
    spark.append(e.target.result);
    // 先把文件分片
    if (currentChunk < chunks) {
      currentChunk++;
      loadNext();
    } else {
      // 分片完成或者是不需要分片
      let md5 = spark.end();
      await getUpload(md5);
    }
  };
  fileReader.onerror = function () {
    message.error(`文件${file.name}读取出错，请检查该文件`);
    file.cancel();
  };

  /** 分片完成或者不许要分片， 通过文件的MD5判断该文件是否有已上传的分片或者是文件已上传
   * skipUpload 是否秒传
   *
   */
  function getUpload(md5: string) {
    return new Promise(async (resolve) => {
      FileTransferService.getUpload({
        chunkSize: file.size,
        fileName: file.name,
        filePath: query.path ? '/' + query.path.split(',').join('/') : '/',
        identifier: md5,
        totalChunks: chunks,
        totalSize: file.size,
        relativePath: file.webkitRelativePath,
      }).then((res) => {
        if (res.success) {
          const { data } = res;
          if (!data.skipUpload) {
            transferState.uploadData[dataIndex].status = 'active';

            if (!transferState.uploadData[dataIndex].isSuspend) {
              uploadFile(0, paramsData, md5, dataIndex, data.uploaded);
            }
          } else {
            transferState.limitNumber--;
            if (state) {
              state.currentPage = 1;
              state.onSearch(false, dataIndex === transferState.uploadData.length - 1);
            } else {
              store._actions.actionSetTestData[0]();
            }

            transferState.uploadData[dataIndex].progress = chunks;
            transferState.uploadData[dataIndex].status = 'success';
          }
        }
      });
    });
  }

  function loadNext() {
    let start = currentChunk * chunkSize;
    let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    if (end > start) {
      paramsData.push({
        chunkNumber: currentChunk + 1,
        chunkSize: file.size,
        currentChunkSize: end - start,
        fileName: file.name,
        filePath: query.path ? '/' + query.path.split().join('/') : '/',
        identifier: spark.end(),
        totalChunks: chunks,
        totalSize: file.size,
        file: new File([blobSlice.call(file, start, end)], file.name, {
          type: file.type,
        }),
        relativePath: file.webkitRelativePath,
      });
    }
  }

  async function uploadFile(
    num: number,
    paramsData: UploadFileDTO[],
    md5: string,
    dataIndex: number,
    uploaded: number[],
  ) {
    try {
      if (num < paramsData.length) {
        if (!uploaded || !uploaded.includes(num + 1)) {
          let formData = new FormData();
          formData.append('chunkNumber', `${paramsData[num].chunkNumber}`);
          formData.append('chunkSize', `${chunkSize}`);
          formData.append('fileName', paramsData[num].fileName);
          formData.append('currentChunkSize', `${paramsData[num].currentChunkSize}`);
          formData.append('filePath', paramsData[num].filePath);
          formData.append('identifier', md5);
          formData.append('totalChunks', `${paramsData[num].totalChunks}`);
          formData.append('totalSize', `${paramsData[num].totalSize}`);
          formData.append(
            'relativePath',
            paramsData[num].relativePath && paramsData[num].relativePath !== ''
              ? paramsData[num].relativePath
              : paramsData[num].fileName,
          );
          formData.append('file', paramsData[num].file);
          let res = await FileTransferService.upload(formData, {
            'Content-Type': 'multipart/form-data;',
          });
          if (res && res.success) {
            transferState.uploadData[dataIndex].progress = num + 1;
          } else {
            throw '';
          }
          if (!transferState.uploadData[dataIndex].isSuspend) {
            uploadFile(++num, paramsData, md5, dataIndex, uploaded);
          }
        } else {
          transferState.uploadData[dataIndex].progress = num + 1;
          if (!transferState.uploadData[dataIndex].isSuspend) {
            uploadFile(++num, paramsData, md5, dataIndex, uploaded);
          }
        }
      } else {
        transferState.limitNumber--;
        if (state) {
          state.currentPage = 1;
          state.onSearch(false, dataIndex === transferState.uploadData.length - 1);
        } else {
          store._actions.actionSetTestData[0]();
        }
        transferState.uploadData[dataIndex].status = 'success';
        transferState.uploadData[dataIndex].isSuspend = false;
      }
    } catch (error) {
      transferState.uploadData[dataIndex].status = 'exception';
    }
  }
};
