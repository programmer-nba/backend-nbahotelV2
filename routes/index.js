var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nba Hotel api' });
});

router.get('/image',function(req, res, next) {
  res.render('image');
})

module.exports = router;
