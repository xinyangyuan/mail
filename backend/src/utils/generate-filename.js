const time = new Date().toISOString();

const generateFilename = (file, mail) => {
  // get file extention from original filename string
  const ext = file.originalname.split('.').slice(-1)[0];

  // file.fieldname = contentPDF | envelop
  filename = time + '_' + file.fieldname + '.' + ext;

  // pseude folder directory: reciverId/mailId/filename
  fullpath = mail.receiverId._id + '/' + mail._id + '/' + filename;

  return fullpath;
};

module.exports = generateFilename;
