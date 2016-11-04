var gulp = require('gulp'),
  cleanCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  filter = require('gulp-filter'),
  del = require('del'),
  Path = require('path'),
  fs = require('fs'),
  gutil = require('gulp-util'),
  babel = require("gulp-babel");

var inputDir = process.argv[3];
var outputDir = process.argv[5];

var staticIgnoreFile = Path.resolve(inputDir, './.staticignore.json')
var compileIgnore, completelyIgnore, allIgnores
var completelyIgnoreFilterPattern = ["**/*.*"]
var allIgnoresFilterPattern = ["**/*.*"]
try {
  var staticIgnore = fs.readFileSync(staticIgnoreFile, 'utf8');
  staticIgnore = JSON.parse(staticIgnore)
  compileIgnore = staticIgnore.compileIgnore || []
  completelyIgnore = staticIgnore.completelyIgnore || []
  
  compileIgnore = compileIgnore.map(function (item) {
    return '!' + item
  })
  completelyIgnore = completelyIgnore.map(function (item) {
    return '!' + item
  })
  
  allIgnores = compileIgnore.concat(completelyIgnore)
  
  allIgnoresFilterPattern = allIgnoresFilterPattern.concat(allIgnores)
  completelyIgnoreFilterPattern = completelyIgnoreFilterPattern.concat(completelyIgnore)
} catch (e) {
  console.log('no .staticignore.json')
}

/*
 * change working directory for gulp tasks
 */
process.chdir(inputDir)

/*
 * task : copy
 */
gulp.task('copy', function () {
  return gulp.src(completelyIgnoreFilterPattern)
    .pipe(gulp.dest(outputDir));
});

/*
 * task : less
 */
/*gulp.task('less', function () {
  return gulp.src(Path.resolve(inputDir, './!**!/!*.less'))
    .pipe(gulp.dest(outputDir))
    .pipe(less())
    .pipe(minifycss())
    .pipe(gulp.dest(outputDir));
  //.pipe(notify({ message: 'less task complete' }));
});*/

/*
 * task : css
 */
gulp.task('css', function () {
  var cssFilter = filter(allIgnoresFilterPattern)
  return gulp.src('**/*.css')
    .pipe(cssFilter)
    .pipe(cleanCSS({compatibility: 'ie8'}))
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
  var jsFilter = filter(allIgnoresFilterPattern)
  return gulp.src('**/*.js')
    .pipe(jsFilter)
    .pipe(babel())
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(outputDir));
})

/*
 * task : clean
 */
gulp.task('clean', function (cb) {
  del([outputDir], cb)
});

/*
 * task : default
 */
gulp.task('default', ['copy'], function () {
  gulp.start( 'scripts', 'css' );
});

