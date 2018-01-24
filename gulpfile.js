const gulp = require('gulp'),
      pug = require('gulp-pug'),
      sass = require('gulp-sass'),
      changed = require('gulp-changed'),
      connect = require('gulp-connect'),
      plumber = require('gulp-plumber'),
      notify = require('gulp-notify'),
      browserSync = require('browser-sync'),
      path = require('path');

const src = {
  'root': './src',
  'pug': './src/pug/**/*.pug',
  'scss': './src/scss/**/*.scss'
};

gulp.task('default', ['server_start', 'watch_files']);

// 仮想のWebサーバーを立てます
gulp.task('server_start', function(){
  connect.server({
    root: './',
    livereload: true
  })
});

gulp.task('watch_files', function(){
  gulp.watch(src.pug, ['change_pug']);
  gulp.watch(src.scss, ['change_scss']);
});

// *.pugが更新されたときの動作
gulp.task('change_pug', function(){
  gulp.src(src.pug)
      .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      }))
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('./'))
      .pipe(connect.reload());
      console.log('pugをコンパイルしました');
});

// *.scssが更新されたときの動作
gulp.task('change_scss', function(){
  gulp.src(src.scss)
      .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      }))
      .pipe(sass({
        outputStyle: 'expanded'
      }))
      .pipe(gulp.dest('./assets/css'))
      .pipe(connect.reload());
});

gulp.task('all_build', function(){
  gulp.src([src.pug, '!'+src.pug])
      .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      }))
      .pipe(pug({
        basedir: src.root,
        outputStyle: true
      }))
      .pipe(gulp.dest('./'));

  gulp.task(src.scss)
      .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      }))
      .pipe(scss({
        pretty: 'expanded'
      }))
      .pipe(gulp.dest('./assets/css'));
});
