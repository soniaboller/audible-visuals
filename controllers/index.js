var express = require('express');
var controller = express.Router();

/* GET home page. */
controller.get('/', function(req, res, next) {
  res.render('index', {
    title: 'three.js experiments'
  });
});

module.exports = controller;
