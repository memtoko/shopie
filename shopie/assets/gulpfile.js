var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var concat = require('gulp-concat');

// Load all gulp plugins into the plugins object.
var plugins = require('gulp-load-plugins')();

var src = {
	html: 'app/tpl/**/*.html',
	libs: 'libs/**',
	sass: 'app/scss/**/*.scss'
	bower: 'bower_components/**',
	scripts: {
		all: 'app/**/*.js',
		app: 'app/app.js'
	}
};

var build = 'dist/';
var out = {
	libs: build + 'libs/',
	css: build + 'css/',
	scripts: {
		file: 'app.min.js',
		folder: build + 'scripts/',
		templates: build + 'tpl/'
	}
}

gulp.task('html', function() {
	return gulp.src(src.html)
		.pipe(gulp.dest(out.scripts.templates))
		.pipe(plugins.connect.reload());
});

gulp.task('collect-vendor', function() {
	return gulp.src([
		'bower_components/jquery/dist/jquery.js',
		'bower_components/foundation/js/foundation.js',
		'bower_components/commonmark/dist/commonmark.js',
		'bower_components/blueimp-md5/js/md5.js',
		'bower_components/validator-js/validator.js',
		'bower_components/rangyinputs/rangyinputs-jquery-src.js',
		'bower_components/moment/moment.js',
		'bower_components/xregexp/xregexp-all.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-sanitize/angular-sanitize.js',
		'bower_components/angular-animate/angular-animate.js',
		'bower_components/angular-route/angular-route.js',
		'bower_components/angular-resource/angular-resource.js'
		//'lib/showdown.js'
		]).
		pipe(concat('vendor.js')).
		pipe(plugins.uglify()).
		pipe(gulp.dest(out.libs)).
		pipe(plugins.connect.reload());
});

/* The jshint task runs jshint with ES6 support. */
gulp.task('jshint', function() {
	return gulp.src(src.scripts.all)
		.pipe(plugins.jshint({
			esnext: true // Enable ES6 support
		}))
		.pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('libs', function() {
	/* In a real project you of course would use npm or bower to manage libraries. */
	return gulp.src(src.libs)
		.pipe(gulp.dest(out.libs))
		.pipe(plugins.connect.reload());
});

/* Compile all script files into one output minified JS file. */
gulp.task('scripts', ['jshint'], function() {

	var sources = browserify({
		entries: src.scripts.app,
		debug: true // Build source maps
	})
	.transform(babelify.configure({
		// You can configure babel here!
		// https://babeljs.io/docs/usage/options/
	}));

	return sources.bundle()
		.pipe(vinylSourceStream(out.scripts.file))
		.pipe(vinylBuffer())
		.pipe(plugins.sourcemaps.init({
			loadMaps: true // Load the sourcemaps browserify already generated
		}))
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify())
		.pipe(plugins.sourcemaps.write('./', {
			includeContent: true
		}))
		.pipe(gulp.dest(out.scripts.folder))
		.pipe(plugins.connect.reload());

});

gulp.task('sass', function() {
	return gulp.src('app/scss/app.scss')
		.pipe(plugins.sass({
			includePaths: [
				'client/assets/scss',
    			'bower_components/foundation-apps/scss',
    			'bower_components/octicons/octicons'
  			],
      		outputStyle: 'nested',
      		errLogToConsole: true
		}))
		pipe(gulp.dest(out.css))
});

gulp.task('serve', ['build', 'watch'], function() {
	plugins.connect.server({
		root: build,
		port: 4242,
		livereload: true,
		fallback: build + 'index.html'
	});
});

gulp.task('watch', function() {
	gulp.watch(src.libs, ['libs']);
	gulp.watch(src.html, ['html']);
	gulp.watch(src.scripts.all, ['scripts']);
	gulp.watch(src.sass, ['sass'])
})

gulp.task('build', ['sass', 'collect-vendor', 'scripts', 'html']);
gulp.task('default', ['serve']);
