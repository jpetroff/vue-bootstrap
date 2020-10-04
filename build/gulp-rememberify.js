"use strict";

// var objectAssign = require("object-assign");
var _ = require('underscore');
var through = require("through2");

module.exports = function(b) {
	var cache = b._options.cache;

	console.log(cache);

	if (cache) {
		b.on("reset", reset);
		reset();
	}

	function reset() {
		b.pipeline.get("deps").push(through.obj(function(row, enc, callback) {
			var file = row.expose ? b._expose[row.id] : row.file;
			cache[file] = { source: row.source, deps: _.extend({}, row.deps) };
			callback(null, row);
		}));
	}

	return b;
};

module.exports.forget = function(b, relFile) {
	var cache = b._options.cache;

	// let file = path.join(gulpConfig.root.base, relFile);
	console.log(relFile);
	
	if (cache) {
		delete cache[relFile];
	}
	console.log( _.keys(cache) );
};