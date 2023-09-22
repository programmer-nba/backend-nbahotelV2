var express = require('express');
var router = express.Router();
const Booking = require('../controllers/booking.controller')
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth');
var apiPartnerAuth = require('../authentication/apiPartnerAuth');

router.get('/all',adminAuth,Booking.GetAll);
router.get('/:id',partnerAuth,Booking.getBookingByHotelId);
router.get('/range/:id',adminAuth,Booking.getBookingByRange);
router.get('/:id/:bookingId',partnerAuth,Booking.getBookingById);
router.patch('/:id',adminAuth,Booking.Update); // date

//accept
router.patch('/accept/:id/:bookingId',partnerAuth,Booking.Accept);
router.patch('/reject/:id/:bookingId',partnerAuth,Booking.Reject);

module.exports = router;