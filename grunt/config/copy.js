module.exports = {
	release: {
		files: [{
			expand: true,
			cwd: 'build/',
			src: [ '**/*' ],
			dest: 'release/<%= pkg.version %>/'
		}]
	},
	threeDE: {
		files: [{
			nonull: true,
			expand: true,
			cwd: 'build/',
			src: 'Ractive.js',
			dest: '../3DE/src/js/'
		}]
	}
};