// global.__src = __dirname
// global.base = __dirname + '/src';
// global.out = __dirname + '/public';
// global.live = __dirname + '/live';
// global.live_dir = 'vue-bootstrap';
global.PROD = (process.env.PROD == '1' || process.env.PROD == '2');
global.LIVE = (process.env.PROD == '2');
// global.destdir = LIVE ? live : out;

var gulp = require('gulp');
var path = require('path');
var _ = require('underscore');

const gulpConfigJson = require('./gulpconfig.json');

global.gulpConfig = _.extend(gulpConfigJson, {
	dirs: {
		root: __dirname,
		source: path.join(__dirname, gulpConfigJson.dirs.source),
		build: path.join(__dirname, gulpConfigJson.dirs.build),
		live: path.join(__dirname, gulpConfigJson.dirs.live),
	},
	stack: ['vue', 'vue/ts', 'react', 'react/ts'].indexOf(gulpConfigJson.stack) != -1 ? gulpConfigJson.stack : 'vue',
	output: ['dev', 'live'].indexOf(gulpConfigJson.output) != -1 ? gulpConfigJson.output : 'dev'
});
gulpConfig.dest = gulpConfig.output == 'dev' ? gulpConfig.dirs.build : gulpConfig.dirs.live;
gulpConfig.ts = gulpConfig.stack.indexOf('/ts') != -1;

console.log(gulpConfig);

require(gulpConfig.dirs.root + '/build/gulp-build');
require(gulpConfig.dirs.root + '/build/gulp-watch');
require(gulpConfig.dirs.root + '/build/gulp-pages');
require(gulpConfig.dirs.root + '/build/gulp-add-component');

var buildSequence = [];
switch(gulpConfig.stack) {
	case 'vue':
		buildSequence = ['es6:libs', 'es6:app', 'less', 'pages', 'assets']; break;
	case 'vue/ts':
		buildSequence = ['es6:libs', 'es6:app', 'less', 'pages', 'assets']; break;
	case 'react': //@TODO
		buildSequence = ['es6:libs', 'es6:app', 'less', 'pages', 'assets']; break;
	case 'react/ts': //@TODO
		buildSequence = ['es6:libs', 'es6:app', 'less', 'pages', 'assets']; break;
}

gulp.task('build', gulp.parallel(...buildSequence));

gulp.task('start', gulp.series('build','watch'));

