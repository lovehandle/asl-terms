const gulp = require('gulp'),
      gutil = require('gulp-util'),
      concat = require('gulp-concat'),
      browserify = require('gulp-browserify'),
      compass = require('gulp-compass'),
      connect = require('gulp-connect');

var jsSources = [
  'js/main.js',
  'js/vendor/*.js'
];

var sassSources = [
  'scss/application.scss',
  'scss/vendor/materialize.scss'
];


gulp.task('js', function () {
  gulp.src(jsSources)
    .pipe(concat('application.js'))
    .pipe(browserify())
    .pipe(gulp.dest('./js'))
});

gulp.task('compass', function () {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'scss',
      image: 'img',
      style: 'expanded'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('./css'))

});

gulp.task('connect', function () {
  connect.server({
    root: '.',
    livereload: true
  })
})

gulp.task('watch', function () {
  gulp.watch('scss/*.scss', ['compass']);
  gulp.watch('jsSources', ['js']);
});

gulp.task('default', ['connect','watch']);
