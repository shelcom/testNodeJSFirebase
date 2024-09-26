import multer from '@koa/multer';
import constants from 'constants/index';

const upload = multer({
  limits: {
    fileSize: constants.IMAGE.LIMIT.FILE_SIZE,
  },
});

export default upload.single('image');
