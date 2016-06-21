// todo
// - bumping sound hack

// Not used everywhere yet
var BLACKMAP_LEVEL = 0; 
var MAIN_LEVEL = 1;
var UI_LEVEL = 2;

var MUSIC_COOKIENAME = "musicEnabled";
var SOUND_COOKIENAME = "soundEnabled";
var SAVEGAME_COOKIENAME = "savegame";

// What value to use when saving a boolean cookie, e.g. soundEnabled
var COOKIE_TRUTHVALUE = "1";
var COOKIE_FALSEVALUE = "0";

var PLAYER_SHEET = "robert";

var DEFAULT_MAP = "begin";
var MAP_SWITCH_TIMEOUT = 300;
var DEFAULT_TEXT_SPEED = 1500;

var SOUNDFILE_BUMP = "bump.mp3";
var SOUNDFILE_ITEM = "item.mp3";

var MARKER_SHEET = "marker";

var IMAGEFILE_ASSET_MARKER = "asset_marker.png";
var IMAGEFILE_PERSON_MARKER = "persons/person_marker.png";
var IMAGEFILE_ITEM = "item.png";

var TEXT_FAMILY = "aller";
var TEXT_SIZE = 26;

// Global varibales start with $
var $musicEnabled = docCookies.getItem(MUSIC_COOKIENAME) === COOKIE_TRUTHVALUE,
	$soundEnabled = docCookies.getItem(SOUND_COOKIENAME) === COOKIE_TRUTHVALUE,
	$music = "", // Current song of map
	
	$state = {
		
		items: {}
	
	},
	
	$itemNames = {
	
		"1": "Sprudel",
		"2": "Goldtaler"
	
	},
	
	$savegame, // Hier werden die gespeicherten Daten reingetan, wenn Spiel geladen wird
	
	$activeMap = "",
	$maps = {},
	
	$ui_textContainer, // Container for displayed text
	$ui_textTriangle,
	$ui_text, // Displayed text itself
	$ui_busy = false,
	
	$dev_mode = false,
	
	$player; // Variable holds instance of Person class that has player functions

function startGame(){
	
	var saveCookie = docCookies.getItem(SAVEGAME_COOKIENAME),
		saveObject,
		error = false,
		mapToStage;
		
	try {
	 	
	 	saveObject = JSON.parse(saveCookie);
	
	} catch(e){
	
		error = true;
	
	}
	
	if (error || !saveObject || location.search === "?new"){
	
		mapToStage = DEFAULT_MAP;
		console.log("Could not load savegame.");
	
	} else {
	
		$savegame = saveObject;
		mapToStage = saveObject.player.map;
		
		// Save map data
		
		var savedMaps = saveObject.maps;
		
		for (var map in savedMaps){
		
			if (savedMaps.hasOwnProperty(map) && $maps.hasOwnProperty(map)){
		
				$maps[map].p.act = savedMaps[map].act;
				loadItems(map);
			
			}
		
		}
		
		// Save state
		
		$state = saveObject.state;
		
		console.log("Loaded savegame and maps: ", saveObject, $maps);
	
	}
	
	Q.stageScene("_blackmap", BLACKMAP_LEVEL);
	Q.stageScene("_ui", UI_LEVEL);
	
	Q.stageScene(mapToStage, MAIN_LEVEL);

}

function loadItems(map){

	var savedMaps = $savegame.maps;
	
	if (typeof savedMaps[map].items != "object" || !savedMaps[map].items.length) return;
	
	var savedItems = savedMaps[map].items,
		realItems = $maps[map].p.items,
		saved, real;
		
	for (var i = 0; i < savedItems.length; i++){
	
		for (var j = 0; j < realItems.length; j++){
	
			saved = savedItems[i];
			real = realItems[j];
			
			if (saved.x == real.x && saved.y == real.y && saved.no == real.no){
			
				real.found = !!saved.found;
			
			}
	
		}
	
	}

}

function saveGame(){

	if ($ui_busy || !$player.p.userControlledStepping || $player.p.stepping) return;

	var saveObject = {};
	
	saveObject.state = $state;
	saveObject.player = {
	
		x: $player.p.x,
		y: $player.p.y,
		direction: $player.p.direction,
		map: $activeMap
	
	};
	
	var mapData = {};
	
	for (var map in $maps){
	
		if ($maps.hasOwnProperty(map)){
	
			mapData[map] = {
			
				items: $maps[map].p.items,
				act: $maps[map].p.act
			
			}
		
		}
	
	}
	
	saveObject["maps"] = mapData;
	
	saveString = JSON.stringify(saveObject);
	
	docCookies.setItem(SAVEGAME_COOKIENAME, saveString, Infinity);
	
	console.log("saved: ", saveString);
	
	displayText(["Spiel gespeichert!"]);

}

function resetPlayer(){ // Will be called when maps are staged

	$player = new Q.Person({sheet: PLAYER_SHEET}, true);

}

function handleMusic(newMusic){
	
	if (newMusic){
	
		if (newMusic == $music) return; // The music for the new map is the same!
	
		else $music = newMusic;
	
	}

	Q.audio.stop();
	
	// newMusic was just empty string - just stop music.
	if (!$music) return;
		
	Q.load($music, function(){
	
		if ($musicEnabled){
		
			Q.audio.play($music, { loop: true });
		
		}
		
	});	

}

function playSound(soundfile){

	if ($soundEnabled) Q.audio.play(soundfile);

}

function mapSwitch(to){

	Q.clearStage(1);
	
	// Timeout because it feels more natural in-game
	window.setTimeout(function(){
	
		// Stage the new scene (layer 1)
		Q.stageScene(to, MAIN_LEVEL);
	
	}, MAP_SWITCH_TIMEOUT);
	
}

function getActionSprites(){

	// All the sprites the player can interact with
	return Q("Person", MAIN_LEVEL).items.concat(Q("Item", MAIN_LEVEL).items).concat(Q("Invisible", MAIN_LEVEL).items);

}

function addMap(mapData){

	/*

- adds a new map to quintus

function addMap(data)
	data = {
	
		mapName: "",
		fileName: "", 								//--opt (blackmap if not provided)
		
		loadingPoints:  { default: [0, 0] },		//--opt if blackmap
		switchPoints: [],							//--opt
		
		items: [], 									//--opt
		invisibles: [], 							//--opt
		persons: [], 								//--opt
		music: "",									//--opt
		
		firstAct: "0",								//--opt
		acts: [										//--opt, can be hash
		
			{ persons: [], organise: function(){} } // --opt (both)
		
		], 								
		
		loadAssetsOf: []							//--opt (signifies for which maps this one should also preload the assets)

	}
*/
	
	if (!mapData.mapName) throw "No map name provided!";
	
	$maps[mapData.mapName] = new Q.Map(mapData);
	
}