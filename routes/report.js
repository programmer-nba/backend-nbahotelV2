var express = require('express');
var router = express.Router();
var partnerAuth = require('../authentication/partnerAuth');

const Report = require('../controllers/report.controller');

//search hotel
router.get('/:id',partnerAuth.verifyTokenpartner,Report.GetAll);

module.exports = router