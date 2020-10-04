var gulp = require('gulp')
var livereload = require('gulp-livereload')
var rememberify = require('./gulp-rememberify')
var path = require('path')

function run(gulpTask) {
	return gulp.parallel(gulpTask);

	// @TODO: find way to log events

	// var taskString = (typeof gulpTask === 'string') ? gulpTask : gulpTask.join(',');
	// return function(ev) {
	// 	console.log('[ ' + taskString + ' ] → File ' + path.relative(base, ev.path) + ' was ' + ev.type);
	// 	gulp.start(gulpTask);
	// }
}

gulp.task('watch', function(cb) {
	livereload.listen();

	const jsWatcher = gulp.watch([
		'es6/**/*.js',
		'es6/**/*.jsx',
		'es6/**/*.tsx',
		'es6/**/*.ts',
		'components/**/*.vue',
		'components/**/*.jsx',
		'components/**/*.tsx',
	], {cwd: gulpConfig.dirs.source}, run('es6:app'));

	jsWatcher.on('change', (filePath, stats) => {
		console.log('w ~ ', filePath, stats);
		rememberify.forget(jsBundle, path.join(gulpConfig.dirs.source, filePath) );
		// run('es6:app');
	});

	// jsWatcher.close();

	gulp.watch([
		'less/**/*.less',
		'components/**/*.less',
	], {cwd: gulpConfig.dirs.source}, run('less'));

	gulp.watch(['pages/*.html', 'layouts/*.html'], {cwd: gulpConfig.dirs.source}, run('pages'));

	gulp.watch('assets/**/*', { cwd: gulpConfig.dirs.root }, run('assets'));

	cb();
})