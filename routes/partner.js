var express = require('express');
var router = express.Router();
var adminAuth = require('../authentication/adminAuth');
const Partner = require('../controllers/partner.controller');


router.get('/',adminAuth, Partner.GetAll);
router.get('/:id',adminAuth, Partner.GetById);
router.post('/create',adminAuth,Partner.Create);

module.exports = router;