const express = require('express');

const PlanController = require('../controllers/plan');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', PlanController.getPlanList); // PUBLIC ACCESSIBLE
router.get('/:id', PlanController.getPlan); // PUBLIC ACCESSIBLE

/*
   [POST] Endpoint
*/

// router.post('', PlanController.createPlan);

module.exports = router;
