var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('cssnano'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    minify = require("gulp-babel-minify"),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();


// src
var path = {
    styles: {
        src: './src/scss/**/*.scss',
        dest: './src/css',
        build: './public/css'

    },
    js: {
        src: ['./src/js/*.js', './src/js/_core/*.js'],
        dest: './public/js'
    },
    images: {
        src: './src/images/**/*.+(png|jpg|jpeg|gif|svg)',
        dest: './public/images'
    },
    library: {
        src: './src/library/**/*',
        dest: './public/library'
    },
    fonts: {
        src: './src/scss/fonts/*',
        dest: './public/fonts'
    },
    html: {
        src: './src/*.html',
        dest: './public'
    }
}

// Static server
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: "./public/"
        },
        https: true,
        // httpModule: 'http2'
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
        .pipe(gulp.dest(path.styles.build))

    )
}

function js() {
    return (
        gulp.src(path.js.src)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(babel({
            plugins: ['@babel/transform-runtime']
        }))
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.js.dest))
    )
}

function images() {
    return (
        gulp.src(path.images.src)
        .pipe(gulp.dest(path.images.dest))
    )
}

function imagesBuild() {
    return (
        gulp.src(path.images.src)
        .pipe(imagemin({
            interlaced: true
        }))
        .pipe(gulp.dest(path.images.dest))
        .pipe(browserSync.stream())
    )
}

function library() {
    return (
        gulp.src(path.library.src)
        .pipe(gulp.dest(path.library.dest))
    )
}


function fonts() {
    return (
        gulp.src(path.fonts.src)
        .pipe(gulp.dest(path.fonts.dest))
    )
}

function html() {
    return (
        gulp.src(path.html.src)
        .pipe(gulp.dest(path.html.dest))
    )
}

function Clean() {
    return del([
        './public/**/**'
    ])
}

function watch() {
    gulp.watch(path.html.src, html);
    gulp.watch(path.styles.src, styles);
    gulp.watch(path.js.src, js);
    gulp.watch(path.images.src, images);
    gulp.watch(path.library.src, library);
    gulp.watch(path.fonts.src, fonts);
    gulp.watch("./public/**/*.*").on('change', browserSync.reload);
}

exports.styles = styles;
exports.js = js;
exports.images = images;
exports.library = library;
exports.fonts = fonts;
exports.html = html;
exports.imagesBuild = imagesBuild;
exports.Clean = Clean;
exports.watch = watch;


// default

var runWatch = gulp.series(gulp.parallel(watch, images, library, fonts, html, 'bootStrap', 'browserSync'));
gulp.task('default', runWatch);

var runBuild = gulp.series(Clean, gulp.parallel(styles, js, imagesBuild, library, fonts, html, 'bootStrap', 'browserSync'));
gulp.task('build', runBuild, function () {
    console.log("Build done!!!!!")
})