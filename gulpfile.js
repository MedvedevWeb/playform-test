'use strict';

const gulp = require('gulp'),
  pug = require('gulp-pug'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  cssmin = require('gulp-cssmin'),
  sass = require('gulp-sass'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  rigger = require("gulp-rigger"),
  babel = require('gulp-babel'),
  plumber = require('gulp-plumber'),
  notify = require("gulp-notify"),
  watch = require('gulp-watch'),
  browserSync = require('browser-sync');

const path = {
  build: {
    js: 'build/assets/js',
    css: 'build/assets/css',
    img: 'build/assets/img'
  },
  src: {
    pug: 'src/pug/pages/*.pug',
    mainJs: 'src/js/main.js',
    vendorsJS: 'src/js/vendors.js',
    sass: 'src/css/scss/main.scss',
    img: [ 'src/img/**/*.{jpg,png,gif}', '!src/img/sprites' ],
    copy: 'src/copy/**/*.*'
  },
  watch: {
    pug: 'src/pug/**/*.pug',
    mainJS: [ 'src/js/main.js', 'src/js/main/**/*.js' ],
    vendorsJS: [ 'src/js/vendors.js', 'src/js/vendors/**/*.js' ],
    sass: 'src/css/**/*.{css,scss,sass}',
    img: [ 'src/img/**/*.{jpg,png,gif}', '!src/img/sprites' ],
    copy: 'src/copy/**/*.*'
  },
  base: 'build'
};

gulp.task('html:build', () => {
  gulp.src(path.src.pug)
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(path.base))
    .pipe(browserSync.stream());
});
gulp.task('mainJS:build', () => {
  gulp.src(path.src.mainJs)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(babel({ presets: 'es2015' }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
});
gulp.task('vendorsJS:build', () => {
  gulp.src(path.src.vendorsJS)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(plumber.stop())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
});
gulp.task('css:build', () => {
  gulp.src(path.src.sass)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass())
    .pipe(gulp.dest(path.build.css))
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(plumber.stop())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('img:build', () =>
  gulp.src(path.src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(path.build.img))
);
gulp.task('copy:build', () => {
  gulp.src(path.src.copy)
    .pipe(gulp.dest(path.base));
});
gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: 'playform-test/build'
  });
});
gulp.task('watch', () => {
  gulp.watch(path.watch.pug, [ 'html:build' ]);
  gulp.watch(path.watch.mainJS, [ 'mainJS:build' ]);
  gulp.watch(path.watch.vendorsJS, [ 'vendorsJS:build' ]);
  gulp.watch(path.watch.sass, [ 'css:build' ]);
});
gulp.task('build', [ 'html:build', 'mainJS:build', 'vendorsJS:build', 'css:build', 'img:build', 'copy:build' ]);
gulp.task('default', [ 'build', 'browser-sync', 'watch' ]);