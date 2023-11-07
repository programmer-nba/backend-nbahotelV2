var express = require('express');
var router = express.Router();
const Booking = require('../controllers/booking.controller')
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth')
const memberAuth = require('../authentication/memberauth')
var apiPartnerAuth = require('../authentication/apiPartnerAuth')

// router.get('/all',partnerAuth.verifyTokenpartner,Booking.GetAll);
// router.get('/:id',partnerAuth.verifyTokenpartner,Booking.getBookingByHotelId);
// router.get('/range/:id',partnerAuth.verifyTokenpartner,Booking.getBookingByRange);
// router.get('/:id/:bookingId',partnerAuth.verifyTokenpartner,Booking.getBookingById);
// router.patch('/:id',partnerAuth.verifyTokenpartner,Booking.Update); // date
//router.get('/range/:id',Booking.getBookingByRange)
// //accept
// router.patch('/accept/:id/:bookingId',partnerAuth.verifyTokenpartner,Booking.Accept);
// router.patch('/reject/:id/:bookingId',partnerAuth.verifyTokenpartner,Booking.Reject);

//สร้าง 
router.post('/',memberAuth.verifyTokenmember,Booking.addbooking)
//เรียกข้อมูลการจอง
router.get('/',partnerAuth.verifyTokenpartner,Booking.GetAll)
//เรียกข้อมูลการจอง ตาม id
router.get('/:id',Booking.GetByid)
//เรียกข้อมูลการจองตาม hotel_id
router.get('/hotel/:id',Booking.GetByhotel)
//เรียกข้อมูลการจองตาม room_id
router.get('/room/:id',Booking.GetByroom)
//เรียกข้อมูลการจอง ตาม member id
router.get('/member/:id',Booking.GetBymember)

//อนุมัติการจองห้อง
router.put('/AcceptBooking/:id',Booking.AcceptBooking)
//ไม่อนุมัติการจองห้อง
router.put('/UnacceptBooking/:id',Booking.unacceptbooking)
//จ่ายเงิน
router.put('/paymentBooking/:id',Booking.Payment)
//ยืนยันการจ่ายเงิน
router.put('/confirmBookingPayment/:id',Booking.confirmbookingpayment)
//ไม่ยืนยันการจ่ายเงิน
router.put('/Unconfirmbookingpayment/:id',Booking.unconfirmbookingpayment)


module.exports = router;