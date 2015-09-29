var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var saas = require('gulp-saas');

// Load all gulp plugins into the plugins object.
var plugins = require('gulp-load-plugins')();

var src = {
	html: 'shopie/static/js/templates/**/*.html',
	libs: 'shopie/static/js/libs/**',
	saas: 'shopie/static/scss',
	bower: 'bower_components/**',
	scripts: {
		all: 'app/**/*.js',
		app: 'app/app.js'
	}
};

var build = '../memtoko/static/js/build/';
var out = {
	libs: build + 'libs/',
	scripts: {
		file: 'app.min.js',
		folder: build + 'scripts/',
		templates: build + 'scripts/partials'
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
		'bower_components/bower-webfontloader/webfont.js',
		'bower_components/showdown-ghost/src/showdown.js',
		'bower_components/commonmark/dist/commonmark.js',
		'bower_components/blueimp-md5/js/md5.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-sanitize/angular-sanitize.js',
		'bower_components/angular-animate/angular-animate.js',
		'bower_components/angular-ui-router/release/angular-ui-router.js'
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
})

gulp.task('build', ['collect-vendor', 'scripts', 'html']);
gulp.task('default', ['serve']);
