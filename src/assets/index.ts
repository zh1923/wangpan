import file_avi from './file/file_avi.png';
import file_dir from './file/file_dir.png';
import file_dmg from './file/file_dmg.png';
import file_docx from './file/file_docx.png';
import file_empty from './file/file_empty.png';
import file_excel from './file/file_excel.png';
import file_exe from './file/file_exe.png';
import file_html from './file/file_html.png';
import file_img from './file/file_img.png';
import file_jar from './file/file_jar.png';
import file_js from './file/file_js.png';
import file_json from './file/file_json.png';
import file_less from './file/file_less.png';
import file_multiple from './file/file_multiple.png';
import file_music from './file/file_music.png';
import file_pdf from './file/file_pdf.png';
import file_ppt from './file/file_ppt.png';
import file_rar from './file/file_rar.png';
import file_sass from './file/file_sass.png';
import file_scss from './file/file_scss.png';
import file_sql from './file/file_sql.png';
import file_svg from './file/file_svg.png';
import file_txt from './file/file_txt.png';
import file_unknown from './file/file_unknown.png';
import file_vue from './file/file_vue.png';
import file_word from './file/file_word.png';
import file_zip from './file/file_zip.png';

export const getImage = (fileType: FileType): any => {
  switch (fileType) {
    case 'avi':
      return file_avi;
    case 'dir':
      return file_dir;
    case 'dmg':
      return file_dmg;
    case 'doc':
    case 'docx':
      return file_docx;
    case 'empty':
      return file_empty;
    case 'xlsx':
      case 'excel':
      return file_excel;
    case 'exe':
      return file_exe;
    case 'jpg':
    case 'png':
    case 'jpeg':
    case 'gif':
    case 'mp4':
    case 'img':
      return file_img;
    case 'html':
      return file_html;
    case 'jar':
      return file_jar;
    case 'js':
      return file_js;
    case 'json':
      return file_json;
    case 'less':
      return file_less;
    case 'music':
      return file_music;
    case 'pdf':
      return file_pdf;
    case 'ppt':
    case 'pptx':
      return file_ppt;
    case 'rar':
      return file_rar;
    case 'sass':
      return file_sass;
    case 'scss':
      return file_scss;
    case 'sql':
      return file_sql;
    case 'svg':
      return file_svg;
    case 'txt':
      return file_txt;
    case 'vue':
      return file_vue;
    case 'word':
      return file_word;
    case 'zip':
      return file_zip;
    case 'multiple':
      return file_multiple;
    default:
      return file_unknown;
  }
};
