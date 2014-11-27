// Global varibales start with $
var $audio_enabled = window.location.search.indexOf("quiet") == -1, // String "quiet" can not be found in parameters? => audio enabled
	$music = "", // Current song of map
	$state = {
		
		items: {},
		pokemon: []	
	
	},
	$itemNames = {
	
		"1": "Pokeball"
	
	},
	$active_map = "",
	$maps = {},
	$ui_textContainer, // Container for displayed text
	$ui_text, // Displayed text itself
	$ui_busy = false;
	
	window.$state = $state;
	window.$maps = $maps;
	
	window.$player = false; // Variable holds instance of Person class that has player functions
	
function handle_music(new_music){
	
	if (new_music){
	
		if (new_music == $music) return; // The music for the new map is the same!
	
		$music = new_music;
	
	}

	Q.audio.stop();
	
	if (!$music) return;
		
	Q.load($music, function(){
	
		if ($audio_enabled){
		
			Q.audio.play($music, { loop: true });
		
		}
		
	});	

}

function mapSwitch(to, door){
	
	Q.clearStage(1);	
	
	window.setTimeout(function(){
	
		// Stage the new scene (layer 1)
		Q.stageScene(to, 1);
		
		if (door){ // If it was a door!
	
			$player.go($player.p.direction);
		
		}
	
	}, 300);
	
}

function displayText(txtArr, callback){
	
	$ui_busy = true;
	
	// ----- start freezing
	
	var persons = $maps[$active_map].persons;
	
	persons.push($player);
		
	var	persons_length = persons.length,
		person_no = 0;
		
	for ( ; person_no < persons_length; person_no++ ){
		
		persons[person_no].setFreeze(true);
		
	}
	
	// ----- end freezing
	
	// Function that actually puts the text on the map
	function _display(text){
		
		// Set the label of the textbox to the first text in the array
		$ui_text.p.label = text;
		
		// Make container visible
		$ui_textContainer.p.hidden = false;
		
	}
	
	if (typeof txtArr === "string") txtArr = [txtArr];
	
	// Display 1st text
	_display(txtArr[0]);
	
	var i = 1; // Counter that goes through txtArr
	
	// Add listener to change into the next text
	Q.input.on("action", function(){
		
			// If all texts have been displayed…
			if (i >= txtArr.length){
				
				$ui_busy = false;
				
				// ----- start unfreezing
				
				person_no = 0;
				
				for ( ; person_no < persons_length; person_no++ ){
		
					persons[person_no].setFreeze(false);
		
				}
				
				// ----- end unfreezing
				
				$ui_textContainer.p.hidden = true;
				
				if (typeof callback == "function") callback();
				
				// Remove listener
				Q.input.off("action", this);
				
				return;
				
			}
		
			// Else:
		
			_display(txtArr[i]);
			
			i += 1;
		
	});
	
}

/*

- adds a new map to quintus

function addMap(data)
	data = {
	
		mapName: "",
		fileName: "", 		--opt
		loadingPoints: {},	--opt if no file name
		switchPoints: [],	--opt
		items: [], 			--opt
		persons: [], 		--opt
		music: "",			--opt
		firstAct: "",		--opt
		acts: { 			--opt
			
			name: { persons: [], organise: function(){} }
			
		} 			
	
	}
*/

