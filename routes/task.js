var express = require('express');
var router = express.Router();
const Task = require('../controllers/task.controller');
const partnerAuth = require('../authentication/partnerAuth');

router.get('/:id',partnerAuth,Task.getTask);
router.patch('/:id/done',partnerAuth,Task.doneTask);
router.delete('/:id',partnerAuth,Task.deleteTask);

module.exports = router;