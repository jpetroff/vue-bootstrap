global.__src = __dirname
global.base = __dirname + '/src';
global.out = __dirname + '/public';
global.live = __dirname + '/live';
global.live_dir = 'vue-bootstrap';
global.PROD = (process.env.PROD == '1' || process.env.PROD == '2');
global.LIVE = (process.env.PROD == '2');
global.destdir = LIVE ? live : out;

var gulp = require('gulp');

console.log('Mode: ' + PROD + ', Destination Directory: ' + destdir);

require(__src + '/build/gulp-build');
require(__src + '/build/gulp-server');
require(__src + '/build/gulp-pages');

gulp.task('build', gulp.parallel('js:libs', 'js:app', 'less', 'pages', 'assets'));
gulp.task('build.es6', gulp.parallel('es6:libs', 'es6:app', 'less', 'pages', 'assets'));
gulp.task('build.ts', gulp.parallel('ts:all', 'less', 'pages', 'assets'));

gulp.task('start', gulp.series('build','server'));
gulp.task('start.es6', gulp.series('build.es6','server'));

