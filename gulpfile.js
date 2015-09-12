'use strict';

var browserify  = require('browserify');
var gulp        = require('gulp');

var gulpIf    = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var nodemon   = require('gulp-nodemon');
var streamify = require('gulp-streamify');
var uglify    = require('gulp-uglify');
var cssCombo  = require('gulp-css-combo');

var source = require('vinyl-source-stream');

var isProduction = process.env.NODE_ENV === 'production';

gulp.task('compile-js', function() {
  return browserify('client/js/splash.js')
    .bundle()
    .pipe(source('splash.js'))
    .pipe(gulpIf(isProduction, streamify(uglify())))
    .pipe(gulp.dest('public'));
});

gulp.task('compile-css-splash', function() {
    return gulp.src('client/css/splash.css')
      .pipe(cssCombo())
      .pipe(gulpIf(isProduction, minifyCss('splash.css')))
      .pipe(gulp.dest('public'));
});

gulp.task('compile-css-projects', function() {
    return gulp.src('client/css/projects.css')
      .pipe(cssCombo())
      .pipe(gulpIf(isProduction, minifyCss('projects.css')))
      .pipe(gulp.dest('public'));
});

gulp.task('compile-css', ['compile-css-splash', 'compile-css-projects']);
gulp.task('compile', ['compile-js', 'compile-css']);

gulp.task('server', ['compile'], function() {
  gulp.watch('./client/css/*.css', ['compile-css']);
  gulp.watch('./client/js/*.js', ['compile-js']);
  return nodemon({
    script: 'server',
    env: { NODE_ENV: 'development'},
    watch: ['server/**/*'],
    ext: 'js json',
  });
});
