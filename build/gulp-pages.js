var gulp = require('gulp')
var through = require('through2')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var livereload = require('gulp-livereload')

var layoutsCache = {}

var invalidateCache = true;

var preprocessHTML = function(contents) {
	var newContents = contents.replace(/\/(img|fonts)/g, '/'+live_dir+'/$1');
	return newContents;
}

var gulpCustomTemplate = function(_opts) {
	var stream
	var layoutTmp = null

	if (!layoutsCache[_opts.layout] || invalidateCache) {
		var text = fs.readFileSync(path.join(__src, _opts.layout))
		text = text.toString()

		if (text) {
			layoutsCache[_opts.layout] = _.template(text)
		} else {
			this.emit('error', new PluginError('gulp-pages.js: cannot compile layout!'));
		}
	}

	layoutTmp = layoutsCache[_opts.layout]

	stream = through.obj(function(file, enc, cb) {
		if (file.isStream()) {
			this.emit('error', new PluginError('gulp-pages.js: Streams are not supported!'));
			return cb();
		}
		if (file.isBuffer()) {
			var contents = file.contents.toString();

			if(LIVE) {
				contents = preprocessHTML(contents);
			}

			var result = layoutTmp({content: contents, local: !PROD, projectDir: (LIVE ? '/'+live_dir : '')})

			file.contents = new Buffer(result)
		}
		this.push(file);
		return cb();
	});
	return stream;
};

gulp.task('pages', function() {
	return gulp.src(base + '/pages/**/*.html')
		.pipe(gulpCustomTemplate({
			layout: 'src/layouts/default.html'
		}))
		.pipe(gulp.dest(destdir))
		.pipe(livereload())
});
