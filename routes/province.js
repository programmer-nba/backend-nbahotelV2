var express = require('express');
var router = express.Router();
const Province = require('../service/provinceservice');


//ยังไม่ได้ใช้
router.get('/',Province.getProvince);

module.exports = router;