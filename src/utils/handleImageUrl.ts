import { imageType, SERVER } from '@/const';
import { getImage } from '@/assets';

export const handleImageUrl = (fileType: FileType, fileId?: string, noneImg?: boolean): string => {
  if (imageType.includes(fileType) && fileId && !noneImg) {
    return `/api${SERVER}/file/transfer/preview?id=${fileId}&isMin=true`;
  }
  return getImage(fileType);
};
