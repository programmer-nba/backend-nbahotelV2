var express = require('express');
var router = express.Router();
const Invitation = require('../controllers/invitation.controller');
var adminAuth = require('../authentication/adminAuth');


//ยังไม่ได้ใช้
router.get('/',adminAuth,Invitation.Recieve);
router.post('/',adminAuth,Invitation.Create);


module.exports = router;