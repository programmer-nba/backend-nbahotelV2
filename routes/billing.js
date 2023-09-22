var express = require('express');
var router = express.Router();
var partnerAuth = require('../authentication/partnerAuth');
var adminAuth = require('../authentication/adminAuth');
const Billing = require('../controllers/billing.controller');

router.post('/',adminAuth,Billing.getAllBilling)
router.get('/:id',partnerAuth,Billing.GetBilling);
router.get('/:id/summary',partnerAuth,Billing.getBillingSummary)

module.exports = router;