const express = require('express');

const query = require('../middlewares/query');
const { protect, authorize } = require('../middlewares/auth');
const validator = require('../middlewares/validators/subscription');
const controller = require('../controllers/subscription');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', protect, controller.getSubscriptions);
router.get('/:id', protect, controller.getSubscription);

/*
   [PATCH] Endpoint
*/

router.patch('/:id', protect, controller.updateSubscription);

/*
   [POST] Endpoint
*/

router.post('', protect, validator.createSubscription, controller.createSubscription);

/*
   [DEL] Endpoint - soft | hard
*/

router.delete('/:id', protect, controller.cancelSubscription);

module.exports = router;
