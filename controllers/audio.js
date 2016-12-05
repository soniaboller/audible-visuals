var express = require('express');
var audioCtrl = express.Router();

audioCtrl.get('/waveform', function(req, res, next) {
  res.render('waveform',{ title: '~ WAVVEZ ~'});
});

audioCtrl.get('/sphere', function(req, res, next) {
  res.render('sphere',{ title: '• SPHERE •'});
});

audioCtrl.get('/square', function(req, res, next) {
  res.render('square',{ title: '[ ] SQUARE [ ]'});
});

audioCtrl.get('/line', function(req, res, next) {
  res.render('lines',{ title: '— LINE —'});
});

audioCtrl.get('/plane', function(req, res, next) {
  res.render('plane',{ title: 'PLANE'});
});

module.exports = audioCtrl;
