var express = require('express');
var router = express.Router();
var User = require('../controllers/user.controller');
var sessionAuth = require('../authentication/sessionAuth');
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth');

/* GET users listing. */
router.get('/',adminAuth, User.getAll);
router.get('/:id',partnerAuth, User.getById);

router.post('/me',sessionAuth,User.Me);

router.post('/signout',sessionAuth,User.SignOut);

//update user
router.patch('/update/:id',partnerAuth,User.Update);

//approve user
router.patch('/approved/:id',adminAuth,User.Approved);

//create user service
router.patch('/userservice/:id',partnerAuth,User.CreateUserService);

module.exports = router;
