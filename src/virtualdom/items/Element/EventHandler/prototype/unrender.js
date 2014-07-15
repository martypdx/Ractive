export default function EventHandler$unrender () {

	if ( this.custom ) {
		this.custom.teardown();
	} else {
		this.node.removeEventListener( this.name, this.getHandler(), false );
	}

}
