var express = require('express');
var audioCtrl = express.Router();

audioCtrl.get('/', function(req, res, next) {
  res.render('audiovis',{ title: 'Three JS Particle Audio Visualization'});
});

audioCtrl.get('/lines', function(req, res, next) {
  res.render('lines',{ title: 'Three JS Line Audio Visualization'});
});

audioCtrl.get('/waveform', function(req, res, next) {
  res.render('waveform',{ title: 'Three JS Line Audio Visualization'});
});

module.exports = audioCtrl;
