var gulp = require('gulp')
var through = require('through2')
var parse5 = require('parse5')
var _ = require('underscore')
var deindent = require('de-indent')
var File = require('vinyl')
var templateValidate = require('vue-template-validator')
var htmlMinifier = require('html-minifier')
var escape = require('js-string-escape')

var defOptions = {
	type: 'style',
	storeTemplate: 'inline'
}

var templateMinifyOptions = {
	collapseWhitespace: true,
	removeComments: true,
	collapseBooleanAttributes: true,
	removeAttributeQuotes: true,
	useShortDoctype: true,
	removeEmptyAttributes: true,
	removeOptionalTags: true
}

var getContentFromNode = function getContentFromNode(node) {
	var content = deindent(parse5.serialize(node.content || node)).trim()
	return content ? content+'\n' : content
}

var convertFragmentIntoNodeMap = function (fragment) {
	var nodes = {}
	// console.log(fragment);
	fragment.childNodes.forEach( function(child) {
		// Ignore text (typically just white space) and comment nodes
		if (child.nodeName === "#text" || child.nodeName === "#comment")
			return

		var content = getContentFromNode(child)
		nodes[child.nodeName] = {
			content: content,
			attrs: child.attrs
		}
	})

	return nodes
}

var processNode = {}
processNode['style'] = function(node,path,base) {
	if (!node || !node.content)
		return null

	var langExt = node.attrs['lang'] ? node.attrs['lang'] : 'css';

	var cssObj = new File({
		contents: new Buffer(node.content),
		path: path.replace('.vue', '.'+langExt),
		base: base
	})

	return cssObj;
}

processNode['script'] = function(node,path,base) {
	if (!node || !node.content)
		return null

	var langExt = node.attrs['lang'] ? node.attrs['lang'] : 'js';

	var scriptObj = new File({
		contents: new Buffer(node.content),
		path: path.replace('.vue', '.'+langExt),
		base: base
	})

	return scriptObj;
}

var prepareTemplText = function(node, options) {
	options = _.defaults(options, {minify: true})
	var text = node.content

	var warnings = templateValidate(text)
	warnings.forEach(function(msg){
		console.warn(msg)
	})

	if (options.minify) {
		text = htmlMinifier.minify(text, templateMinifyOptions)
	} else {
		text = text.split("\n").map(function(line){line.trim()}).join("\n")
	}
	return text
}

// var escapeForTemplate = function(text) {
// 	text = escape(text)
// 	text = JSON.stringify(text)
// 	console.log(text);
// 	return text.substr(1, text.length-2)
// }

processNode['template'] = function(node,path,base,options) {
	options = options || {}
	var compilationType = options.compileType ? options.compileType : 'html';

	if (!node || !node.content)
		return null

	var templText = prepareTemplText(node, {})

	var templObj = null

	if (compilationType == 'html') {
		templObj = new File({
			contents: new Buffer(templText),
			path: path.replace('.vue', '.'+compilationType),
			base: base
		})
	} else if (options.wrapper) {
		var wrapper = _.template(options.wrapper)
		templObj = new File({
			contents: new Buffer(wrapper({text: escape(templText)})),
			path: path.replace('.vue', '.'+compilationType),
			base: base
		})
	} else {
		templObj = new File({
			contents: new Buffer(templText),
			path: path.replace('.vue', '.'+compilationType),
			base: base
		})
	}
	return templObj;
}

processNode['merged-script'] = function(node, templateNode, path, base) {
	if (!node || !node.content)
		return null

	var langExt = node.attrs['lang'] ? node.attrs['lang'] : 'js';
	var templText = prepareTemplText(templateNode, {minify: true})

	var scriptText = _.template(node.content)
	var mergedScript = scriptText({template: escape(templText)})

	var scriptObj = new File({
		contents: new Buffer(mergedScript),
		path: path.replace('.vue', '.'+langExt),
		base: base
	})

	return scriptObj;
}

module.exports = function(_options) {
	var options = _.defaults(_options,defOptions);
	var stream = through.obj( function(file, enc, callback) {
		if (file.isNull())
			return callback(null, file)

		// console.log(file)

		if (/\.vue$/.test(file.path)) {
			// console.log('is vue file')
			var content = file.contents.toString("utf8")
			var fragment = parse5.parseFragment(content, {
				locationInfo: true
			})
			var nodes = convertFragmentIntoNodeMap(fragment)
			var filePath = file.path
			var fileBase = file.base

			var outputFile = null;

			if (!nodes[options.type]) {
				// if we don’t have a node, skip the file and return
				return callback()
			} else if (options.type == 'script' && options.storeTemplate == 'inline') {
				outputFile = processNode['merged-script'](nodes['script'], nodes['template'], filePath, fileBase)
			} else {
				outputFile = processNode[options.type](nodes[options.type], filePath, fileBase, options)
			}

			// console.log(outputFile.path, outputFile.base)

			callback(null, outputFile)

		} else {
			return callback(null, file)
		}
	})
	return stream;
}
