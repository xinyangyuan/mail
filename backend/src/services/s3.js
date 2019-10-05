const s3 = require('../utils/aws');

/*
  s3 object:
*/

exports.s3 = s3;

/*
  Upload File:
*/

exports.uploadFile = async (file, filename) => {
  try {
    // param
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    // $1: upload file
    return s3.upload(params).promise();
  } catch {
    console.log('s3 file upload error');
    throw Error;
  }
};
