'use strict';

var browserify  = require('browserify');
var gulp        = require('gulp');

var concat    = require('gulp-concat');
var importCss = require('gulp-import-css');
var minifyCss = require('gulp-minify-css');
var nodemon   = require('gulp-nodemon');
var streamify = require('gulp-streamify');
var uglify    = require('gulp-uglify');

var source = require('vinyl-source-stream');

gulp.task('compile-js', function() {
  return browserify('client/js/splash.js')
    .bundle()
    .pipe(source('splash.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('public'));
});

gulp.task('compile-js', function() {
  return browserify('client/js/splash.js')
    .bundle()
    .pipe(source('splash.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('public'));
});

gulp.task('dev-css', function() {
  return gulp.src('client/css/*.css')
    .pipe(importCss())
    .pipe(concat('splash.min.css'))
    .pipe(gulp.dest('public'));
});

gulp.task('dev-js', function() {
  return browserify('client/js/splash.js')
    .bundle()
    .pipe(source('splash.min.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('dev', ['dev-css', 'dev-js'], function() {
  gulp.watch('./client/css/*.css', ['dev-css']);
  gulp.watch('./client/js/*.js', ['dev-js']);
  return nodemon({
    script: 'server',
    env: { NODE_ENV: 'development'},
    watch: ['server/**/*.js'],
  });
});

gulp.task('compile', ['compile-js', 'compile-css']);

gulp.task('server', ['compile'], function() {
  gulp.watch('./client/css/*.css', ['compile-css']);
  gulp.watch('./client/js/*.js', ['compile-js']);
  return nodemon({
    script: 'server',
    env: { NODE_ENV: 'development'},
    watch: ['server/**/*.js'],
  });
});
