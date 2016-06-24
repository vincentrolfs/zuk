Q.Class.extend("Game", {

	init: function(){
	
		// Provides better Math.random
		Math.seedrandom();
		
		this.audioHandler = new Q.AudioHandler();
		this.UIHandler = new Q.UIHandler(this, this.audioHandler);
		
		this.player = null; // Variable holds instance of Person class that has player functions
		this.playerState = {
	
			items: {}

		};
		this.savegame = null;
		this.activeMapName = "";
		this.maps = {};
	
	},

	start: function(){
	
		var saveCookie = docCookies.getItem(SAVEGAME_COOKIENAME),
			savegame,
			error = false,
			mapToStage;
		
		try {
		
			savegame = JSON.parse(saveCookie);
	
		} catch(e){
	
			error = true;
	
		}
	
		if (error || !savegame || location.search === "?new"){
	
			mapToStage = DEFAULT_MAP;
			console.log("Could not load savegame.");
	
		} else {
	
			this.savegame = savegame;
			mapToStage = savegame.player.map;
		
			// Load map data
		
			var savedMaps = savegame.maps;
		
			for (var mapName in savedMaps){
		
				if (savedMaps.hasOwnProperty(mapName) && this.maps.hasOwnProperty(mapName)){
		
					this.maps[mapName].p.act = savedMaps[mapName].act;
					this.loadItems(mapName);
			
				}
		
			}
		
			// Save state
		
			this.playerState = savegame.playerState;
		
			console.log("Loaded savegame and maps: ", savegame, this.maps);
	
		}
	
		Q.stageScene(SCENE_BLACKMAP, BLACKMAP_LEVEL);
		Q.stageScene(SCENE_UI, UI_LEVEL);
	
		Q.stageScene(mapToStage, MAIN_LEVEL);
		this.activeMapName = mapToStage;
		
		console.log("Game is starting.");

	},
	loadItems: function(map){

		var savedMaps = this.savegame.maps;
	
		if (typeof savedMaps[map].items != "object" || !savedMaps[map].items.length) return;
	
		var savedItems = savedMaps[map].items,
			realItems = this.maps[map].p.items,
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

	},

	save: function(){
	
		var player = this.player;
		
		if (this.UIHandler.isBusy() || !player.p.userControlledStepping || player.p.freeze || player.p.stepping) return;

		var saveObject = {};
	
		saveObject.playerState = this.playerState;
		saveObject.player = {
	
			x: player.p.x,
			y: player.p.y,
			direction: player.p.direction,
			map: this.activeMapName
	
		};
	
		var mapData = {};
	
		for (var mapName in this.maps){
	
			if (this.maps.hasOwnProperty(mapName)){
	
				mapData[mapName] = {
			
					items: this.maps[mapName].p.items,
					act: this.maps[mapName].p.act
			
				}
		
			}
	
		}
	
		saveObject["maps"] = mapData;
	
		saveString = JSON.stringify(saveObject);
		docCookies.setItem(SAVEGAME_COOKIENAME, saveString, Infinity);
		console.log("Saved game: ", saveString);
	
		this.UIHandler.displayText(["Spiel gespeichert!"]);

	},

	switchMap: function(to){
	
		var game = this;
		Q.clearStage(1);
	
		// Timeout because it feels more natural in-game
		window.setTimeout(function(){
		
			game.activeMapName = to;
	
			Q.stageScene(to, MAIN_LEVEL);
	
		}, MAP_SWITCH_TIMEOUT);
	
	},
	resetPlayer: function(){

		this.player = new Q.Person({sheet: PLAYER_SHEET}, true, this);

	},
	itemFound: function(no){
	
		var items = this.playerState.items;
	
		// Increase quantity in hold by one
		if (typeof items[no] == "number"){ 
			
			items[no]++; // If player already holds one, just increase
			
		} else {
		
			items[no] = 1; // Else set to one
			
		}
	
	},
	
	getUIHandler: function(){
	
		return this.UIHandler;
	
	},
	getAudioHandler: function(){
	
		return this.audioHandler;
	
	},
	getMap: function(mapName){
	
		return this.maps[mapName];
	
	},
	getActiveMap: function(){
	
		return this.maps[this.activeMapName];
	
	},
	getActionSprites: function(){

		// All the sprites the player can interact with
		return Q("Person", MAIN_LEVEL).items.concat(Q("Item", MAIN_LEVEL).items).concat(Q("Invisible", MAIN_LEVEL).items);

	},
	getPlayer: function(){
	
		return this.player;
	
	},
	getSavegame: function(){
	
		return this.savegame;
	
	},
	
	filterPersons: function(property, value){
	
		return Q("Person", MAIN_LEVEL).items.filter(function(person){
		
			return person.p.hasOwnProperty(property) && person.p[property] === value;
		
		});
	
	},

	setGlobalFreeze: function(value){
	
		var persons = Q("Person", MAIN_LEVEL).items,
			i = 0,
			l = persons.length;
		
		for ( ; i < l; i++ ){
		
			persons[i].setFreeze(value);
		
		}
	
	},

	addMap: function(mapData){
	
		if (!mapData.mapName) throw "No map name provided!";
	
		this.maps[mapData.mapName] = new Q.Map(mapData, this);
	
	}

});