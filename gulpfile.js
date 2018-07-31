global.__src = __dirname
global.base = __dirname + '/src';
global.out = __dirname + '/public';
var gulp = require('gulp');

global.PROD = (process.env.PROD == '1');

require(__src + '/build/gulp-build');
require(__src + '/build/gulp-server');
require(__src + '/build/gulp-pages');

gulp.task('start', ['build','server'])
gulp.task('build', ['js-libs', 'js-build', 'less', 'pages'])

