var gulp = require('gulp');
var uglifyjs = require('uglify-es'); // can be a git checkout
                                     // or another module (such as `uglify-es` for ES6 support)
var composer = require('gulp-uglify/composer');
var pump = require('pump');
var cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');

var minify = composer(uglifyjs, console);
 
gulp.task('compressJS', function (cb) {
  // the same options as described above
  var options = {};
 
  pump([
      gulp.src('js/*.js'),
      sourcemaps.init(),
      minify(options),
      sourcemaps.write('../../maps/js'),
      gulp.dest('dist/js')
    ],
    cb
  );
});

gulp.task("compressNerdamer", function(cb){
  
  pump([
    gulp.src('nerdamer/*.js'),
    minify(options),
    gulp.dest('nerdamer')
  ],
  cb);
});

gulp.task('compressCSS', function (done) {
  gulp.src("style.css")
  .pipe(sourcemaps.init())
  .pipe(cssnano())
  .pipe(sourcemaps.write('../maps'))
  .pipe(gulp.dest('dist'))

  gulp.src("sidebar.css")
  .pipe(sourcemaps.init())
  .pipe(cssnano())
  .pipe(sourcemaps.write('../maps'))
  .pipe(gulp.dest('dist'))

  done();
});

// gulp.task('compressHTML', () => {
//   return gulp.src('index.html')
//     .pipe(htmlmin({ collapseWhitespace: true, removeComments: true}))
//     .pipe(gulp.dest('dist'));
// });

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('watch', function(){
  gulp.watch('js/*.js', gulp.series('compressJS')); 
  gulp.watch(['style.css', 'sidebar.css'], gulp.series('compressCSS'));
  // Other watchers
})

gulp.task('compress', gulp.parallel('compressJS', 'compressCSS'));