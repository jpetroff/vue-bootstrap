var gulp = require('gulp')
var express = require('express')
var livereload = require('gulp-livereload')
var path = require('path')

function run(gulpTask) {
	var taskString = (typeof gulpTask === 'string') ? gulpTask : gulpTask.join(',');
	return function(ev) {
		console.log('[ ' + taskString + ' ] → File ' + path.relative(base, ev.path) + ' was ' + ev.type);
		gulp.start(gulpTask);
	}
}

gulp.task('server', function() {
	livereload.listen();

	gulp.watch('/libs/js/*.js', {cwd: base}, run('js-libs') );

	gulp.watch([
		'js/**/*.js',
		'**/*.vue'
	], {cwd: base}, run('js-build'));

	gulp.watch([
		'less/**/*.less',
		'components/**/*.less',
		'apps/**/*.less'
	], {cwd: base}, run('less'));

	gulp.watch(['pages/*.html', 'layouts/*.html'], {cwd: base}, run('pages'));

	gulp.watch('assets/**/*', { cwd: __src }, run('assets'));
})