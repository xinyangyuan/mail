const s3 = require('../utils/aws');
const time = new Date().toISOString();

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
  const name = 'From_' + req.userData.userId + '_To_' + req.body.receiverId + '_' + file.fieldname;

  // return filename
  let filename = time + '_' + name + '.' + ext;

  // add pseude folder directory receiverId/content/filename or receiverId/envelop/filename, file.fieldname = contentPDF | envelop
  filename = req.body.receiverId + '/' + time + '/' + filename;

  return filename;
};

/*
  Middleware: save file to S3 Bucket#
*/

module.exports = async (req, res, next) => {
  // req.files: undefined prototype
  // Object.entries(req.files) => []
  // req.files: {envelop: [Object], contentPDF: [Object]}
  // Object.entries(req.files) => [ [ 'envelop', [Object] ], [ 'contentPDF', [Object] ] ]
  const files = Object.entries(req.files);
  const filenames = {};

  for (const [fieldname, file] of files) {
    // generate distinct filename
    filename = generateFilename(req, file[0]); // [Object] => Object
    filenames[fieldname] = filename;

    // s3 bucket to store the static file
    var params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
      Body: file[0].buffer,
      ContentType: file[0].mimetype
    };

    // async: upload file to s3 bucket
    const { error, data: uploadedFile } = await async_wrapper(s3.upload(params).promise());

    if (error) {
      return res.status(500).json({
        message: error
      });
    }
  }

  // store filename (the key to access file in S3) into req
  req.fileData = {
    envelopKey: filenames.envelop, // will be undefined type when res.files undefined
    contentPDFKey: filenames.contentPDF // will be undefined type when res.files undefined
  };
  next();
};
