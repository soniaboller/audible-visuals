var express = require('express');
var audioCtrl = express.Router();


audioCtrl.get('/lines', function(req, res, next) {
  res.render('lines',{ title: 'LINEZ'});
});

audioCtrl.get('/waveform', function(req, res, next) {
  res.render('waveform',{ title: 'WAVVEZ'});
});

audioCtrl.get('/sphere', function(req, res, next) {
  res.render('sphere',{ title: 'SPHERE'});
});

audioCtrl.get('/', function(req, res, next) {
  res.render('audiovis',{ title: 'AUDVIZ'});
});

module.exports = audioCtrl;
