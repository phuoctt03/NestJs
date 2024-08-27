// multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './public/avt',
    filename: (req, file, callback) => {
      const fileExtName = extname(file.originalname);
      const fileName = `${Date.now()}${fileExtName}`;
      callback(null, fileName);
    },
  }),
};
