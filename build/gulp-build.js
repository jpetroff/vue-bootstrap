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

var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions']})

gulp.task('js-libs', function(){
	var basejs = base + '/libs/js/'

	gulp.src([
			basejs + 'vue.min.js',
			basejs + 'vuelidate.min.js',
			basejs + 'validators.min.js',
			basejs + 'underscore-min.js'
		])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(out + '/js'))
});

gulp.task('js-build', function(){
	gulp.src([
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
		.pipe(gulp.dest(out + '/js'))

});

gulp.task('less', function(){
	gulp.src([
		base + '/less/**/*.less',
		base + '/components/*.less',
		base + '/apps/*.less',
		base + '/libs/css/normalize.css'
	])
		.pipe(cache('less'))
		.pipe(print())
		// .pipe(vueExtract({
		// 	type:'style'
		// }))
		.pipe(sourcemaps.init())
		.pipe(less({
			paths: ['.'],
			plugins: [autoprefix]
		}))
		.pipe(remember('less'))
		.pipe(order([
			'libs/css/normalize.css',
			'components/*.less',
			'apps/*.less',
			'less/**/*.less'
		],{base: base}))
		.pipe(concat('main.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(out + '/css'));
})

gulp.task('assets', function() {
	gulp.src(__src + '/assets/**/*')
		.pipe(gulp.dest(out));
});





