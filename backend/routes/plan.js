const express = require('express');

const PlanController = require('../controllers/plan');

const router = express.Router();

// Address api routes
router.get('', PlanController.getPlanList); // PUBLIC ACCESSIBLE
router.get('/:id', PlanController.getPlan); // PUBLIC ACCESSIBLE

router.post('', PlanController.createPlan);

module.exports = router;
