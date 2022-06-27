type FolderVO = {
  /** 文件名 */
  fileName: string;

  /** 文件路径 */
  filePath: string;

  /** ID */
  id: string;

  /** 是否父节点 */
  isParent: string;

  /** 父级ID */
  parentId: string;

  /** 所有子级 */
  children: FolderVO[];
};
