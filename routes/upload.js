var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer();
const mega = require('../service/uploadservice');
const ImgBB = require('../service/uploadImgBB');


//ไม่ได้ใช้
 router.use('/mega',mega);

 router.use('/imgbb',ImgBB)

module.exports = router;
