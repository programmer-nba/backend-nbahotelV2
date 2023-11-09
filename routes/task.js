var express = require('express');
var router = express.Router();
const Task = require('../controllers/task.controller');
const partnerAuth = require('../authentication/partnerAuth');


//ยังไม่ได้ใช้
router.get('/:id',partnerAuth.verifyTokenpartner,Task.getTask);
router.patch('/:id/done',partnerAuth.verifyTokenpartner,Task.doneTask);
router.delete('/:id',partnerAuth.verifyTokenpartner,Task.deleteTask);

module.exports = router;