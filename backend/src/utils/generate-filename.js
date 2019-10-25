const time = new Date().toISOString();

const generateFilename = (file, receiverId, mailId) => {
  // get file extention from original filename string
  const ext = file.originalname.split('.').slice(-1)[0];

  // file.fieldname = contentPDF | envelop
  filename = time + '_' + file.fieldname + '.' + ext;

  // pseude folder directory: reciverId/mailId/filename
  fullpath = receiverId + '/' + mailId + '/' + filename;

  return fullpath;
};

module.exports = generateFilename;
