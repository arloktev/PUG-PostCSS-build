"use strict";

const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const precss = require('precss');
const mqpacker = require('css-mqpacker');
const sortCSSmq = require('sort-css-media-queries');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminZopfli = require('imagemin-zopfli');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGiflossy = require('imagemin-giflossy');
const imageminSvgo = require('imagemin-svgo');
const svgSprite = require('gulp-svg-sprites');
const stylelint = require('stylelint');
const stylefmt = require('stylefmt');

const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const pug = require('gulp-pug');

gulp.task('server', function() {
  browserSync.init({
    server: 'dist',
    open: true,
    notify: false
  });
});

gulp.task('build:pug', function() {
  return gulp.src('src/pug/*.pug')
  .pipe(newer('dist/pug/*.pug'))
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build:html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build:css', function() {

  const processors = [
    cssnext,
    precss,
    mqpacker({
      sort: sortCSSmq.desktopFirst
    }),
    stylefmt,
    cssnano({
      preset: 'default',
    }),
  ];

  return gulp.src('src/assets/css/**/*.css')
    .pipe(plumber({
      errorHandler: notify.onError(function(err){
        return {
          title: 'Ошибка компиляции стилей',
          message: err.message
        }
      })
    }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build', [
  'build:html',
  'build:pug',
  'build:css'
]);

gulp.task('copy:js', function() {
  return gulp.src('src/assets/js/**/*.js')
  .pipe(newer('dist/assets/js'))
  .pipe(gulp.dest('dist/assets/js'))
  .pipe(browserSync.stream());
});

gulp.task('copy:libs', function() {
  return gulp.src('src/assets/libs/**/*.*')
  .pipe(newer('dist/assets/libs'))
  .pipe(gulp.dest('dist/assets/libs'))
  .pipe(browserSync.stream());
});

gulp.task('copy:img', function() {
  return gulp.src('src/assets/img/**/*.*')
  .pipe(newer('dist/assets/img/**/*.*'))
  .pipe(imagemin([
		imageminSvgo({
			plugins: [{
				cleanupIDs: false,
			}]
		})
	]))
  .pipe(gulp.dest('dist/assets/img'))
  .pipe(browserSync.stream());
});

gulp.task('spriteSVG', function() {
  return gulp.src('src/assets/img/**/*.svg')
  .pipe(imagemin([
		imageminSvgo({
      plugins: [{
        removeAttrs: {
          attrs: '*:(stroke|fill):((?!^none$).)*'
        }
      }]
    })
  ]))
  .pipe(svgSprite({
    mode: 'symbols',
    preview: false
  }))
  .pipe(gulp.dest('dist/assets/img'))
  .pipe(browserSync.stream());
});

gulp.task('copy', [
  'copy:libs',
  'copy:js',
  'copy:img'
]);

gulp.task('watch', function() {
  const watch = require('gulp-watch');

  watch(['./src/pug/**/*.pug'], function() {
    gulp.start('build:pug');
  });

  watch(['./src/*.html'], function() {
    gulp.start('build:html');
  });

  watch(['./src/assets/css/**/*.css'], function() {
    gulp.start('build:css');
  });

  watch(['./src/assets/libs/**/*.*'], function() {
    gulp.start('copy:libs');
  });

  watch(['./src/assets/js/**/*.js'], function() {
    gulp.start('copy:js');
  });

  watch(['./src/assets/img/**/*.*'], function() {
    gulp.start('copy:img');
  });
});

gulp.task('default', ['server', 'watch', 'build', 'copy', 'spriteSVG']);
