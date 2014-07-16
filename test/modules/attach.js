define([
	'ractive',
	'utils/createElement'
], function (
	Ractive,
	createElement
) {

	'use strict';

	return function () {

		var fixture = document.getElementById( 'qunit-fixture' );

		module( 'ractive.attach()' );

		test( 'Existing element is not replaced', function ( t ) {
			var ractive, p = createElement( 'p' );

			fixture.appendChild( p );

			ractive = new Ractive({
				template: '<p></p>'
			});

			ractive.attach( fixture );

			t.equal( fixture.children.length, 1 );
			t.equal( fixture.children[0], p );

		});

	};
});
