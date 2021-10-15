var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  res.json({});
});

router.post('/login', (req, res) => {
  res.json({});
});

router.post('/change-password', (req, res) => {
  res.json({});
});

router.get('/reset/:token', (req, res) => {
  res.json({});
});

module.exports = router;
