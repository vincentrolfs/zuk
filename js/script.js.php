<?php header('Content-Type: text/javascript'); ?>

// script.js

// todo
// - autosave position
// - bumping sound hack
// - textDisplay direction hack ; zb ensure function
// - isDoor on loadingPoint, not switchPoint

(function(window, document, undefined){

window.Q = Quintus({ 
	
			development: true,
			audioSupported: ["mp3"]
	
		})
		.include("Sprites, Scenes, Input, 2D, Anim, TMX, UI, Audio")
		.setup("canvas")
		.controls()
		.enableSound();

// No gravity please
Q.gravityX = Q.gravityY = 0;

<?php require("utilities.js.php"); ?>

// Background blackness, text display etc.
<?php require("ui.js.php"); ?>

// Contains smartControls, playerFunctions
<?php require("components.js.php"); ?>

// Contains Person and Item classes
<?php require("classes.js.php"); ?>

// Functionality to add new maps
<?php require("add_maps.js.php"); ?>

// Load some files
Q.load("dp_persons.png, tileset.png, dp_tileset.png, interior.png, bump.mp3, item_found.mp3", function() {

	// Defines position of animation frames
	<?php require("image_definitions.js.php"); ?>
	
	// Define tilesheet named "main_sheet"
	Q.sheet("main_sheet",
			"tileset.png",
			{
				tilew: 16,
				tileh: 16
			}
	);
	
	Q.stageScene("_blackmap", 0);
	
	Q.stageScene("_ui", 2);
	
	Q.stageScene("begin", 1);

});

}(this, this.document));