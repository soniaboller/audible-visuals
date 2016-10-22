var express = require('express');
var audioCtrl = express.Router();

/* GET users listing. */
audioCtrl.get('/', function(req, res, next) {
  res.render('audiovis',{ title: 'Three JS Audio Visualization'});
});

module.exports = audioCtrl;
