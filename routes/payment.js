var express = require('express');
var router = express.Router();
const Payment = require('../controllers/prepayment.controller');
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth')

router.get('/',adminAuth,Payment.GetAll);
router.get('/:id',partnerAuth.verifyTokenpartner,Payment.GetHotelPaymentSlip);
router.get('/:id/:payment_number',partnerAuth.verifyTokenpartner,Payment.GetHotelPaymentSlipByPaymentNumber);
router.post('/',adminAuth,Payment.CreatePrepayment);
router.post('/uploadslip/:id',adminAuth,Payment.UploadSlip);

module.exports = router;