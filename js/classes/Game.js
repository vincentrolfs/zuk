Q.Class.extend("Game", {

	init: function(){
	
		// Provides better Math.random
		Math.seedrandom();
		
		this.audioHandler = new Q.AudioHandler();
		this.UIHandler = new Q.UIHandler(this, this.audioHandler);
		this.loadingHandler = new Q.LoadingHandler(this.UIHandler);
		
		this.UIHandler.registerLoadingHandler(this.loadingHandler);
		
		this.player = null; // Variable holds instance of Person class that has player functions
		this.playerState = {
	
			items: {}

		};
		this.savegame = null;
		this.startingMap = null;
		this.activeMapName = "";
		this.maps = {};
	
	},
	
	start: function(){
	
		console.log("Starting game from inside...");
	
		var game = this;
		
		this.UIHandler.loadAssets(function(){
		
			game.loadingHandler.load([MAIN_TILESET, INTERIOR_TILESET, IMAGEFILE_ITEM, IMAGEFILE_PERSON_MARKER, IMAGEFILE_ASSET_MARKER, "persons/max.png", "persons/jersey.png", "persons/robert.png", "persons/claire.png", "persons/bob.png", "persons/chris.png", "persons/police.png", SOUNDFILE_BUMP, SOUNDFILE_ITEM], function() {
	
				console.log("Loaded most important assets succesfully.");
	
				game.createImageDefinitions();
				game.loadSavegame();
	
				Q.stageScene(game.startingMap, MAIN_LEVEL);
				game.activeMapName = game.startingMap;

			}, "Lade Spieldaten: " + PERCENTAGE_PLACEHOLDER + "%...");
		
		});
	
	},

	loadSavegame: function(){
	
		console.log("Trying to load savegame...");
	
		var saveCookie = docCookies.getItem(SAVEGAME_COOKIENAME),
			savegame,
			error = false;
		
		try {
		
			savegame = JSON.parse(saveCookie);
	
		} catch(e){
	
			error = true;
	
		}
	
		if (error || !savegame || location.search === "?new"){
	
			this.startingMap = DEFAULT_MAP;
			console.log("Could not load savegame. Error: ", error, ". Savegame: ", savegame);
	
		} else {
	
			this.savegame = savegame;
			this.startingMap = savegame.player.map;
		
			// Load map data
		
			var savedMaps = savegame.maps;
		
			for (var mapName in savedMaps){
		
				if (savedMaps.hasOwnProperty(mapName) && this.maps.hasOwnProperty(mapName)){
		
					this.maps[mapName].p.act = savedMaps[mapName].act;
					this.loadItems(mapName);
			
				}
		
			}
		
			this.playerState = savegame.playerState;
		
			console.log("Loaded savegame successfully: ", savegame);
	
		}

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
			
				};
		
			}
	
		}
	
		saveObject.maps = mapData;
	
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
	getAudioHandler: function(){
	
		return this.audioHandler;
	
	},
	getUIHandler: function(){
	
		return this.UIHandler;
	
	},
	getLoadingHandler: function(){
	
		return this.loadingHandler;
	
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
	
	},
	
	createImageDefinitions: function(){

		Q.animations("person_animations", {
		
			stand_up: { 	frames: [0], loop: false },
			stand_down: { 	frames: [5], loop: false },
			stand_right: { frames: [1], loop: false },
			stand_left: { 	frames: [6], loop: false },
		
			walk_up: { frames: [2, 0, 10], rate: 1/5 },
			walk_down: { frames: [11, 5, 8], rate: 1/5 },
			walk_right: { frames: [7, 1, 4], rate: 1/5 },
			walk_left: { frames: [3, 6, 9], rate: 1/5 },
	

		});

		Q.sheet(MARKER_SHEET,
				IMAGEFILE_PERSON_MARKER,
				{
					tilew: 32,
					tileh: 32,
					spacingX: 16
				}
		);

		Q.sheet("max",
				"persons/max.png",
				{
					tilew: 32,
					tileh: 32,
					spacingX: 16
				}
		);

		Q.sheet("jersey",
				"persons/jersey.png",
				{
					tilew: 32,
					tileh: 32,
					spacingX: 16
				}
		);

		Q.sheet("claire",
				"persons/claire.png",
				{
					tilew: 32,
					tileh: 32,
					spacingX: 16
				}
		);
		
		Q.sheet("bob",
				"persons/bob.png",
				{
					tilew: 32,
					tileh: 32,
					spacingX: 16
				}
		);

		Q.sheet("robert",
				"persons/robert.png",
				{
					tilew: 32,
					tileh: 32,
					spacingX: 16
				}
		);
		
		Q.sheet("chris",
				"persons/chris.png",
				{
					tilew: 32,
					tileh: 32,
					spacingX: 16
				}
		);
		
		Q.sheet("police",
				"persons/police.png",
				{
					tilew: 32,
					tileh: 32,
					spacingX: 16
				}
		);

	}

});