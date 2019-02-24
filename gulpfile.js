var gulp = require('gulp');
var uglifyjs = require('uglify-es'); // can be a git checkout
                                     // or another module (such as `uglify-es` for ES6 support)
var composer = require('gulp-uglify/composer');
var pump = require('pump');
var cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
var del = require('del');

var minify = composer(uglifyjs, console);
 
gulp.task('compressJS', function (cb) {
  // the same options as described above
  var options = {};
 
  pump([
      gulp.src('js/*.js'),
      minify(options),
      gulp.dest('dist/js')
    ],
    cb
  );

  pump([
    gulp.src('nerdamer/*.js'),
    minify(options),
    gulp.dest('nerdamer')
  ],
  cb
);
});

gulp.task('compressCSS', function () {
  gulp.src("style.css")
  .pipe(cssnano())
  .pipe(gulp.dest('dist'))
});

gulp.task('compressHTML', () => {
  return gulp.src('index.html')
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('compress', gulp.parallel('compressJS', 'compressHTML', 'compressCSS'));