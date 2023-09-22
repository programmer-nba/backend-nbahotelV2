var express = require('express');
var router = express.Router();
const Api = require('../controllers/api.controller');

//search hotel
router.post('/search',Api.Search);
router.post('/booking',Api.CreateBooking);
router.post('/booking-confirm',Api.ConfirmBooking);
router.post('/booking-cancel',Api.CancelBooking);
router.post('/changedate',Api.ChangeCheckinDate);
router.post('/changedate-confirm',Api.ConfirmChangeDate);

module.exports = router