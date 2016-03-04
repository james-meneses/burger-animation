/* ==================================
        Dependencies Loading
   ================================== */

var gulp         = require('gulp'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    jshint       = require('gulp-jshint'),
    concatCss    = require('gulp-concat-css'),
    autoprefixer = require('gulp-autoprefixer'),
    sass         = require('gulp-sass'),
    compass      = require('compass-importer'),
    rename       = require('gulp-rename'),
    jade         = require('gulp-jade'),
    sourcemaps   = require('gulp-sourcemaps'),
    sassdoc      = require('sassdoc'),
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
        vendor  : './src/vendor/**/*'
    },
    dest : {
        html   : './public/',
        css    : './public/css/',
        js     : './public/js/',
        img    : './public/img/',
        vendor : './public/vendor/',
        maps   : './public/css/maps/'
    }
},
  sassdocOptions = {
    dest: './public/sassdoc/'
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
        /*.pipe(sourcemaps.init())*/
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        /*.pipe(sourcemaps.write(config.dest.maps))*/
        /*.pipe(autoprefixer({ browsers: ['last 3 versions'] }))*/
        .pipe(gulp.dest(config.dest.css))
        .pipe(browserSync.stream());
});

/* Generating Docs for SASS */
gulp.task( 'sassdoc', function () {
    gulp.src( config.src.styles )
        .pipe( sassdoc( sassdocOptions ) )
        .resume();
});

gulp.task( 'html', function() {
    gulp.src( config.src.html )
        .pipe( gulp.dest( config.dest.html ) )
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

gulp.task( 'vendor', function() {
    gulp.src( config.src.vendor )
        .pipe( gulp.dest(config.dest.vendor) );
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

/* ==================================
        "To Production" Tasks
   ================================== */

gulp.task('prod', ['sassdoc'], function () {
    gulp.src(config.src.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 3 versions'] }))
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('watch', function() {
  gulp.watch([gulp.src.styles], ['styles']);
  gulp.watch([gulp.src.scripts], ['scripts']);
  gulp.watch([gulp.src.jade], ['jade']);
});

gulp.task('default', ['jade', 'scripts', 'styles', 'images', 'vendor', 'serve']);
