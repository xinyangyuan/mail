const express = require('express');
const router = express.Router();

// subscription api routes
router.get(''); // get all subscription associated with a user
router.get('/:id'); // get specific subscription
router.patch(''); // create new payment doc

module.exports = router;
