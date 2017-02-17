var express = require('express');
var audioCtrl = express.Router();

audioCtrl.get('/waveform', function(req, res, next) {
  res.render('waveform',{ title: 'WAVVEZ'});
});

audioCtrl.get('/', function(req, res, next) {
  res.render('sphere',{ title: 'SPHERE'});
});

audioCtrl.get('/square', function(req, res, next) {
  res.render('square',{ title: 'SQUARE'});
});

audioCtrl.get('/line', function(req, res, next) {
  res.render('lines',{ title: 'LINE'});
});

// audioCtrl.get('/', function(req, res, next) {
//   res.render('spiral',{ title: 'SPIRAL'});
// });

audioCtrl.get('/test', function(req, res, next) {
  res.render('test',{ title: 'test'});
});


audioCtrl.get('/plane', function(req, res, next) {
  res.render('plane',{ title: 'PLANE'});
});

module.exports = audioCtrl;
