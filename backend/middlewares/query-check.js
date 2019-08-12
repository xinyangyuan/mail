const mongoose = require('mongoose');
const Mail = require('../models/mail');

/*
  Middleware: query input type check
*/

module.exports = (req, res, next) => {
  console.log('queryCheck is called');

  // default values
  let skip = 0;
  let limit = Infinity;
  let filterBy = {};
  let sortBy = { sort: { createdAt: -1 } };
  let ids = [];

  // error?
  let errorFlag = false;
  let message = 'Query Input Error: \n';

  /*
    Pagination:
  */

  // limit: Number
  if (typeof req.query.limit !== 'undefined') {
    // This conversion will alway be executed
    // Ex: +'adfabsdsf' will output NaN; +'1234' will output 1234
    // Cannot use typeof :: typeof +'adfas' = 'number'
    const limitQ = +req.query.limit;
    if (isNaN(limitQ)) {
      errorFlag = true;
      message = message + "- 'limit' should be a number. \n";
    } else if (limitQ < 0) {
      errorFlag = true;
      message = message + "- 'limit' should be a positive integer. \n";
    } else {
      // valid limit query
      limit = limitQ;
    }
  }

  // skip: Number
  if (typeof req.query.skip !== 'undefined') {
    const skipQ = +req.query.skip;
    if (isNaN(skipQ)) {
      errorFlag = true;
      message = message + "- 'skip' should be a number. \n";
    } else if (skipQ < 0) {
      errorFlag = true;
      message = message + "- 'skip' should be a postive integer. \n";
    } else {
      // valid skip query
      skip = skipQ;
    }
  }

  // pageSize: Number
  if (typeof req.query.pageSize !== 'undefined') {
    const pageSize = +req.query.pageSize;
    if (isNaN(pageSize)) {
      errorFlag = true;
      message = message + "- 'pageSize' should be a number. \n";
    } else if (pageSize < 1) {
      errorFlag = true;
      message = message + "- 'pageSize' should be a integer greater than 1. \n";
    } else {
      // valid pageSize query
      limit = pageSize;
    }
  }

  // currentPage: Number
  if (typeof req.query.currentPage !== 'undefined') {
    const currentPage = +req.query.currentPage;
    if (isNaN(currentPage)) {
      errorFlag = true;
      message = message + "- 'currentPage' should be a number. \n";
    } else if (currentPage < 1) {
      errorFlag = true;
      message = message + "- 'currentPage' should be a integer greater than 1. \n";
    } else {
      // valid currentPage query
      // limit is already updated by pageSize, will be inifinity if no valid pageSize -> set skip to 0
      // return all mails to user without skip
      skip = limit === Infinity ? 0 : (currentPage - 1) * limit;
    }
  }

  /*
    Sorting: TODO(change to capitalized query commands only)
  */

  // sortBy: 'title' || '-title' || 'createdAt' || '-createdAt' || 'content' ||'-content'
  if (typeof req.query.sortBy !== 'undefined') {
    const sortByQ = req.query.sortBy;
    if (!['title', '-title', 'createdAt', '-createdAt', 'content', '-content'].includes(sortByQ)) {
      errorFlag = true;
      message =
        message +
        "- 'sortBy' should be 'title' || '-title' || 'createdAt' || '-createdAt' || 'content' ||'-content'. \n";
    } else {
      // valid sortBy query
      sortBy = { sort: sortByQ };
    }
  }

  /*
    Filtering [multiple query API]:
  */

  // star: true || false
  if (typeof req.query.star !== 'undefined') {
    const starQ = req.query.star;
    switch (starQ) {
      case 'TRUE':
      case 'true':
      case 'True':
        filterBy = { ...filterBy, 'flags.star': true };
        break;
      case 'FALSE':
      case 'false':
      case 'False':
        filterBy = { ...filterBy, 'flags.star': false };
    }
  }

  // issue:
  if (typeof req.query.issue !== 'undefined') {
    const issueQ = req.query.issue;
    switch (issueQ) {
      case 'TRUE':
      case 'true':
      case 'True':
        filterBy = { ...filterBy, 'flags.issue': true };
        break;
      case 'FALSE':
      case 'false':
      case 'False':
        filterBy = { ...filterBy, 'flags.issue': false };
    }
  }

  // read:
  if (typeof req.query.read !== 'undefined') {
    const issueQ = req.query.read;
    switch (issueQ) {
      case 'TRUE':
      case 'true':
      case 'True':
        filterBy = { ...filterBy, 'flags.read': true };
        break;
      case 'FALSE':
      case 'false':
      case 'False':
        filterBy = { ...filterBy, 'flags.read': false };
    }
  }

  // status:
  if (typeof req.query.status !== 'undefined') {
    const statusQ = req.query.status;
    const validStatusList = Mail.schema.path('status').enumValues; // access allowed status string from Mail schema

    if (validStatusList.includes(statusQ)) {
      filterBy = { ...filterBy, status: statusQ };
    }
  }

  /*
    Filtering [single string query API]: (will overwrite previous filter query)
  */
  if (typeof req.query.filterBy !== 'undefined') {
    console.log('enter string filter api');
    const filterBysQ = req.query.filterBy.split(',');
    const validStatusList = Mail.schema.path('status').enumValues;

    for (const filterByQ of filterBysQ) {
      console.log(filterByQ);
      switch (filterByQ) {
        case 'STAR':
        case 'star':
          filterBy = { ...filterBy, 'flags.star': true };
          break;
        case '-STAR':
        case '-star':
          filterBy = { ...filterBy, 'flags.star': false };
          break;
        case 'ISSUE':
        case 'issue':
          filterBy = { ...filterBy, 'flags.issue': true };
          break;
        case '-ISSUE':
        case '-issue':
          filterBy = { ...filterBy, 'flags.issue': false };
          break;
        case 'READ':
        case 'read':
          filterBy = { ...filterBy, 'flags.read': true };
          break;
        case '-READ':
        case '-read':
          filterBy = { ...filterBy, 'flags.read': false };
      }
      if (validStatusList.includes(filterByQ)) {
        filterBy = { ...filterBy, status: filterByQ };
      }
    }
  }

  /*
    Multiple Document Manipulation:
  */

  // ids: MongoDb.ObjID[]
  if (typeof req.query.ids !== 'undefined') {
    // array of ids in query
    idsQ = req.query.ids.split(',');
    for (const idQ of idsQ) {
      if (mongoose.Types.ObjectId.isValid(idQ)) {
        // push the valid id to ids array
        ids.push(idQ);
      }
    }
  }

  /*
    Output:
  */

  // output data to controllers
  req.queryData = {
    skip: skip,
    limit: limit,
    filterBy: filterBy,
    sortBy: sortBy,
    ids: ids
  };
  console.log(req.queryData);
  next();

  // Error message
  //   if (errorFlag) {
  //     return res.status(404).json({ message: message });
  //   } else {
  //     next();
  //   }
};
