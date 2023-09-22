var express = require('express');
var router = express.Router();
const Admin = require('../controllers/admin.controller');


router.post('/',Admin.SignIn);

module.exports = router;