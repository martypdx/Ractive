define([
	'config/types'
], function (
	types
) {

	'use strict';

	return function getInterpolator ( attribute ) {
		var items, item;

		items = attribute.fragment.items;

		if ( items.length !== 1 ) {
			return;
		}

		item = items[0];

		if ( item.type !== types.INTERPOLATOR || ( !item.keypath && !item.ref ) ) {
			return;
		}

		return item;
	};

});