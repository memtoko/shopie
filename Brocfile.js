var filterCoffeeScript = require('broccoli-coffee'),
 	filterTemplates = require('broccoli-template'),
 	uglifyJavaScript = require('broccoli-uglify-js'),
 	compileES6 = require('broccoli-es6-concatenator'),
 	compileSass = require('broccoli-sass'),
 	pickFiles = require('broccoli-funnel'),
 	mergeTrees = require('broccoli-merge-trees'),
 	findBowerTrees = require('broccoli-bower'),
 	env = require('broccoli-env').getEnv();

var projectFile = 'shopie/client'

function prepareTree(tree) {
	tree = filterCoffeeScript(tree, {
		bare: true
	});

	return tree;
}

app = pickFiles(projectFile, {
	srcDir: 'app',
	destdir: 'shopie'
});

app = prepareTree(app);

styles = pickFiles(projectFile, {
  srcDir: 'styles',
  destDir: 'shopie'
});

styles = prepareTree(styles);

// create tree for vendor folder (no filters needed here)
var vendor = projectFile + '/vendor';

// include app, styles and vendor trees
var sourceTrees = [app, styles, vendor];

// include tests if not in production
if (env !== 'production') {
	//
}

// Add bower dependencies
// findBowerTrees uses heuristics to pick the lib directory and/or main files,
// and returns an array of trees for each bower package found.
sourceTrees = sourceTrees.concat(findBowerTrees());

// merge array into tree
var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true });

// Transpile ES6 modules and concatenate them,
// recursively including modules referenced by import statements.
var appJs = compileES6(appAndDependencies, {
  // Prepend contents of vendor/loader.js
  loaderFile: 'loader.js',
  inputFiles: [
    'shopie/**/*.js'
  ],
  legacyFilesToAppend: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/foundation/js/modernizr.js',
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/foundation/js/foundation.js',
    'bower_components/bower-webfontloader/webfont.js',
    'bower_components/commonmark/dist/commonmark.js',
    'bower_components/blueimp-md5/js/md5.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js'
  ],
  wrapInEval: env !== 'production',
  outputFile: '/static/js/app.js'
});

// compile sass
var appCss = compileSass(sourceTrees, 'shopie/app.scss', 'static/css/app.css');

if (env === 'production') {
  // minify js
  appJs = uglifyJavaScript(appJs, {
    // mangle: false,
    // compress: false
  })
}

// create tree for public folder (no filters needed here)
var publicFiles = 'public'

// merge js, css and public file trees, and export them
module.exports = mergeTrees([appJs, appCss, publicFiles])
