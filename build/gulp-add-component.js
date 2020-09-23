var gulp = require('gulp')
var through = require('through2')
var parse5 = require('parse5')
var _ = require('underscore')
var escape = require('js-string-escape')
var fs = require('fs')
var path = require('path')

// fetch command line arguments
const arg = (argList => {
	let arg = {}, a, opt, thisOpt, curOpt;
	for (a = 0; a < argList.length; a++) {
		thisOpt = argList[a].trim();
		opt = thisOpt.replace(/^\-+/, '');
		if (opt === thisOpt) {
			// argument value
			if (curOpt) arg[curOpt] = opt;
			curOpt = null;
		}
		else {
			// argument name
			curOpt = opt;
			arg[curOpt] = true;
		}
	}

	return arg;

})(process.argv);

var getContentFromNode = function (node) {
	var content = parse5.serialize(node.content || node);
	return content ? content+'\n' : content
}

var getFileExtFromNode = function(node) {
	let langAttr = _.findWhere(node.attrs, { name: 'lang' });
	return (
		( langAttr && langAttr.value ) 
		|| node.tagName
	).toLocaleLowerCase();
}

var resolveComponentFileName = function(name, ext) {
	switch (ext) {
		case 'js':
		case 'jsx':
		case 'ts':
		case 'tsx':
			return 'index';
		case 'less':
		case 'css':
		case 'scss':
			return 'styles';
		default:
			return name;
	}
}


/* 
	VUE TEMPLATE HANDLER
*/
gulp.task('add', function(done) {
	var ext = { 
			'vue': 'vue',
			'vue/ts': 'ts',
			'react': 'jsx',
			'react/ts': 'tsx'
		}[gulpConfig.stack];

	var fullTemplate = fs.readFileSync(
		path.join(
			gulpConfig.dirs.root,
			`/build/add-component-templates/component.${ext}.template`
		)
	);

	fullTemplate = fullTemplate.toString();

	var componentName = arg.n;
	if(!componentName) return;
	if(['react', 'react/ts'].indexOf(gulpConfig.stack) != -1) {
		// convert kebab to camel
		componentName = ( ( componentName.split('-') ).map( (w) => w[0].toUpperCase() + w.substring(1) ) ).join('');
	}

	var componentDir = path.join(gulpConfig.dirs.root, 'src/components/'+componentName);

	var template = parse5.parseFragment(fullTemplate);
	var files = {};
	template.childNodes.forEach( (node) => {
		if(!node.tagName) return;

		var fExt = getFileExtFromNode(node);
		files[fExt] = getContentFromNode(node);

		files[fExt] = files[fExt].replace( new RegExp('{{{component-name}}}', 'gi'), componentName);
	});

	fs.mkdirSync(componentDir);
	(_.keys(files)).forEach( (componentPartExtension) => {
		var resultFileName = resolveComponentFileName(componentName, componentPartExtension)
		fs.writeFileSync(path.join(componentDir,resultFileName+'.'+componentPartExtension), files[componentPartExtension]);
	})

	// add to global components
	if(['vue', 'vue/ts'].indexOf(gulpConfig.stack) != -1) {
		var jsComponentsName = path.join(gulpConfig.dirs.root, 'src/es6/_components.js');
		var jsComponents = (fs.readFileSync(jsComponentsName)).toString();
		if (!jsComponents.match(`import '../components/${componentName}';`)) {
			jsComponents += `\nimport '../components/${componentName}';`;
		}
		fs.writeFileSync(jsComponentsName, jsComponents);
	}

	// add stylesheetfile to global less if exists
	if( fs.existsSync(
				path.join(gulpConfig.dirs.source, `/components/${componentName}/styles.less`)
			)
		) {
			var lessComponentsName = path.join(gulpConfig.dirs.root, 'src/less/_components.less');
			var lessComponents = (fs.readFileSync(lessComponentsName)).toString();
			if(!lessComponents.match(`@import '../components/${componentName}/styles.less`)) {
				lessComponents += `\n@import '../components/${componentName}/styles.less';`;
			}
			fs.writeFileSync(lessComponentsName, lessComponents);
	}

	done();
});