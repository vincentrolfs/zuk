window.Q = Quintus({ 
	development: false,
	audioSupported: ["mp3"]
})
.include("Sprites, Scenes, Input, 2D, Anim, TMX, UI, Audio")
.setup(CANVAS_ID)
.controls(); 

Q.audio.enableWebAudioSound();

Q.input.keyboardControls({
	X: "action",
	Z: "action",
	SPACE: "action",
	ENTER: "action",
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