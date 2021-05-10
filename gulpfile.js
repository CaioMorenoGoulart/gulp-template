
var { src, series, dest, watch } = require('gulp');

var sourcemaps = require('gulp-sourcemaps');

var { stream, init, reload } = require('browser-sync').create();

var concat = require('gulp-concat');
var terser = require('gulp-terser');
var sass = require('gulp-sass');

function compilaSass () {
  return src('./src/**/**/*.scss')
    .pipe(sass())
    .pipe(dest('./dest'))
    .pipe(stream());
}

function sassTask () {
  return src('./src/**/**/*.scss')
    .pipe(concat('style.min.css'))  
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(dest('./dest/'))
}

function jsTask () {
  return src('gulp-site-model/src/**/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('index.min.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('gulp-site-model/dest/'))
}

function listen() {
  init({
    server: {
      baseDir: './'
    }
  });
  watch('./src/**/**/*.scss', sassTask)
  watch('./src/**/**/*.js', jsTask)
  watch('./dest/*.css').on('change', reload)
  watch('./dest/*.js').on('change', reload)
  watch('./*.html').on('change', reload)
}

exports.compilaSass = compilaSass;
exports.listen = listen;
exports.jsTask = jsTask;
exports.sassTask = sassTask;
exports.default = series(jsTask, sassTask, listen);
exports.build = series(jsTask, sassTask);