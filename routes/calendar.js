var express = require('express');
var router = express.Router();
const partnerAuth = require('../authentication/partnerAuth');
const Calender = require('../controllers/calendar.controller'); 

router.get('/:id',partnerAuth.verifyTokenpartner,Calender.getBookingDetails);

module.exports = router;