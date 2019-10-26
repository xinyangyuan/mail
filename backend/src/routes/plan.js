const express = require('express');

const query = require('../middlewares/query');
const { protect, authorize } = require('../middlewares/auth');
const controller = require('../controllers/plan');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', query, controller.getPlans);
router.get('/:id', controller.getPlan);

/*
   [PATCH] Endpoint
*/

router.patch('/:id', protect, authorize('ADMIN'), controller.updatePlan);

/*
   [POST] Endpoint
*/

router.post('', protect, authorize('ADMIN'), controller.updatePlan);

/*
   [DEL] Endpoint
*/

router.delete('/:id', protect, authorize('ADMIN'), controller.deletePlan);

module.exports = router;
