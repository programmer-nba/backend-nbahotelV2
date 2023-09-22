var express = require('express');
var router = express.Router();
const Checkin = require('../controllers/checkin.controller');
var partnerAuth = require('../authentication/partnerAuth');
//checked in out
router.post('/verifycheckinuser',partnerAuth,Checkin.VerifyCheckedInUser);
router.post('/confirm-otp',partnerAuth,Checkin.ConfirmCheckin)
router.post('/checkout/:id',partnerAuth,Checkin.CheckOut);

//fake api
router.post('/fackAccept',Checkin.FakeAccept);
router.post('/fakecheckin',Checkin.FakeCheckin);
router.post('/fakecheckout',Checkin.FakeCheckout);

module.exports = router;