Q.Class.extend("Map", {
	
	init: function(settings, game){
	
		this.game = game;
		
		// Map settings provided when called
		// This here should adhere documentation
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
			
			loadAssetsOf: []
			
		}, settings);
		
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
			s = this.settings,
			p = this.p;
	
		// Create scene with proper name
		Q.scene(s.mapName, function(stage) {
		
			// stage contains the actual visible stuff, thus you can do stage.insert
		
			p.visited = true;
		
			var currentAct = p.act,
				player = game.getPlayer(),
				savegame = game.getSavegame(),
				comingFrom,
				oldDirection,
				loadX,
				loadY,
				direction,
				isDoor;
		
			// ----- Start player config
		
			if (player){
		
				comingFrom = player.getMap();
				oldDirection = player.getDirection();
				
				// If the location where player comes from doesn't have it's own loading point
				if (typeof s.loadingPoints[comingFrom] == "undefined"){
				
					// Use default loading point
					comingFrom = "default";
				
				}
			
			} else { // Player does not exist yet => Game has just started
		
				isDoor = false;
		
				if (savegame){ // New game with savegame => load data
		
					loadX = savegame.player.x;
					loadY = savegame.player.y;
				
					direction = savegame.player.direction;
			
				} else { // No savegame... just use default stuff
			
					comingFrom = "default";
			
				}
			
			}
		
			if (typeof loadX == "undefined") 		loadX = s.loadingPoints[comingFrom][0];
			if (typeof loadY == "undefined") 		loadY = s.loadingPoints[comingFrom][1];
	
			if (typeof direction == "undefined") 	direction = s.loadingPoints[comingFrom][2] || oldDirection || "down";
			if (typeof isDoor == "undefined") 		isDoor = s.loadingPoints[comingFrom][3];
		
			// Make changes to the player instance
			var playerConfig = {
		
				hasMoved: false,
		
				x: loadX,
				y: loadY,
			
				startingX: loadX,
				startingY: loadY,
			
				direction: 	direction,
			
				mapName: s.mapName
		
			};
		
			game.resetPlayer();
			player = game.getPlayer();
			
			player.set(playerConfig);

			if (isDoor) player.go(direction);
		
			// ----- End player config
		
			// ----- Start organising act function
		
			function organiseAct(){
		
				if (s.acts[currentAct] && (typeof s.acts[currentAct].organise === "function")){
				
					s.acts[currentAct].organise();
				
				}
			
			}
		
			// ----- End organising act function
		
			// ----- Start map creation
		
			Q.load(p.assets, function(){
		
				// Blackmap if no tmx file is provided!
				if (!s.fileName){
			
					Q.stageScene(SCENE_BLACKMAP, MAIN_LEVEL);
			
					organiseAct();
			
				} else {
		
					// Display tmx map
					Q.stageTMX(s.fileName, stage);
			
					stage.insert(player);
			
					// Camera follows player
					stage.add("viewport").follow(player);
			
					// ----- Start items inserting
			
					var i = 0,
						items = p.items,
						l = items.length;
					
					for ( ; i < l; i++ ){
				
						// Wenn erstens das Item nicht mit dem Spieler crasht, und zweitens das Item noch nicht gefunden wurde, tus rauf
						if ( (items[i].x != player.p.x || items[i].y != player.p.y) && (!items[i].hasOwnProperty("found") || items[i].found == false))
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
				
					var i,
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
				
					organiseAct();
			
				}
		
				// ----- End map creation
		
				// Put on music
				game.getAudioHandler().setSong( s.music );
		
				// ----- Start loading of nearby maps' asses
				//  => Go through reachable maps and load their assets!
			
				var reachables = s.switchPoints.concat( s.loadAssetsOf ), // loadAssetsOf is just strings!
					i = 0,
					l = reachables.length,
					loadArray = [],
					mapName;
		
				// Go through reachable maps...
				for ( ; i < l; i++){
			
					mapName = reachables[i];
			
					// switchPoints are arrays which store mapName in position 2
					// but reachables might also contain plain strings, so we have to differentiate
					if (typeof mapName !== "string") mapName = mapName[2];
			
					// If map has not been visited yet
					if ( !p.visited ){
			
						// Preload it's assets
						loadArray = loadArray.concat( p.assets );
				
					}
			
				}
		
				Q.load(loadArray);
		
				// ----- End loading of nearby maps' data
		
			});
	
		}, { // Options for scene
		
			// Sort things on stage (persons etc) by y-values (height)
			sort: function(a,b) { return ((a.p && a.p.y) || -1) - ((b.p && b.p.y) || -1) }
		
		});
	
	}
	
});