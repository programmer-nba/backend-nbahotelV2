var express = require('express');
var router = express.Router();
var Domain = require('../bin/whitelist')
var adminAuth = require('../authentication/adminAuth');

router.get('/', adminAuth,async (req,res)=>{
return res.send(Domain.whitelist)
})

module.exports = router;