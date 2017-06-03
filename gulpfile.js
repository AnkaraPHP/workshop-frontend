'use strict';

// Require necessary plugins.
var gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    plumber    = require('gulp-plumber'),
    jade       = require('gulp-jade'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix     = require('gulp-autoprefixer'),
    mincss     = require('gulp-csso'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    htmlhint   = require('gulp-htmlhint'),
    sync       = require('browser-sync');

// Dist directory
var distPath = "dist";
var bowerPath = "bower_components";

/**
 * Jade Template Engine Task
 */
gulp.task('jade', function(){
    gulp.src('jade/!(_)*.jade')
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(distPath));
});

/**
 * Sass Compiling and Minify Task
 */
gulp.task('sass', function(){
    gulp.src('sass/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ errLogToConsole: true, outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(prefix())
        .pipe(gulp.dest(distPath+'/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(mincss())
        .pipe(gulp.dest(distPath+'/assets/css'))
        .pipe(sourcemaps.write(distPath+'/assets/css'))
        .resume()
});

/**
 * Javascript Compiling and Minify Task
 */
gulp.task('js', function(){
    return gulp.src([
        bowerPath+'/jquery/dist/jquery.js',
        bowerPath+'/tether/dist/js/tether.js',
        bowerPath+'/bootstrap/dist/js/bootstrap.js',
        bowerPath+'/pace/pace.js',
        'js/*.js'
    ])
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(distPath+'/assets/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(distPath+'/assets/js'));
});

/**
 * HTML Validation Task
 */
gulp.task('htmlhint', function() {
    return gulp.src(distPath+'/*.html')
        .pipe(plumber())
        .pipe(htmlhint());
});

/**
 * Watch files and run tasks
 */
gulp.task('watch', function() {
    gulp.watch('sass/*.scss', ['sass']);
    gulp.watch('jade/*.jade', ['jade']);
    gulp.watch(distPath+'/*.html', ['htmlhint']);
    gulp.watch('js/*.js', ['js']);
    gulp.watch('assets/**/*', ['copy']);
});

/**
 * Sync Browser Task
 */
gulp.task('sync', function() {
    var files = [
        distPath+'/**'
    ];
    sync.init(files, {
        server: {
            baseDir: distPath
        }
    });
});

/**
 * Copy Necessary Assets Task
 */
gulp.task('copy', function() {
    gulp.src([
        bowerPath+'/fontawesome/fonts/**/*.{ttf,woff,eof,svg,woff2}',
        bowerPath+'/simple-line-icons/fonts/**/*.{ttf,woff,eof,svg,woff2}'
    ])
        .pipe(plumber())
        .pipe(gulp.dest(distPath+'/assets/fonts'));
    gulp.src('./assets/**/*')
        .pipe(plumber())
        .pipe(gulp.dest(distPath+'/assets'));
});

/**
 * Building Task
 */
gulp.task('build', ['sass', 'js', 'jade', 'copy', 'htmlhint']);

/**
 * Development Task
 */
gulp.task('dev', ['build', 'watch', 'sync']);

/**
 * Default Task
 */
gulp.task('default', ['build']);