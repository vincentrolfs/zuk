<?php header('Content-Type: text/javascript'); ?>

// script.js

// todo

// - autosave position
// - bumping sound hack
// - isDoor on loadingPoint, not switchPoint
// - bumping sound can be heard when sound off: better make switches for sounds and music

(function(window, document, undefined){

window.Q = Quintus({ 
	
			development: true,
			audioSupported: ["mp3"]
	
		})
		
		.include("Sprites, Scenes, Input, 2D, Anim, TMX, UI, Audio")

		.setup("canvas")

		.controls()
		.enableSound();
		
Q.debug = 0;
		
// No gravity please

Q.gravityX = Q.gravityY = 0;

<?php require("utilities.js"); ?>

// Background blackness, text display etc.
<?php require("ui.js"); ?>

// Contains smartControls, playerFunctions
<?php require("components.js"); ?>

// Contains Person and Item classes
<?php require("classes.js"); ?>

// Functionality to add new maps
<?php require("add_maps.js"); ?>

// Load some files

Q.load("dp_tileset.png, interior.png, item.png, persons/old_man.png, bump.mp3, item_found.mp3", function() {

	// Defines position of animation frames
	<?php require("image_definitions.js"); ?>

	Q.stageScene("_blackmap", 0);

	Q.stageScene("_ui", 2);
	
	Q.stageScene("players_room", 1);

});


}(this, this.document));