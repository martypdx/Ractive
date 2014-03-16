define([ 'Ractive' ], function ( Ractive ) {

	'use strict';

	return function () {

		var fixture, Foo;

		module( 'Components' );

		fixture = document.getElementById( 'qunit-fixture' );

		test( 'Basic dynamic markup render', function ( t ) {
			var ractive;

			ractive = new Ractive({
				el: fixture,
				template: '{{{markup}}}',
				data: {
					markup: '<p>hello</p>'
				}
			});

			t.htmlEqual( fixture.innerHTML, '<p>hello</p>' );
		});

		test( 'Dynamic markup is Ractive rendered', function ( t ) {
			var ractive;

			ractive = new Ractive({
				el: fixture,
				template: '{{{markup}}}',
				data: {
					markup: '<p>hello {{world}}</p>',
					world: 'earth'
				}
			});

			t.htmlEqual( fixture.innerHTML, '<p>hello earth</p>' );
			ractive.set('world', 'mars')
			t.htmlEqual( fixture.innerHTML, '<p>hello mars</p>' );
		});


		test( 'Dynamic markup is rerendered on markup change', function ( t ) {
			var ractive;

			ractive = new Ractive({
				el: fixture,
				template: '{{{markup}}}',
				data: {
					markup: '<p>hello {{world}}</p>',
					world: 'earth'
				}
			});

			t.htmlEqual( fixture.innerHTML, '<p>hello earth</p>' );
			ractive.set('markup', '<div>welcome to {{world}}</div>')
			t.htmlEqual( fixture.innerHTML, '<div>welcome to earth</div>' );
		});


	}
});
