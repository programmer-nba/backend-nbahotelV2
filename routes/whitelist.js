var express = require('express');
var router = express.Router();
var Domain = require('../bin/whitelist')
var adminAuth = require('../authentication/adminAuth');


//ยังไม่ได้ใช้
router.get('/', adminAuth,async (req,res)=>{
return res.send(Domain.whitelist)
})

module.exports = router;