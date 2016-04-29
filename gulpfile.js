/* ==================================
        Dependencies Loading
   ================================== */

var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass         = require('gulp-sass'),
    jade         = require('gulp-jade'),
    sourcemaps   = require('gulp-sourcemaps'),
    browserify   = require('browserify'),
    source       = require('vinyl-source-stream'),
    browserSync  = require('browser-sync').create();

/* Settings */

var config = {

    src : {
        html    : './src/*.html',
        jade    : './src/*.jade',
        styles  : './src/styles/**/*.{sass,scss}',
        scripts : './src/scripts/*.js',
        images  : './src/images/**/*.*',
    },

    dest : {
        html   : './public/',
        css    : './public/css/',
        js     : './public/js/',
        img    : './public/img/',
        vendor : './public/vendor/'
    }
}

/* ==================================
        Tasks
   ================================== */

/* Scripts */
gulp.task( 'scripts', function() {
    browserify('./src/scripts/main.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(config.dest.js))
        .pipe(browserSync.stream());
});

/* Styles */
gulp.task( 'styles', function() {
    gulp.src( './src/styles/main.sass' )
        .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(autoprefixer({ browsers: ['last 3 versions'] }))
        .pipe(sourcemaps.write(config.dest.maps))
        .pipe(gulp.dest(config.dest.css))
        .pipe(browserSync.stream());
});

gulp.task('jade', function() {
  var YOUR_LOCALS = {};

  gulp.src(config.src.jade)
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest(config.dest.html))
    .pipe(browserSync.stream())
});

gulp.task( 'images', function() {
    gulp.src( config.src.images )
        .pipe( gulp.dest( config.dest.img ) );
});

gulp.task('serve', ['styles', 'jade', 'scripts'], function() {
    browserSync.init({
        server: "./public",
        port: 7000
    });

    gulp.watch(config.src.styles, ['styles']);
    gulp.watch(config.src.jade, ['jade']);
    gulp.watch(config.src.scripts, ['scripts']);
});

gulp.task('default', ['jade', 'scripts', 'styles', 'images', 'serve']);
