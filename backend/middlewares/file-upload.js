const multer = require('multer');

/*
  Setup disk storage
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
  Setup file filter
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
    req.error = {
      message: 'Invalid file type uploaded!'
    };
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter
}).fields([{ name: 'contentPDF', maxCount: 1 }, { name: 'envelop', maxCount: 1 }]);