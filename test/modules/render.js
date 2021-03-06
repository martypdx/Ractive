// RENDERING TESTS
// ===============
//
// TODO: add moar tests

define([ 'ractive', 'samples/render' ], function ( Ractive, tests ) {

	return function () {

		var fixture = document.getElementById( 'qunit-fixture' ), runTest, theTest, magicModes, hasSvg, i;

		module ( 'Render' );

		try {
			var obj = {}, _foo;
			Object.defineProperty( obj, 'foo', {
				get: function () {
					return _foo;
				},
				set: function ( value ) {
					_foo = value;
				}
			});
			magicModes = [ false, true ];
		} catch ( err ) {
			magicModes = [ false ];
		}

		hasSvg = document.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1' );

		// argh IE
		if ( ![].reduce ) {
			Array.prototype.reduce = function ( reducer, start ) {
				var i, len, reduced;

				reduced = start || 0;

				len = this.length;
				for ( i=0; i<len; i+=1 ) {
					if ( this.hasOwnProperty( i ) ) {
						reduced = reducer( reduced, this[i] );
					}
				}

				return reduced;
			};
		}

		runTest = function ( i ) {
			var theTest = tests[i];

			if ( theTest.nodeOnly ) {
				return;
			}

			test( theTest.name, function ( t ) {
				magicModes.forEach( function ( magic ) {
					var view, data;

					data = typeof theTest.data === 'function' ? theTest.data() : deepClone( theTest.data );

					view = new Ractive({
						el: fixture,
						data: data,
						template: theTest.template,
						partials: theTest.partials,
						debug: true,
						magic: magic
					});

					t.htmlEqual( fixture.innerHTML, theTest.result );
					t.htmlEqual( view.toHTML(), theTest.result );

					if ( theTest.new_data ) {
						data = typeof theTest.new_data === 'function' ? theTest.new_data() : deepClone( theTest.new_data );
						view.set( data );

						t.htmlEqual( fixture.innerHTML, theTest.new_result );
						t.htmlEqual( view.toHTML(), theTest.new_result );
					}

					view.teardown();
				});
			});
		};

		for ( i=0; i<tests.length; i+=1 ) {
			if ( !hasSvg && tests[i].svg ) {
				continue;
			}

			runTest( i );
		}

		test('Style elements have content inserted that becomes .textContent gh #569', function(t){
			var ractive = new Ractive({
					el: fixture,
					template: '<svg><style id="style">text { font-size: 40px }</style></svg>'
				}),
			 	style = document.getElementById('style');
			 	t.ok( style );
			 	t.equal( style.textContent, 'text { font-size: 40px }' )
		});

		test('Nested keypath expression updates when array index member changes', function(t){
			var ractive = new Ractive({
					el: fixture,
					template: '{{#item}}{{foo[bar]}}{{/}}',
					data: { item: { foo: ['fizz', 'bizz'], bar: 0 } }
				})
			 	t.equal( fixture.innerHTML, 'fizz' )
			 	ractive.set( 'item.bar', 1)
			 	t.equal( fixture.innerHTML, 'bizz' )

		});

/*
		test('List of inputs with nested keypathexpression name updates correctly', function(t){
			var ractive = new Ractive({
					el: fixture,
					template: "{{#step}}{{#options}}<input type='radio' name='{{responses[step.name]}}' value='{{.}}'/>{{/}}{{/}}",
					data: {
				        step: {
				            name: 'Products',
				            options: ['1', '2']
				        },
				        responses: {}
				    }
				})
				ractive.set('step', {
				    name: 'Colors',
				    options: ['red', 'blue', 'yellow']
				})

			 	expect(3)
			 	ractive.findAll('input').forEach(function(input){
				    t.equal( input.name, '{{responses.Colors}}' )
				})

		});

		test('List of inputs with keypathexpression name update correctly', function(t){
			var ractive = new Ractive({
					el: fixture,
					template: "<input type='radio' name='{{responses[topic]}}'/>",
					data: {
				        topic: 'Product',
				        responses: {}
				    }
				})
			ractive.set('topic', 'Color')	
			var input = ractive.find('input')
			t.ok( input )
			t.equal( input.name, '{{responses.Colors}}' )
			
		});
*/
	};

	function deepClone ( source ) {
		var target, key;

		if ( !source || typeof source !== 'object' ) {
			return source;
		}

		if ( isArray( source ) ) {
			return source.slice();
		}

		target = {};

		for ( key in source ) {
			if ( source.hasOwnProperty( key ) ) {
				target[ key ] = deepClone( source[ key ] );
			}
		}

		return target;
	}

	function isArray ( thing ) {
		return Object.prototype.toString.call( thing ) === '[object Array]';
	}

});
