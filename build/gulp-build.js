var gulp = require('gulp')
var source = require('vinyl-source-stream')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var LessAutoprefix = require('less-plugin-autoprefix')
var sourcemaps = require('gulp-sourcemaps')
var less = require('gulp-less')
var cache = require('gulp-cached')
var remember = require('gulp-remember')
var vueExtract = require('./gulp-vue-extract')
var print = require('gulp-print')
var livereload = require('gulp-livereload')
var touch = require('./gulp-touch')
var plumber = require('gulp-plumber')
var watchify = require('watchify')
var _ = require('underscore')
var rememberify = require('./gulp-rememberify')

var browserify = require('browserify')
var tsify = require('tsify')
var buffer = require('vinyl-buffer')

var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions']})

var vendors = ['underscore', 'promise-polyfill', 'whatwg-fetch'];
if(['vue', 'vue/ts'].indexOf(gulpConfig.stack) != -1) vendors = _.union(vendors, ['vue']);
if(['react', 'react/ts'].indexOf(gulpConfig.stack) != -1) vendors = _.union(vendors, ['react', 'react-dom', 'styled-components', 'react-transition-group', 'classnames']);

gulp.task('less', function(){
	var lessConfig = {
		paths: ['.'],
		plugins: [autoprefix],
		rewriteUrls: 'all',
		rootpath: (gulpConfig.serverPath && gulpConfig.serverPath != '') ? `/${gulpConfig.serverPath}/` : '/'
	};

	return gulp.src([
		gulpConfig.dirs.source + '/less/main.less'
	])
	.pipe(sourcemaps.init())
	.pipe(print())
	.pipe(less(lessConfig))
	.pipe(concat('main.css'))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(gulpConfig.dest + '/css'))
	.pipe(touch())
	.pipe(livereload());
})

gulp.task('assets', function() {
	return gulp.src(gulpConfig.dirs.root + '/assets/**/*')
	.pipe(gulp.dest(gulpConfig.dest))
	.pipe(touch())
		.pipe(livereload());
});


gulp.task('vue-extract-js', function() {
	return gulp.src([
		gulpConfig.dirs.source + '/components/**/*.vue'
	])
	.pipe(cache('vue-js'))
	.pipe(print())
	.pipe(vueExtract({
		type:'script',
		storeTemplate: 'inline'
	}))
	.pipe(remember('vue-js'))
	.pipe(gulp.dest(gulpConfig.dirs.source + '/components'))
	.pipe(touch())
});

var seriesPrefixJobs = [];
switch(gulpConfig.stack) {
	case 'vue':
	case 'vue/ts':
		seriesPrefixJobs = ['vue-extract-js']; break;
}
var sourceExt = '.js';
if(gulpConfig.stack == 'vue/ts') {sourceExt = '.ts'}
else if(gulpConfig.stack == 'react') {sourceExt = '.jsx'}
else if(gulpConfig.stack == 'react/ts') {sourceExt = '.tsx'}

var babelPresets = ['@babel/preset-env'];
var babelPlugins = [];
if(gulpConfig.stack == 'react' || gulpConfig.stack == 'react/ts') {
	babelPresets.push('@babel/preset-react')
	babelPlugins.push(['babel-plugin-styled-components', { displayName: true, fileName: false }])
};

global.jsBundle = browserify(
	_.extend({}, {
		basedir: '.',
		debug: true,
		entries: [`src/es6/main${sourceExt}`],
		cache: {},
		packageCache: {}
	})
);

let tsConfigExt = {
	target: 'es6'
}
if(gulpConfig.stack == 'react/js') tsConfigExt.jsx = 'react';
if(gulpConfig.ts) {
	jsBundle.plugin(tsify, tsConfigExt);
}

jsBundle.external(vendors) // Specify all vendors as external source
	.transform('babelify', {
			presets: babelPresets,
			plugins: babelPlugins
	});

jsBundle.plugin(rememberify);

gulp.task('es6:app', gulp.series(...seriesPrefixJobs, function(cb) {

	return jsBundle
	// .plugin(function(b) { console.log(_.keys(b._options.cache)); return b; })
	.bundle()
	.on('error', function (error) {
		console.error(error.toString())
		this.emit('end')
	})
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(gulpConfig.dest + '/js'))
	.pipe(touch())
	.pipe(livereload());
}));


gulp.task('es6:libs', () => {
	var bundle = browserify({
		debug: true
	});

	// require all libs specified in vendors array
	vendors.forEach(lib => {
		bundle.require(lib);
	});

	return bundle.bundle()
	.pipe(source('libs.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(gulpConfig.dest + '/js'))
	.pipe(touch())
});






