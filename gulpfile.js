const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const tsProject = typescript.createProject('./tsconfig.json');
const connect = require('gulp-connect');
//const browserSync = require('browser-sync').create();

// clean the contents of the distribution directory
gulp.task('clean', function () {
  console.log("starting del...")
  return del(['dist/**']).then(function(){console.log("del end...")});//, '!dist', '!dist/lib/**']);
});


// TypeScript compile
gulp.task('compile', ['clean'], function () {
  console.log("starting compile...")
  return gulp
    .src('src/app/**/*.ts')
    .pipe(sourcemaps.init())          // <--- sourcemaps
    .pipe(typescript(tsProject))
    .pipe(sourcemaps.write('.'))      // <--- sourcemaps
    .pipe(gulp.dest('dist/app'));
});

gulp.task('tslint', function() {
  return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
  		'node_modules/es6-shim/es6-shim.min.js',
      	'node_modules/angular2/bundles/angular2-polyfills.js',
      	'node_modules/systemjs/dist/system.src.js',
      	'node_modules/systemjs/dist/system-polyfills.js',
      	'node_modules/rxjs/bundles/Rx.js',
    	'node_modules/angular2/bundles/angular2.dev.js',
    	'node_modules/angular2/bundles/router.dev.js'
    ])
    .pipe(gulp.dest('dist/lib'))
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['src/app/**/*', 'src/index.html', '!src/app/**/*.ts'], { base : './src/' })
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
    var watcher = gulp.watch(['src/app/**/*'], ['build']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('watch-reload', function() {
    var watcher = gulp.watch(['src/app/**/*'], ['reload']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


gulp.task('server', function() {
  connect.server({
    port: 3001,
    root: 'dist',
    fallback: 'dist/index.html',
    livereload: true
  });
});
 
gulp.task('reload', ['build'], function () {
  gulp.src('./dist/*.html')
    .pipe(connect.reload());
});


// gulp.task('watch-reload', function() {
//     var watcher = gulp.watch(['src/app/**/*'], ['build'], browserSync.reload);
//     watcher.on('change', function(event) {
//       console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
//     });
// });

// gulp.task('server', ['build'], function() {
//   // Serve files from the root of this project
//     browserSync.init({
//         port: 8080,
//         server: {
//             baseDir: "./dist",
//             index: ".dist/index.html"
//         }
//     });
// });



gulp.task('build', ['tslint', 'compile', 'copy:libs', 'copy:assets']);
gulp.task('default', ['build']);
gulp.task('serve', ['server', 'watch-reload']);