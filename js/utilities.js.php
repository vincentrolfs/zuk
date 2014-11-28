// Global varibales start with $
var $audioEnabled = window.location.search.indexOf("quiet") == -1, // String "quiet" can not be found in parameters? => audio enabled
	$music = "", // Current song of map
	$state = {
		
		items: {},
		pokemon: []	
	
	},
	$itemNames = {
	
		"1": "Pokeball"
	
	},
	$activeMap = "",
	$maps = {},
	$ui_textContainer, // Container for displayed text
	$ui_text, // Displayed text itself
	$ui_busy = false;
	
	window.$state = $state;
	window.$maps = $maps;
	
	window.$player = false; // Variable holds instance of Person class that has player functions
	
function handleMusic(newMusic){
	
	if (newMusic){
	
		if (newMusic == $music) return; // The music for the new map is the same!
	
		$music = newMusic;
	
	}

	Q.audio.stop();
	
	// newMusic was just empty string - just stop music.
	if (!$music) return;
		
	Q.load($music, function(){
	
		if ($audioEnabled){
		
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
	
	var persons = $maps[$activeMap].persons;
	
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

function addMap(mapData){
	
	var myAssets = []; // The stuff nearby maps load
	
	if (mapData.music) myAssets.push( mapData.music );
	if (mapData.fileName) myAssets.push( mapData.fileName );
	
	// Initialize events object for this map
	$maps[mapData.mapName] = {
	
		items: mapData.items || [], // The items that are still on this map
		persons: [],
		act: mapData.firstAct || "0",
		
		assets: myAssets, // So that other maps know what files this one uses & can load them beforehand
		visited: false
	
	};
	
	if (!mapData.switchPoints) mapData.switchPoints = [];
	if (!mapData.loadingPoints) mapData.loadingPoints = { default: [0, 0] };
	
	// Create scene with proper name
	Q.scene(mapData.mapName, function(stage) {
		
		// stage contains the actual visible stuff, thus you can do stage.insert
		
		$activeMap = mapData.mapName;
		
		$maps[mapData.mapName].visited = true;
		
		var currentAct = $maps[mapData.mapName].act,
			comingFrom,
			oldDirection,
			loadX,
			loadY,
			direction;
		
		// ----- Start player config
		
		if ($player){
		
			comingFrom = $player.getMap();
			oldDirection = $player.getDirection();
				
			// If the location where player comes from doesn't have it's own loading point
			if (typeof mapData.loadingPoints[comingFrom] == "undefined"){
				
				// Use default loading point
				comingFrom = "default";
				
			}
			
		} else { // No player there yet
		
			comingFrom = "default";	
			
		}
		
		loadX = mapData.loadingPoints[comingFrom][0];
		loadY = mapData.loadingPoints[comingFrom][1];
		
		direction = mapData.loadingPoints[comingFrom][2] || oldDirection || "down";
		
		// Make changes to the player instance
		var playerConfig = {
			
			hasMoved: false,
		
			x: loadX,
			y: loadY,
			
			startingX: loadX,
			startingY: loadY,
			
			direction: 	direction,
			
			mapName: mapData.mapName,
			
			switchPoints: mapData.switchPoints
			// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
		
		};
		
		if (!$player) $player = new Q.Person(playerConfig, true);
		
		else $player.set(playerConfig);
		
		// ----- End player config
		
		// ----- Start organising act
		
		function organiseAct(){
		
			if (mapData.acts && mapData.acts[currentAct] && (typeof mapData.acts[currentAct].organise === "function")){
				
				mapData.acts[currentAct].organise();
				
			}
			
		}
		
		// ----- End organising act
		
		// ----- Start map creation
		
		if (!mapData.fileName){
			
			Q.stageScene("blackmap", 1);
			
			organiseAct();
			
		} else {
		
			// Load tmx file
			Q.load(mapData.fileName, function(){
		
				// Display tmx map
				Q.stageTMX(mapData.fileName, stage);
				
				stage.insert($player);
				
				// Camera follows player
				stage.add("viewport").follow($player);
				
				// ----- Start items inserting
				
				var i = 0,
					items = $maps[mapData.mapName].items, // The items that are still on this map
					l = items.length;
					
				for ( ; i < l; i++ ){
					
					stage.insert(new Q.Item( items[i], i ) );
					
				}
				
				// ----- End items inserting
				
				// ----- Start persons inserting
				
				var persons = mapData.persons || []; // Persons that appear no matter what act it is
				
				// If current act exists & provides special persons
				if (mapData.acts && mapData.acts[currentAct] && mapData.acts[currentAct].persons){
					
					// Add persons of this act to the array
					persons = persons.concat( mapData.acts[currentAct].persons );
					
				}
					
				var persons_length = persons.length,
					i = 0;
					
				for ( ; i < persons_length; i++ ){
					
					$maps[mapData.mapName].persons.push( stage.insert( new Q.Person( persons[i]) ) );
					
				}
				
				// ----- End persons inserting
				
				organiseAct();
				
			});
			
		}
		
		// ----- End map creation
		
		// Put on music
		handleMusic( mapData.music );
		
		// ----- Start loading of nearby maps' asses
		
		// Go through reachable maps and load their assets!
		var reachables = mapData.switchPoints,
			i = 0,
			l = reachables.length,
			loadArray = mapData.preload || [], // Some maps have other stuff they want to preload
			mapName;
		
		// Go through reachable maps...
		for ( ; i < l; i++){
			
			mapName = reachables[i][2];
			
			// If map has not been visited yet
			if ( !$maps[ mapName ].visited ){
			
				loadArray = loadArray.concat( $maps[ mapName ].assets );
				
			}
			
		}
		
		Q.load(loadArray);
		
		// ----- End loading of nearby maps' data
	
	}, { // Options for scene
		
		// Sort things on stage (persons etc) by y-values (height)
		sort: function(a,b) { return ((a.p && a.p.y) || -1) - ((b.p && b.p.y) || -1) }
		
	});

}