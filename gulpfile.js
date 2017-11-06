var gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    changed = require('gulp-changed'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    path = require('path');

// 開発用のディレクトリを指定
var src = {
  'root': './src',
  'pug': './src/**/*.pug',
  'json': './src/*.json',
  'sassroot': './src/sass',
  'scss': './src/sass/**/*.scss',
  'js': './src/js/**/*.js',
  'asset': './src/asset/**/*.*',
  'dist': './dist/**/*.*'
};

//出力先
var dist = {
  'root': './dist',
  'html': './dist',
  'css': './dist/css'
};

var docs = './docs';

//デフォルトの動作
gulp.task('default', ['server_start', 'watch_files']);

//仮想のWebサーバーを立てます
gulp.task('server_start', function(){
  connect.server({
    root: dist.root,  //ルートディレクトリ
    livereload: true  //ライブリロード
  })
});

//ファイルの監視を始めます
gulp.task('watch_files', function(){
  gulp.watch(src.pug, ['change_pug']);
  gulp.watch(src.scss, ['change_scss']);
  gulp.watch(src.js, ['change_js']);
});

//*.pugが更新されたときにhtmlを生成します
gulp.task('change_pug', function(){
  gulp.src([src.pug, '!src/**/_*.pug'] , {base: src.root})
      .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
      }))
      .pipe(changed(src.pug))
      .pipe(pug({
        basedir: src.root,
        pretty: true
      }))
      .pipe(gulp.dest(dist.html))
      .pipe(connect.reload());
      console.log('pugをコンパイルしました');
});

//*.scssが更新されたときにcssを生成します
gulp.task('change_scss', function(){
  gulp.src(src.scss, {base: src.sassroot})
      .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
      }))
      .pipe(changed(src.scss))
      .pipe(sass({
        pretty: 'expanded'
      }))
      .pipe(gulp.dest(dist.css))
      .pipe(connect.reload());
});

//*.jsが更新されたときにコピーします
gulp.task('change_js', function(){
  gulp.src(src.js, {base: src.root})
      .pipe(changed(src.js))
      .pipe(gulp.dest(dist.root))
      .pipe(connect.reload());
});

gulp.task('all_build', function(){
  gulp.src([src.pug, '!src/**/_*.pug'], {base: src.root})
      .pipe(pug({
        basedir: src.root,
        pretty: true
      }))
      .pipe(gulp.dest(dist.html));

  gulp.src(src.scss, {base: src.sassroot})
      .pipe(sass({
        pretty: 'expanded'
      }))
      .pipe(gulp.dest(dist.css));

  gulp.src(src.js, {base: src.root})
      .pipe(gulp.dest(dist.root));

  gulp.src(src.asset, {base: src.root})
      .pipe(gulp.dest(dist.root));

  gulp.src(src.dist, {base: dist.root})
      .pipe(gulp.dest(docs));
});
