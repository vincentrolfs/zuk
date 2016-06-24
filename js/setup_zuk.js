var zuk = new Q.Game(),
	zuk_ui = zuk.getUIHandler(),
	zuk_player = zuk.getPlayer();
	
// todo
// - bumping sound hack
// - music doesn't work properly in safari
// - maps.p.persons ist bisschen unnötig, weil man einfach Q.("Person", MAIN_LEVEL) machen kann. <= erstmal rausgenommen
// - used array.filter => browser support?