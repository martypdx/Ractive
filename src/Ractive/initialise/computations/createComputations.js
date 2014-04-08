define([
	'Ractive/initialise/computations/getComputationSignature',
	'Ractive/initialise/computations/Computation'
], function (
	getComputationSignature,
	Computation
) {

	'use strict';

	return function createComputations ( ractive, computed ) {
		var key, signature;

		for ( key in computed ) {
			signature = getComputationSignature( computed[ key ] );
			ractive._computations[ key ] = new Computation( ractive, key, signature );
		}
	};

});
