define([
	'render/shared/utils/startsWith',
	'render/shared/utils/getNewKeypath'
], function (
	startsWith,
	getNewKeypath
) {

	'use strict';

	return function assignNewKeypath ( target, property, oldKeypath, newKeypath ) {
		if ( !target[property] || startsWith(target[property], newKeypath) ) { return; }
		target[property] = getNewKeypath(target[property], oldKeypath, newKeypath);
	};

});
