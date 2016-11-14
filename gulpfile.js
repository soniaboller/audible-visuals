'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('Nodemon', restartServer);

function restartServer() {
    nodemon({
        script: './bin/www',
        ext: 'js hbs scss sql'
    });
}

gulp.task('default', ['Nodemon']);