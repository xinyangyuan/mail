const multer = require('multer');

//  Disk Storage or Memory Storage; turn off if want to have copy in server
const MEMORY_STORAGE = true;

/*
  Setup: disk storage settings
*/

const destination = (req, file, cb) => {
  if (file.fieldname === 'contentPDF') {
    cb(null, 'backend/data/content');
  } else if (file.fieldname === 'envelop') {
    cb(null, 'backend/data/envelop');
  }
};

const filename = (req, file, cb) => {
  // get file extention from original filename string
  const ext = file.originalname.split('.').slice(-1)[0];
  // default filename body
  const name = 'From_' + req.userData.userId + '_To_' + req.body.receiverId + '_' + file.filename;
  // return callback
  cb(null, new Date().toISOString() + '_' + name + '.' + ext);
};

const storage = multer.diskStorage({
  destination: destination,
  filename: filename
});

/*
  Setup: file-type filter
*/

const IMG_MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const fileFilter = (req, file, cb) => {
  // check the file type of mail content
  if (file.fieldname === 'contentPDF' && file.mimetype === 'application/pdf') {
    cb(null, true);
  }
  // check the file  type f mail envelop
  else if (file.fieldname === 'envelop' && IMG_MIME_TYPE_MAP[file.mimetype]) {
    cb(null, true);
  }
  // invalie file type
  else {
    cb(null, false);
    // notice controller the error in file type
    req.fileTypeError = {
      message: 'Invalid file type uploaded!'
    };
  }
};

/*
  Middleware: multer multi-fields files upload
*/

module.exports = multer({
  storage: MEMORY_STORAGE ? multer.memoryStorage() : storage,
  fileFilter: fileFilter
}).fields([{ name: 'contentPDF', maxCount: 1 }, { name: 'envelop', maxCount: 1 }]);

/*
{
  [Object: null prototype]
  envelop: [
    {
      fieldname: 'envelop',
      originalname: '下载.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 90 00 00 01 2c 08 06 00 00 00 ed b7 e5 c2 00 00 20 00 49 44 41 54 78 5e ec 9d 05 98 15 57 9a ... 77840 more bytes>,
      size: 77890
    }
  ]
}
*/
