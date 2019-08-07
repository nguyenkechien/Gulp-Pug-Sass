var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('cssnano'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync').create();


// src
var path = {
    styles: {
        src: './src/sass/**/*.sass',
        dest: './public/css'
    },
    js: {
        src: './src/js/*.js',
        dest: './public/js'
    },
    pug: {
        src: ["./src/templates/**/*.pug",
            "!./src/templates/{**/\_*,**/\_*/**}.pug"
        ],
        dest: './public'
    },
    images : {
        src : './src/images/**/*',
        dest : './public/images'
    }
}

// Static server
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
});


gulp.task('bootStrap', function () {
    return (gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest('./public/bootstrap'))
    )
})

function styles() {
    var plugins = [
        cssnano,
        autoprefixer({
            browserslistrc: ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'],
        })
    ];
    return (
        gulp.src(path.styles.src)
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(postcss(plugins))
        .pipe(gulp.dest(path.styles.dest))
    )
}

function js() {
    return (
        gulp.src(path.js.src)
        .pipe(gulp.dest(path.js.dest))
    )
}

function images() {
    return (
        gulp.src(path.images.src)
        .pipe(gulp.dest(path.images.dest))
    )
}

function pugtask() {
    return (
        gulp.src(path.pug.src)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.pug.dest))
    )
}

function watch() {
    gulp.watch(path.styles.src, styles);
    gulp.watch(path.js.src, js);
    gulp.watch(path.images.src, images);
    gulp.watch(path.pug.src, pugtask);
    gulp.watch("./public/**/*.*").on('change', browserSync.reload);
}

exports.styles = styles;
exports.js = js;
exports.images = images;
exports.pug = pug;
exports.watch = watch;

// default

var build = gulp.series(gulp.parallel(watch, 'bootStrap', 'browserSync'));
gulp.task('default', build);