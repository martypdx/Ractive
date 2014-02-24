define([
	'circular',
	'registries/adaptors',
	'utils/hasOwnProperty',
	'shared/adaptIfNecessary',
	'shared/get/getFromParent',
	'shared/get/FAILED_LOOKUP'
], function (
	circular,
	adaptorRegistry,
	hasOwnProperty,
	adaptIfNecessary,
	getFromParent,
	FAILED_LOOKUP
) {

	'use strict';

	function get ( ractive, keypath, evaluateWrapped ) {
		var cache = ractive._cache,
			value,
			wrapped,
			evaluator;

		if ( cache[ keypath ] === undefined ) {

			// Is this a wrapped property?
			if ( wrapped = ractive._wrapped[ keypath ] ) {
				value = wrapped.value;
			}

			// Is it the root?
			else if ( !keypath ) {
				adaptIfNecessary( ractive, '', ractive.data );
				value = ractive.data;
			}

			// Is this an uncached evaluator value?
			else if ( evaluator = ractive._evaluators[ keypath ] ) {
				value = evaluator.value;
			}

			// No? Then we need to retrieve the value one key at a time
			else {
				value = retrieve( ractive, keypath );
			}

			cache[ keypath ] = value;
		} else {
			value = cache[ keypath ];
		}

		// If the property doesn't exist on this viewmodel, we
		// can try going up a scope. This will create bindings
		// between parent and child if possible
		if ( value === FAILED_LOOKUP ) {
			if ( ractive._parent && !ractive.isolated ) {
				value = getFromParent( ractive, keypath );
			} else {
				value = undefined;
			}
		}

		if ( evaluateWrapped && ( wrapped = ractive._wrapped[ keypath ] ) ) {
			value = wrapped.get();
		}

		return value;
	}

	circular.get = get;
	return get;


	function retrieve ( ractive, keypath ) {
		var keys, key, parentKeypath, parentValue, cacheMap, value, wrapped, shouldClone;

		keys = keypath.split( '.' );
		key = keys.pop();
		parentKeypath = keys.join( '.' );

		parentValue = get( ractive, parentKeypath );

		if ( wrapped = ractive._wrapped[ parentKeypath ] ) {
			parentValue = wrapped.get();
		}

		if ( parentValue === null || parentValue === undefined ) {
			return;
		}

		// update cache map
		if ( !( cacheMap = ractive._cacheMap[ parentKeypath ] ) ) {
			ractive._cacheMap[ parentKeypath ] = [ keypath ];
		} else {
			if ( cacheMap.indexOf( keypath ) === -1 ) {
				cacheMap.push( keypath );
			}
		}

		// If this property doesn't exist, we return a sentinel value
		// so that we know to query parent scope (if such there be)
		if ( typeof parentValue === 'object' && !( key in parentValue ) ) {
			return ractive._cache[ keypath ] = FAILED_LOOKUP;
		}

		value = parentValue[ key ];

		// If we end up wrapping this value with an adaptor, we
		// may need to try and clone it if it actually lives on
		// the prototype of this instance's `data`. Otherwise the
		// instance could end up manipulating data that doesn't
		// belong to it
		shouldClone = !hasOwnProperty.call( parentValue, key );

		// Do we have an adaptor for this value?
		value = adaptIfNecessary( ractive, keypath, value, false, shouldClone );

		// Update cache
		ractive._cache[ keypath ] = value;
		return value;
	}

});
