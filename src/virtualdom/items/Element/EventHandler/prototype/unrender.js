export default function EventHandler$unrender () {

	if ( this.custom ) {
		this.custom.teardown();
	} else {
		this.node.removeEventListener( this.name, this.getHandler(), false );
	}

	this.node._ractive.events[ this.name ] = void 0;
	this.node = void 0;
}
