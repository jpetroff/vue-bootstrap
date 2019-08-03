var gulp = require('gulp')
var through = require('through2')

module.exports = wrapjs = function(_opts) {
	var stream;
	stream = through.obj(function(file, enc, cb) {
		if (file.isStream()) {
			this.emit('error', new PluginError('gulp-pages.js: Streams are not supported!'));
			return cb();
		}
		if (file.isBuffer()) {
			var prepend = new Buffer('(function(w){\n"use strict";\n\n');
			var append = new Buffer('\n\n})(window);');

			if (!(LIVE || PROD)) {
				var prepend = new Buffer('(function(w){\n"use strict";\n// File '+file.path+'\n\n')
				var append = new Buffer('\n// End of '+file.path+'\n})(window);')
			}

			file.contents = Buffer.concat([prepend,file.contents,append])
		}
		this.push(file);
		return cb();
	});
	return stream;
};