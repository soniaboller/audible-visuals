var express = require('express');
var audioCtrl = express.Router();

audioCtrl.get('/', function(req, res, next) {
  res.render('audiovis',{ title: 'AUDVIZ'});
});

audioCtrl.get('/lines', function(req, res, next) {
  res.render('lines',{ title: 'LINEZ'});
});

audioCtrl.get('/waveform', function(req, res, next) {
  res.render('waveform',{ title: 'WAVEZ'});
});

module.exports = audioCtrl;
