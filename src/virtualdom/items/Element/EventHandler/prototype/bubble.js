export default function EventHandler$bubble () {

	var hasAction = this.getAction();

	if( hasAction && !this.node ) {
		this.render();
	} else if ( !hasAction && this.node ) {
		this.unrender();
	}



}
