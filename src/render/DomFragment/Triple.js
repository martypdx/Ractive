define([
	'config/types',
	'utils/matches',
	'render/shared/initMustache',
	'render/shared/updateMustache',
	'render/shared/resolveMustache',
	'render/DomFragment/shared/insertHtml',
	'render/DomFragment/Component/_Component',
	'parse/_parse',
	//'Ractive',
	'shared/teardown'
], function (
	types,
	matches,
	initMustache,
	updateMustache,
	resolveMustache,
	insertHtml,
	Component,
	parse,
	//Ractive,
	teardown
) {

	'use strict';

	var DomTriple = function ( options, docFrag ) {
		this.type = types.TRIPLE;

		this.options = options;
		this.docFrag = docFrag;

		// if ( docFrag ) {
		// 	this.nodes = [];
		// 	this.docFrag = document.createDocumentFragment();
		// }

		this.initialising = true;
		initMustache( this, options );
		// if ( docFrag ) {
		// 	docFrag.appendChild( this.docFrag );
		// }
		this.initialising = false;
	};

	DomTriple.prototype = {
		update: updateMustache,
		resolve: resolveMustache,

		detach: function () {
			var len, i;

			if ( this.docFrag ) {
				len = this.nodes.length;
				for ( i = 0; i < len; i += 1 ) {
					this.docFrag.appendChild( this.nodes[i] );
				}

				return this.docFrag;
			}
		},

		teardown: function ( destroy ) {
			if ( destroy ) {
				this.detach();
				this.docFrag = this.nodes = null;
			}

			teardown( this );
		},

		firstNode: function () {
			if ( this.nodes[0] ) {
				return this.nodes[0];
			}

			return this.parentFragment.findNextNode( this );
		},

		render: function ( html ) {
			var node, pNode;

			/*
			if ( !this.nodes ) {
				// looks like we're in a server environment...
				// nothing to see here, move along
				return;
			}

			// remove existing nodes
			while ( this.nodes.length ) {
				node = this.nodes.pop();
				node.parentNode.removeChild( node );
			}

			if ( !html ) {
				this.nodes = [];
				return;
			}
			

			// get new nodes
			pNode = this.parentFragment.pNode;
			*/



			if(this.component) {
				this.component.teardown(true);
			}

			//need a unique identifier instead of 'dynamic'...
			var name = 'dynamic';

			this.options.descriptor = parse('<' + name + '/>')[0];

			//should be current Component type, not necessarily Ractive...
			this.options.parentFragment.root.components[name] = Ractive.extend({
				template: html
				//what else to inherit from component type...
			});

			this.component = new Component( this.options, this.docFrag )



			/*
			this.nodes = insertHtml( html, pNode.tagName, this.docFrag );

			if ( !this.initialising ) {
				pNode.insertBefore( this.docFrag, this.parentFragment.findNextNode( this ) );
			}

			// Special case - we're inserting the contents of a <select>
			if ( pNode.tagName === 'SELECT' && pNode._ractive && pNode._ractive.binding ) {
				pNode._ractive.binding.update();
			}
			*/

		},

		toString: function () {
			return ( this.value != undefined ? this.value : '' );
		},

		find: function ( selector ) {
			var i, len, node, queryResult;

			len = this.nodes.length;
			for ( i = 0; i < len; i += 1 ) {
				node = this.nodes[i];

				if ( node.nodeType !== 1 ) {
					continue;
				}

				if ( matches( node, selector ) ) {
					return node;
				}

				if ( queryResult = node.querySelector( selector ) ) {
					return queryResult;
				}
			}

			return null;
		},

		findAll: function ( selector, queryResult ) {
			var i, len, node, queryAllResult, numNodes, j;

			len = this.nodes.length;
			for ( i = 0; i < len; i += 1 ) {
				node = this.nodes[i];

				if ( node.nodeType !== 1 ) {
					continue;
				}

				if ( matches( node, selector ) ) {
					queryResult.push( node );
				}

				if ( queryAllResult = node.querySelectorAll( selector ) ) {
					numNodes = queryAllResult.length;
					for ( j = 0; j < numNodes; j += 1 ) {
						queryResult.push( queryAllResult[j] );
					}
				}
			}
		}
	};

	return DomTriple;

});
