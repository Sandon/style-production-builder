var gulp = require('gulp'),
  less = require('gulp-less'),
  minifycss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  Path = require('path'),
  gutil = require('gulp-util'),
  browserify = require('browserify'),
  babelify= require('babelify'),
  babel = require("gulp-babel");

var inputDir = process.argv[3];
var outputDir = process.argv[5];

/*
 * task : copy
 */
gulp.task('copy', function () {
  return gulp.src(Path.resolve(inputDir, './**/*.*'))
    .pipe(gulp.dest(outputDir));
});

/*
 * task : less
 */
gulp.task('less', function () {
  return gulp.src(Path.resolve(inputDir, './**/*.less'))
    .pipe(gulp.dest(outputDir))
    .pipe(less())
    .pipe(minifycss())
    .pipe(gulp.dest(outputDir));
  //.pipe(notify({ message: 'less task complete' }));
});

/*
 * task : css
 */
gulp.task('css', function () {
  return gulp.src(Path.resolve(inputDir, './**/*.css'))
    .pipe(minifycss())
    .pipe(gulp.dest(outputDir));
  //.pipe(notify({ message: 'css task complete' }));
});

/*
 * task : scripts
 */
/*gulp.task('scripts', function () {
  return gulp.src(Path.resolve(inputDir, './!**!/!*.js'))
    .pipe(uglify({mangle: false}).on('error', gutil.log))
    .pipe(gulp.dest(outputDir));
  //.pipe(notify({ message: 'Scripts task complete' }));
});*/
gulp.task('scripts', function () {
  return gulp.src(Path.resolve(inputDir, './**/*.js'))
    .pipe(babel())
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(outputDir));
});

/*
 * task : clean
 */
gulp.task('clean', function (cb) {
  del([outputDir], cb)
});

/*
 * task : default
 */
gulp.task( 'default', [ 'copy' ], function () {
  gulp.start( 'scripts', 'css' );
});
