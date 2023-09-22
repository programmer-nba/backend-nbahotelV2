var express = require('express');
var router = express.Router();
const Invitation = require('../controllers/invitation.controller');
var adminAuth = require('../authentication/adminAuth');

router.get('/',adminAuth,Invitation.Recieve);
router.post('/',adminAuth,Invitation.Create);


module.exports = router;