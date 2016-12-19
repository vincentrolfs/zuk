Q.Class.extend("Map", {
	
	init: function(settings, game){
	
		this.game = game;
		
		// Map settings provided when called
		var s = this.settings = Q._extend({
			
			mapName: "",
			fileName: "",
			
			loadingPoints:  { default: [0, 0] },
			switchPoints: [],
			
			items: [], 
			invisibles: [], 
			persons: [],
			music: "",
			
			firstAct: "",
			acts: [],
			
			initialFlags: [],
			
			loadAssetsOf: []
			
		}, settings);
		
		this.flags = s.initialFlags;
		
		// Map properties
		// Accesible by others
		var p = this.p = {
			
			items: s.items, // All items the map can have, format {x: int, y: int, found: bool, no: int}
			act: s.firstAct,
			
			assets: [], // So that other maps know what files this one uses & can load them beforehand
			visited: false
			
		};
	
		// p.assets: the stuff nearby maps load for this map
		if (s.music) 	p.assets.push( s.music );
		if (s.fileName) p.assets.push( s.fileName );
		
		this.createScene();
			
	},
	
	createScene: function(){
	
		var game = this.game,
			map = this,
			s = this.settings,
			p = this.p;
	
		// Create scene with proper name
		Q.scene(s.mapName, function(stage) {
		
			var currentAct = p.act,
				player = map.configuratePlayer();
				
			p.visited = true;
		
			// ----- Start map creation
		
			game.getLoadingHandler().load(p.assets, function(){
			
				var i, l;
		
				// Blackmap if no tmx file is provided!
				if (!s.fileName){
			
					Q.stageScene(SCENE_BLACKMAP, MAIN_LEVEL);
			
					map.organiseCurrentAct();
			
				} else {
		
					// Display tmx map
					Q.stageTMX(s.fileName, stage);
			
					stage.insert(player);
			
					// Camera follows player
					stage.add("viewport").follow(player);
			
					// ----- Start items inserting
			
					var items = p.items;
					
					l = items.length;
					
					for ( i = 0; i < l; i++ ){
				
						// Wenn erstens das Item nicht mit dem Spieler crasht, und zweitens das Item noch nicht gefunden wurde, tus rauf
						if ( (items[i].x != player.p.x || items[i].y != player.p.y) && (!items[i].hasOwnProperty("found") || items[i].found === false))
							stage.insert( new Q.Item( items[i], i, game ) );
				
					}
			
					// ----- End items inserting
			
					// ----- Start persons, invisibles inserting
				
					var persons = s.persons || []; // Persons that appear no matter what act it is
					var invisibles = s.invisibles || [];
			
					// If current act exists and provides special persons
					if (s.acts[currentAct]){
				
						// Add persons of this act to the array
						if (s.acts[currentAct].persons) persons = persons.concat( s.acts[currentAct].persons );
					
						if (s.acts[currentAct].invisibles) invisibles = invisibles.concat( s.acts[currentAct].invisibles );
				
					}
				
					l = persons.length;
				
					// Go through persons, display them and put their instances in properties
					for (i = 0; i < l; i++ ){
				
						// Tue Person nur auf die Map, wenn sie nicht mit Spieler crasht
						if (persons[i].x != player.p.x || persons[i].y != player.p.y)
							stage.insert( new Q.Person( persons[i], false, game ) );
				
					}
					
					l = invisibles.length;
				
					// Go through invisibles, display them and put their instances in properties
					for (i = 0; i < l; i++ ){
				
						stage.insert( new Q.Invisible( invisibles[i] ) );
				
					}
			
					// ----- End persons, invisibles inserting
				
					map.organiseCurrentAct();
			
				}
		
				// ----- End map creation
		
				// Put on music
				game.getAudioHandler().setSong( s.music );
		
				// ----- Start loading of nearby maps' asses
				//  => Go through reachable maps and load their assets!
			
				var reachables = s.switchPoints.concat( s.loadAssetsOf ), // loadAssetsOf is just strings!
					loadArray = [],
					mapName,
					reachableMap;
										
				l = reachables.length;
		
				// Go through reachable maps...
				for ( i = 0; i < l; i++ ){
			
					mapName = reachables[i];
			
					// switchPoints are arrays which store mapName in position 2
					// but reachables might also contain plain strings, so we have to differentiate
					if (typeof mapName !== "string") mapName = mapName[2];
			
					reachableMap = game.getMap(mapName);
			
					// If map has not been visited yet
					if ( !reachableMap.p.visited ){
			
						// Preload it's assets
						loadArray = loadArray.concat( reachableMap.p.assets );
				
					}
			
				}
				
				game.getLoadingHandler().load(loadArray, null, "");
		
				// ----- End loading of nearby maps' data
		
			}, "Lade Map...");
	
		}, { // Options for scene
		
			// Sort things on stage (persons etc) by y-values (height)
			sort: function(a,b) { return ((a.p && a.p.y) || -1) - ((b.p && b.p.y) || -1); }
		
		});
	
	},
	
	configuratePlayer: function(){
	
		var player = this.game.getPlayer(),
			settings = this.settings,
			savegame = this.game.getSavegame(),
			comingFrom,
			oldDirection,
			direction,
			loadingPointIsDoor,
			loadX, loadY;
	
		if (player){
	
			comingFrom = player.getMap();
			oldDirection = player.getDirection();
			
			// If the location where player comes from doesn't have it's own loading point
			if (typeof settings.loadingPoints[comingFrom] === "undefined"){
			
				// Use default loading point
				comingFrom = "default";
			
			}
		
		} else { // Player does not exist yet => Game has just started
	
			loadingPointIsDoor = false;
	
			if (savegame){ // New game with savegame => load data
	
				loadX = savegame.player.x;
				loadY = savegame.player.y;
			
				direction = savegame.player.direction;
		
			} else { // No savegame... just use default stuff
		
				comingFrom = "default";
		
			}
		
		}
	
		if (typeof loadX == "undefined")				loadX = settings.loadingPoints[comingFrom][0];
		if (typeof loadY == "undefined")				loadY = settings.loadingPoints[comingFrom][1];

		if (typeof direction == "undefined")			direction = settings.loadingPoints[comingFrom][2] || oldDirection || "down";
		if (typeof loadingPointIsDoor == "undefined")	loadingPointIsDoor = settings.loadingPoints[comingFrom][3];
	
		// Make changes to the player instance
		var playerConfig = {
	
			hasMoved: false,
	
			x: loadX,
			y: loadY,
		
			startingX: loadX,
			startingY: loadY,
		
			direction: 	direction,
		
			mapName: settings.mapName
	
		};
	
		this.game.resetPlayer();
		player = this.game.getPlayer();
		
		player.set(playerConfig);

		if (loadingPointIsDoor) player.go(direction);
		
		return player;
	
	},
	
	organiseCurrentAct: function(){
	
		var currentAct = this.p.act;
			settings = this.settings;

		if (settings.acts[currentAct] && (typeof settings.acts[currentAct].organise === "function")){
		
			settings.acts[currentAct].organise();
		
		}
	
	}
	
});