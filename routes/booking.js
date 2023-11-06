var express = require('express');
var router = express.Router();
const Booking = require('../controllers/booking.controller')
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth');
var apiPartnerAuth = require('../authentication/apiPartnerAuth');

router.get('/all',adminAuth,Booking.GetAll);
router.get('/:id',partnerAuth.verifyTokenpartner,Booking.getBookingByHotelId);
router.get('/range/:id',adminAuth,Booking.getBookingByRange);
router.get('/:id/:bookingId',partnerAuth.verifyTokenpartner,Booking.getBookingById);
router.patch('/:id',adminAuth,Booking.Update); // date

//accept
router.patch('/accept/:id/:bookingId',partnerAuth.verifyTokenpartner,Booking.Accept);
router.patch('/reject/:id/:bookingId',partnerAuth.verifyTokenpartner,Booking.Reject);

module.exports = router;