<?php header('Content-Type: text/javascript'); ?>

// script.js

A = []

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

// Provides better Math.random
Math.seedrandom();

<?php require("10_utilities.js"); ?>

// Background blackness, text display etc.
<?php require("20_ui.js"); ?>

// Contains smartControls, playerFunctions
<?php require("30_components.js"); ?>

// Contains Person and Item classes
<?php require("40_classes.js"); ?>

// Functionality to add new maps
<?php require("50_add_maps.js"); ?>

// Developer mode
<?php require("70_development.js"); ?>

// Load some files

Q.load(["dp_tileset.png", "interior.png", IMAGEFILE_ITEM, IMAGEFILE_PERSON_MARKER, IMAGEFILE_ASSET_MARKER, "persons/max.png", "persons/jersey.png", "persons/robert.png", "persons/claire.png", SOUNDFILE_BUMP, SOUNDFILE_ITEM, "triangle.png"], function() {

	// Defines position of animation frames
	<?php require("60_image_definitions.js"); ?>
	
	startGame();

});