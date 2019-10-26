const aqp = require('api-query-params');

/*
  Middleware: advanced query results
  FIXME: when user enter a wrong data-type to a field causes filter error
  FIXME: e.g., _id=asdfs or _id=true is passed || a nested field passes with value receivers=asdf
  FIXME: extra validation steps are needed!
*/

const query = (req, res, next) => {
  // Copy request query
  let query = { ...req.query };

  // Sanitization
  // @desc: remove $ from query string
  let queryStr = JSON.stringify(query).replace(/\$/g, ``);

  // Case conversion for boolean
  // @desc: TRUE|True|TrUE ... => true (vice versa for false)
  queryStr = queryStr.replace(/true/gi, `true`);
  queryStr = queryStr.replace(/false/gi, `false`);
  query = JSON.parse(queryStr);

  // Pagination
  // @params: limit, skip or (pageSize, currentPage)
  // @default: {limit: `50`, skip: `0`} => {limit: 50, skip: 0}
  const { pageSize, currentPage } = query;
  pageSize && delete query.pageSize;
  currentPage && delete query.currentPage;

  // limit
  if (query.limit) {
    // pass
  } else if (pageSize) {
    query.limit = `${pageSize}`;
  } else {
    query.limit = `50`; // default
  }

  // skip
  if (query.skip) {
    //pass
  } else if (pageSize && currentPage) {
    query.skip = `${pageSize * currentPage}`;
  } else {
    query.skip = `0`; // default
  }

  // Sorting
  // @params: sort, sortBy
  // @default: sort='-updatedAt' => {sort: {updatedAt : -1}}
  const { sortBy } = query;
  sortBy && delete query.sortBy;

  // sort
  if (query.sort) {
    // pass
  } else if (sortBy) {
    query.sort = sortBy;
  } else {
    query.sort = `-updatedAt`; // default
  }

  // Filter
  // @params: all non-reserved key query words
  // @operators: `=` `>` `>=` `<` `<=` `!=`
  // reference: https://github.com/loris/api-query-params
  const { filter, skip, limit, sort } = aqp(query);

  // Return
  req.queryData = Object.freeze({ filter, skip, limit, sort });
  next();
};

module.exports = query;
