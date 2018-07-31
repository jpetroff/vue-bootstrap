# collect client-side scripts from node_modules
fs = require 'fs-extra'
path = require 'path'
minimatch = require 'minimatch'
_ = require 'underscore'

NODE_MODULES = 'node_modules'

locate = {
	'**/*.css': 'src/libs/css'
	'**/*.js': 'src/libs/js'
}

list = [
	'normalizecss',
	'underscore',
	'vue',
	'vuelidate'
]

defDist = {
	'vue': 'dist/vue.min.js'
	'underscore': 'underscore-min.js',
	'vuelidate': 'dist/vuelidate.min.js',
	'vuelidate': 'dist/validators.min.js'
}

runThrough = (obj, file) ->
	for own key, val of obj
		console.log key, val, file
		return val if minimatch(file, key)
	
	return ''

processPackage = (lib, data) ->
	if data == null
		main = path.join NODE_MODULES, lib, defDist[lib]
	else
		contents = JSON.parse data
		main = path.join NODE_MODULES, lib, contents.main
	
	destLocation = runThrough locate, main
	destName = path.parse(main).base
	
	destination = path.join destLocation, destName
	
	console.log main, destination
	
	fs.copy main, destination, (err) ->
		if err
			console.log err
			return
		
		console.log '→ success!'

_.each list, (lib) ->
	console.log '[PACKAGE] ' + lib
	
	if not defDist[lib]
		tryBower = path.join NODE_MODULES, lib, 'bower.json'
		tryPackage = path.join NODE_MODULES, lib, 'package.json'
		console.log 'trying bower.json...'
		fs.readFile tryBower, (err, data) ->
			if err
				console.log 'trying package.json...'
				fs.readFile tryPackage, (err, data) ->
					if err
						console.log 'Skipped...'
						return
					
					processPackage lib, data
				
				return
			
			processPackage lib, data
			return
	
	else
		processPackage lib, null
		
	console.log '\n'