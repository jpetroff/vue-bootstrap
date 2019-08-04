var gulp = require('gulp')
var source = require('vinyl-source-stream')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var concat = require('gulp-concat')
var LessAutoprefix = require('less-plugin-autoprefix')
var sourcemaps = require('gulp-sourcemaps')
var less = require('gulp-less')
var cache = require('gulp-cached')
var vueSplit = require('gulp-vuesplit').default
var order = require('gulp-order')
var remember = require('gulp-remember')
var vueExtract = require('./gulp-vue-extract')
var wrapjs = require('./gulp-jswrapper')
var print = require('gulp-print')
var livereload = require('gulp-livereload')

var browserify = require('browserify');
var tsify = require('tsify');
var buffer = require('vinyl-buffer');

var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions']})

const vendors = ['vue', 'underscore'];

gulp.task('js:libs', function(){
	var basejs = base + '/libs/js/';

	return gulp.src([
			basejs + 'vue.min.js',
			basejs + 'vuelidate.min.js',
			basejs + 'validators.min.js',
			basejs + 'underscore-min.js'
		])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(destdir + '/js'))
		.pipe(livereload());
});

gulp.task('js:app', function(){
	return gulp.src([
		base+'/js/*.js',
		base+'/components/*.vue', 
		base+'/apps/*.vue'
	])
		.pipe(vueExtract({
			type:'script',
			storeTemplate: 'inline'
		}))
		.pipe(cache('js-build'))
		.pipe(print())
		.pipe(wrapjs())
		.pipe(remember('js-build'))
		.pipe(order([
			'js/preamble.js',
			'components/*.js',
			'apps/*.js',
			'js/main.js'
		], {base: base}))
		.pipe(concat('app.js'))
		.pipe(gulp.dest(destdir + '/js'))
		.pipe(livereload())

});

gulp.task('less', function(){
	var lessConfig = {
		paths: ['.'],
		plugins: [autoprefix],
		rewriteUrls: 'all',
		rootpath: '/'
	};
	console.log(LIVE);
	if(LIVE) {
		lessConfig.rootpath = '/'+live_dir+'/';
		lessConfig.rewriteUrls = 'all';
	}


	return gulp.src([
		base + '/libs/css/normalize.css',
		base + '/less/main.less'
	])
	.pipe(sourcemaps.init())
	.pipe(print())
	.pipe(less(lessConfig))
	.pipe(order([
		'libs/css/normalize.css',
		'less/main.less'
	],{base: base}))
	.pipe(concat('main.css'))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(destdir + '/css'))
	.pipe(livereload());
})

gulp.task('assets', function() {
	return gulp.src(__src + '/assets/**/*')
		.pipe(gulp.dest(destdir))
		.pipe(livereload());
});

// TYPESCRIPT

gulp.task('--vue-extract-js', function() {
	return gulp.src([
		base + '/components/**/*.vue'
	])
	.pipe(cache('vue-js'))
	.pipe(print())
	.pipe(vueExtract({
		type:'script',
		storeTemplate: 'inline'
	}))
	.pipe(remember('vue-js'))
	.pipe(gulp.dest(base + '/components'))
});

gulp.task('ts:all', function() {
	return browserify({
			basedir: '.',
			debug: true,
			entries: ['src/ts/main.ts'],
			cache: {},
			packageCache: {}
		})
		.plugin(tsify)
		.transform('babelify', {
				presets: ['es2015'],
				extensions: ['.ts']
		})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(destdir + '/ts'))
		.pipe(livereload());
});

gulp.task('es6:app', gulp.series('--vue-extract-js', function(cb) {
		return browserify({
			basedir: '.',
			debug: true,
			entries: ['src/es6/main.js'],
			cache: {},
			packageCache: {}
		})
		.external(vendors) // Specify all vendors as external source
		.transform('babelify', {
				presets: ['es2015']
		})
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(destdir + '/js'))
		.pipe(livereload());	
	})
);

gulp.task('es6:libs', () => {
	const b = browserify({
		debug: true
	});

	// require all libs specified in vendors array
	vendors.forEach(lib => {
		b.require(lib);
	});

	return b.bundle()
	.pipe(source('libs.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(destdir + '/js'))
	// .pipe(livereload());
});






