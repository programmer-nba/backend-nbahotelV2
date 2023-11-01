var express = require('express');
var router = express.Router();
const Admin = require('../controllers/admin.controller');

router.post('/create', Admin.createAdmin);
router.post('/',Admin.SignIn);

module.exports = router;