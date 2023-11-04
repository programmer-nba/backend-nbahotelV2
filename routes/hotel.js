const express = require('express');
const router = express.Router();

// controller Hotel
const Hotel = require('../controllers/hotel.controller')
const Category = require('../controllers/hotel.category.controller')
const Amenities = require('../controllers/hotel.amenities.controller')
const Highlight = require('../controllers/hotel.highlight.controller')
const Certificate = require('../controllers/hotel.certificate.controller')
const Picture = require('../controllers/hotel.picture.controller')
//auth
const adminAuth = require('../authentication/adminAuth')
const partnerAuth = require('../authentication/partnerAuth')


//ประเภทโรงแรม
//เรียกใช้ข้อมูล category โรงแรมทั้งหมด
router.get('/category',Category.GetAll)
//เรียกเพิ่มข้อมูลประเภทโรงแรม
router.post('/category',adminAuth,Category.Create);
//แก้ไขข้อมูลประเภทโรงแรม
router.patch('/category/:id',adminAuth,Category.Update);
//ลบข้อมูลประเภทโรงแรม
router.delete('/category/:id',adminAuth,Category.Delete);


//ข้อมูลสิ่งอำนวยความสะดวก
router.get('/amenities/',Amenities.GetAll);
router.post('/amenities',adminAuth,Amenities.Create);
router.patch('/amenities/:id',adminAuth,Amenities.Update);
router.delete('/amenities/:id',adminAuth,Amenities.Delete);

//Highlight (สิ่งที่น่าสนใจใกล้ที่พัก)
router.get('/highlight',Highlight.GetAll);
router.post('/highlight',adminAuth,Highlight.Create)
router.patch('/highlight/:id',adminAuth,Highlight.Update)
router.delete('/highlight/:id',adminAuth,Highlight.Delete)

//certificate ข้อมูลการรับรองของโรงแรม
router.get('/certificate',Certificate.GetAll);
router.post('/certificate',adminAuth,Certificate.Create);
router.patch('/certificate/:id',adminAuth,Certificate.Update);
router.delete('/certificate/:id',adminAuth,Certificate.Delete);


router.get('/',adminAuth,Hotel.GetAll);
router.get('/:id',partnerAuth,Hotel.GetById);
router.post('/:id',partnerAuth, Hotel.Create); //send partner id to create a new hotel
router.patch('/:id/:userId',partnerAuth,Hotel.Update);
router.delete('/:id',adminAuth,Hotel.Delete);

// //picture management
// router.post('/:id/picture',partnerAuth,Picture.Create);
// router.delete('/:id/picture/:pictureid',partnerAuth,Picture.Delete);




module.exports = router