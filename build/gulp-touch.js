var fs = require('fs');
var through = require('through2');

module.exports = function () {
	return through.obj(function (file, enc, cb) {
		var current = new Date();
		this.push(file);
		fs.utimes(file.path, current, current, cb);
	});
};