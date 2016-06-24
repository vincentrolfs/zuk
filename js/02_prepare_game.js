window.Q = Quintus({ 
	development: true,
	audioSupported: ["mp3"]
})
.include("Sprites, Scenes, Input, 2D, Anim, TMX, UI, Audio")
.setup("canvas")
.controls()
.enableSound();

Q.input.keyboardControls({
	X: "action",
	Z: "action",
	SPACE: "action",
	81: "action", 	// "Q"
	69: "action", 	// "E"
	87: "up",		// "W"
	65: "left",		// "A"
	83: "down",		// "S"
	68: "right"		// "D"
});

Q.input.mouseControls({

	cursor: "default",
	stageNum: 1

});
		
// No gravity please
Q.gravityX = Q.gravityY = 0;

Q.Class.extend("Game", {

	init: function(){
	
		// Provides better Math.random
		Math.seedrandom();
	
	}

});