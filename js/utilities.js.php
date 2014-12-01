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
	
	var persons = $maps[$activeMap].p.persons;
	
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
		fileName: "", 								//--opt (blackmap if not provided)
		
		loadingPoints:  { default: [0, 0] },		//--opt if blackmap
		switchPoints: [],							//--opt
		
		items: [], 									//--opt
		persons: [], 								//--opt
		music: "",									//--opt
		
		firstAct: "0",								//--opt
		acts: [										//--opt, can be hash
		
			{ persons: [], organise: function(){} } // --opt (both)
		
		], 								
		
		loadAssetsOf: []							//--opt (signifies for which maps this one should also preload the assets)

	}
*/

function addMap(mapData){
	
	if (!mapData.mapName) throw "No map name provided!";
	
	$maps[mapData.mapName] = new Q.Map(mapData);
	
}