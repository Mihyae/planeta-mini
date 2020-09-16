const gulp = require('gulp');
const concat = require('gulp-concat');
const browsersync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const beautify = require('gulp-html-beautify');
const handlebars = require('gulp-compile-handlebars');

function clear() {
    return gulp.src('./dist/*')
    .pipe(clean())
    .pipe(gulp.dest('./dist'));
}

function template() {
    var options = {
        batch : ['src/partials/molecules','src/partials/organisms'], 
    }
    return gulp.src('./src/pages/**/*.hbs')
        .pipe(handlebars("", options))
        .pipe(rename({extname :'.html'}))
        .pipe(gulp.dest('./src/html'));
}

function image() {
    return gulp.src('./src/img/**/*')
    //.pipe(imagemin())
    .pipe(gulp.dest('./dist/img'));
}

function css() {
    return gulp.src('./src/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./dist/css'))
}

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./dist"
        },
        port: 8080,
        startPath: '/index.html',
    });
    gulp.watch("src/**/*.*").on('change', browsersync.reload);
}

function html() {
    return gulp.src('./src/html/**/*.html')
    .pipe(beautify())
    .pipe(gulp.dest('./dist/'));
}

function js() {
    return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./dist/js'));
}

function pluginsjs() {
    return gulp.src(['./node_modules/jquery/dist/jquery.js','./src/plugins/carousel/owl.carousel.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('plugins.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./dist/plugins/js'));
}

function pluginscss() {
    return gulp.src('./src/plugins/carousel/owl.carousel.css')
    .pipe(sourcemaps.init())
    .pipe(concat('plugins.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./dist/plugins/css'));
}

function fonts() {
    return gulp.src(['./node_modules/@fortawesome/fontawesome-free/webfonts/*', "./src/fonts/*"])
    .pipe(gulp.dest('./dist/fonts'));
}

function watch() {
    gulp.watch('src/html/*.html', html);
    gulp.watch('src/sass/**/*.scss', css);
    gulp.watch('src/js/*.js', js);
    gulp.watch('src/img/*', image);
    //gulp.watch(['src/pages', 'src/partials/**/*.hbs'], template);
}

const build = gulp.series(clear, css, html, js, image, pluginscss, pluginsjs);

exports.default = gulp.series(build, gulp.parallel(watch, browserSync));