const Mail = require('../models/mail');

// Helper Function: valid actions lookup table
const validActionLookupTable = (currentStatus, nxtStatus) => {
  const lookupTable = {
    CREATED: {
      CREATED: true,
      SCANNING: true,
      UNSCANNED_ARCHIVED: true
    },
    SCANNING: {
      SCANNING: true
      // SCANNED_ARCHIVED is set by pdf upload
    },
    UNSCANNED_ARCHIVED: {
      UNSCANNED_ARCHIVED: true,
      SCANNING: true,
      COLLECTED: true,
      TRASHED: true
    },
    SCANNED_ARCHIVED: {
      SCANNED_ARCHIVED: true,
      RE_SCANNING: true,
      COLLECTED: true,
      TRASHED: true
    },
    COLLECTED: {
      COLLECTED: true
    },
    TRASHED: {
      TRASHED: true
    }
  };
  let result = false;

  // invalid current state might will leads indexing in 'undefined' type, catch error
  try {
    // invalid nxtStatus will lead to 'undefined', set to false
    result = lookupTable[currentStatus][nxtStatus] || false;
  } catch {
    result = false;
  }

  return result;
};

/*
  Middleware: validate mail status update
*/

module.exports = async (req, res, next) => {
  console.log('updateVerify is called');

  // Case 1: only update mail(s) flag fields
  if (typeof req.body.status === 'undefined') {
    return next();
  }

  // Case 2: update multiple mails statuses
  if (typeof req.queryData !== 'undefined') {
    let validIds = [];
    try {
      const mails = await Mail.find({ _id: { $in: req.queryData.ids } }, '_id status');

      if (!mails.length) {
        return res.status(400).json({
          message: 'Failed to update mails!'
        });
      }

      for (const mail of mails) {
        if (validActionLookupTable(mail.status, req.body.status)) {
          validIds.push(mail._id);
        }
      }

      // overwrite query ids
      req.queryData.ids = validIds;
      return next();
    } catch {
      return res.status(500).json({
        message: 'Failed to update mails!'
      });
    }
  }

  // Case 3: update single mail status
  try {
    const mail = await Mail.findOne({ _id: req.params.id }, '_id status');
    if (validActionLookupTable(mail.status, req.body.status)) {
      next();
    } else {
      return res.status(400).json({
        message: 'Failed to update mails'
      });
    }
  } catch {
    return res.status(500).json({
      message: 'Failed to update mails'
    });
  }
};
