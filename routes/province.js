var express = require('express');
var router = express.Router();
const Province = require('../service/provinceservice');

router.get('/',Province.getProvince);

module.exports = router;