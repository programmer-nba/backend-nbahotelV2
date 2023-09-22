var express = require('express');
var router = express.Router();
const Role = require('../controllers/role.controller');
var adminAuth = require('../authentication/adminAuth');

router.get('/',adminAuth,Role.GetAll);
router.post('/',adminAuth,Role.Create);
router.patch('/:id',adminAuth,Role.Update);
router.delete('/:id',adminAuth,Role.Delete);

module.exports = router;