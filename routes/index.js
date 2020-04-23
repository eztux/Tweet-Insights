var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('appLandingPage.ejs', { sentiment: {
    score: 12
  } });
});

module.exports = router;
