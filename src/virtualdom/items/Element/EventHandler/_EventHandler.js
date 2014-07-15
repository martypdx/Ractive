import fire from 'virtualdom/items/Element/EventHandler/prototype/fire';
import init from 'virtualdom/items/Element/EventHandler/prototype/init';
import rebind from 'virtualdom/items/Element/EventHandler/prototype/rebind';
import render from 'virtualdom/items/Element/EventHandler/prototype/render';
import teardown from 'virtualdom/items/Element/EventHandler/prototype/teardown';
import unrender from 'virtualdom/items/Element/EventHandler/prototype/unrender';
import bubble from 'virtualdom/items/Element/EventHandler/prototype/bubble';
import getHandler from 'virtualdom/items/Element/EventHandler/prototype/getHandler';

var EventHandler = function ( element, name, template ) {
	this.init( element, name, template );
};

EventHandler.prototype = {
	fire: fire,
	init: init,
	rebind: rebind,
	render: render,
	teardown: teardown,
	unrender: unrender,
	bubble: bubble,
	getHandler: getHandler
};

export default EventHandler;