function addMap(map_data){
	
	var my_assets = []; // The stuff nearby maps load
	
	if (map_data.music) my_assets.push( map_data.music );
	if (map_data.fileName) my_assets.push( map_data.fileName );
	
	// Initialize events object for this map
	$maps[map_data.mapName] = {
	
		items: map_data.items || [], // The items that are still on this map
		persons: [],
		act: map_data.firstAct || "0",
		
		assets: my_assets, // So that other maps know what files this one uses & can load them beforehand
		visited: false
	
	};
	
	if (!map_data.switchPoints) map_data.switchPoints = [];
	if (!map_data.loadingPoints) map_data.loadingPoints = { default: [0, 0] };
	
	// Create scene with proper name
	Q.scene(map_data.mapName, function(stage) {
		
		// stage contains the actual visible stuff, thus you can do stage.insert
		
		$active_map = map_data.mapName;
		
		$maps[map_data.mapName].visited = true;
		
		var current_act = $maps[map_data.mapName].act,
			coming_from,
			old_direction,
			loadX,
			loadY,
			direction;
		
		// ----- Start player config
		
		if ($player){
		
			coming_from = $player.getMap();
			old_direction = $player.getDirection();
				
			// If the location where player comes from doesn't have it's own loading point
			if (typeof map_data.loadingPoints[coming_from] == "undefined"){
				
				// Use default loading point
				coming_from = "default";
				
			}
			
		} else { // No player there yet
		
			coming_from = "default";	
			
		}
		
		loadX = map_data.loadingPoints[coming_from][0];
		loadY = map_data.loadingPoints[coming_from][1];
		
		direction = map_data.loadingPoints[coming_from][2] || old_direction || "down";
		
		// Make changes to the player instance
		var playerConfig = {
			
			hasMoved: false,
		
			x: loadX,
			y: loadY,
			
			startingX: loadX,
			startingY: loadY,
			
			direction: 	direction,
			
			mapName: map_data.mapName,
			
			switchPoints: map_data.switchPoints
			// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
		
		};
		
		if (!$player) $player = new Q.Person(playerConfig, true);
		
		else $player.set(playerConfig);
		
		// ----- End player config
		
		// ----- Start organising act
		
		function organise_act(){
		
			if (map_data.acts && map_data.acts[current_act] && (typeof map_data.acts[current_act].organise === "function")){
				
				map_data.acts[current_act].organise();
				
			}
			
		}
		
		// ----- End organising act
		
		// ----- Start map creation
		
		if (!map_data.fileName){
			
			Q.stageScene("blackmap", 1);
			
			organise_act();
			
		} else {
		
			// Load tmx file
			Q.load(map_data.fileName, function(){
		
				// Display tmx map
				Q.stageTMX(map_data.fileName, stage);
				
				stage.insert($player);
				
				// Camera follows player
				stage.add("viewport").follow($player);
				
				// ----- Start items inserting
				
				var i = 0,
					items = $maps[map_data.mapName].items, // The items that are still on this map
					l = items.length;
					
				for ( ; i < l; i++ ){
					
					stage.insert(new Q.Item( items[i], i ) );
					
				}
				
				// ----- End items inserting
				
				// ----- Start persons inserting
				
				var persons = map_data.persons || []; // Persons that appear no matter what act it is
				
				// If current act exists & provides special persons
				if (map_data.acts && map_data.acts[current_act] && map_data.acts[current_act].persons){
					
					// Add persons of this act to the array
					persons = persons.concat( map_data.acts[current_act].persons );
					
				}
					
				var persons_length = persons.length,
					i = 0;
					
				for ( ; i < persons_length; i++ ){
					
					$maps[map_data.mapName].persons.push( stage.insert( new Q.Person( persons[i]) ) );
					
				}
				
				// ----- End persons inserting
				
				organise_act();
				
			});
			
		}
		
		// ----- End map creation
		
		// Put on music
		handle_music( map_data.music );
		
		// ----- Start loading of nearby maps' asses
		
		// Go through reachable maps and load their assets!
		var reachables = map_data.switchPoints,
			i = 0,
			l = reachables.length,
			load_array = map_data.preload || [], // Some maps have other stuff they want to preload
			map_name;
		
		// Go through reachable maps...
		for ( ; i < l; i++){
			
			map_name = reachables[i][2];
			
			// If map has not been visited yet
			if ( !$maps[ map_name ].visited ){
			
				load_array = load_array.concat( $maps[ map_name ].assets );
				
			}
			
		}
		
		Q.load(load_array);
		
		// ----- End loading of nearby maps' data
	
	}, { // Options for scene
		
		// Sort things on stage (persons etc) by y-values (height)
		sort: function(a,b) { return ((a.p && a.p.y) || -1) - ((b.p && b.p.y) || -1) }
		
	});

}