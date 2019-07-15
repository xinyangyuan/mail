const s3 = require('../utils/aws');

/*
  Async helper function
*/

const async_wrapper = promise =>
  promise.then(data => ({ data, error: null })).catch(error => ({ error, data: null }));

/*
  Function: generate filename
*/
const generateFilename = (req, file) => {
  // get file extention from original filename string
  const ext = file.originalname.split('.').slice(-1)[0];

  // default filename body
  const name = 'From_' + req.userData.userId + '_To_' + req.body.receiverId + '_' + file.filename;

  // return filename
  filename = new Date().toISOString() + '_' + name + '.' + ext;
  return filename;
};

/*
  Middleware: save file to S3 Bucket#
*/

module.exports = async (req, res, next) => {
  // req.files: {envelop: [Object], contentPDF: [Object]}
  // Object.values(req.files) => [[Object], [Object]]
  // .flat() => [Object, Object]
  const files = Object.values(req.files).flat();
  const filenames = [];

  for (let file of files) {
    // generate distinct filename
    filename = generateFilename(req, file);
    filenames.push(filename);

    // s3 bucket to store the static file
    var params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    // async: upload file to s3 bucket
    const { error, data: uploadedFile } = await async_wrapper(s3.upload(params).promise());

    if (error) {
      res.status(500).json({ message: error });
    } else {
      res.fileDate = filename;
    }
  }

  // store filename (also the key to access file in S3) into req
  req.fileData = {
    envelopKey: filenames[0],
    contentPDFKey: filenames[1]
  };
  next();
};
