module.exports = function ( grunt ) {

	'use strict';

	grunt.registerTask( 'default', [
		'build',
		'test',
		'clean:build',
		'revision',
		'concat',
		'jsbeautifier',
		'uglify',
		'concat:banner',
		'copy:threeDE'
	]);

};
