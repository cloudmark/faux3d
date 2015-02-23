'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var concat= require('gulp-concat');
var uglify = require('gulp-uglify');
var karma = require('karma').server;
gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  ts: ['src/app/faux3d/elements/**/*.ts',
    'src/app/faux3d/events/**/*.ts',
    'src/app/faux3d/utils/**/*.ts',
    'src/app/faux3d/world/**/*.ts'],

  app: ['src/app/faux3d/app.ts']
};
require('require-dir')('./gulp');

var tsOptions = {
  sortOutput: false,
  declarationFiles: true,
  noExternalResolve: false,
  removeComments: true
};

gulp.task('scripts', function() {
  gulp.src(gulp.paths.app).pipe(ts(tsOptions)).js
    .pipe(gulp.dest(gulp.paths.dist + '/release/js/'));

  var tsResult = gulp.src(gulp.paths.ts).pipe(ts(tsOptions));
  merge([
    tsResult.js.pipe(concat('engine.js'))
      // .pipe(uglify('engine.js'))
      .pipe(gulp.dest(gulp.paths.dist + '/release/js')),

    tsResult.dts.pipe(gulp.dest(gulp.paths.dist + '/release/definitions'))]
  );
});

gulp.task('watch', ['scripts'], function() {
  gulp.watch([gulp.paths.app, gulp.paths.ts], ['scripts']);
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
