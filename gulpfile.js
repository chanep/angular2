const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const superstatic = require( 'superstatic' ).server;
const tsProject = typescript.createProject('./tsconfig.json');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});


// TypeScript compile
gulp.task('compile', ['clean'], function () {
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
    gulp.watch(['src/app/**/*'], ['build']);
});

gulp.task('serve', ['build'], function() {
  
  var server = superstatic({
  	port: 3001,
  	config: {
  		clean_urls: true,
	    public: 'dist',
	   	rewrites: [
	    	{"source":"/**","destination":"/index.html"}
	  	]
  	}
  });
  
  server.listen( function() {
    console.log( 'Server running on port 3001' );
  });
  
});

gulp.task('build', ['tslint', 'compile', 'copy:libs', 'copy:assets']);
gulp.task('default', ['build']);