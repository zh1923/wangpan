type HomeState = {
  loading?: boolean;

  /** 全选选择框的的 半选 */
  indeterminate?: boolean;

  /** 控制全选的选中状态 */
  checkAll?: boolean;

  /** 控制列表或表格中的选择 */
  checkItem: string[];

  /** 数据 */
  mockData: Partial<FilePageVO>[];

  /** 列表或表格中的多选 方法 */
  checkboxItem: () => void;

  /** 全选 方法 */
  checkboxAll: () => void;

  path: string[];

  /** 跳转文件夹 */
  jump: (item: Partial<DataType>, isEdit?: boolean) => void;

  /** 重命名 */
  rename: (item: Partial<DataType>) => void;

  /** 确认重命名 */
  confirmRename: (item?: Partial<DataType>) => void;

  /** 取消重命名 */
  cancelRename: (item?: Partial<DataType>) => void;

  /** 当前位置 */
  currentPage: number;

  /** 总数 */
  total: number;

  /** 搜索
   * @isRoll 是否是滚动查询更多
   * @isCategory 是否是切换分类
   */
  onSearch: (isRoll?: boolean, isCategory?: boolean) => void;

  fileOperation: (operationType: 'move' | 'copy' | 'delete', item?: Partial<DataType>) => void;

  /** 确认 移动/复制/删除 操作 */
  fileOperationConfirm: (
    operationType: 'move' | 'copy' | 'delete',
    folderParams?: string[],
  ) => void;

  getDetail: () => void;

  /** 是否是新建文件夹 */
  isFolder: boolean;

  folderForm: Partial<{
    name: string;
    time: date;
  }>;

  /** 下载 */
  uploadFile: (item?: Partial<DataType>) => void;

  /** 搜索输入内容 */
  searchContent?: string;

  /** 是否是搜索 */
  isSearch?: boolean;

  // 文件修改
  codeEditShow?: boolean;

  codeForm: Partial<{
    title: '';
  }>;
};
