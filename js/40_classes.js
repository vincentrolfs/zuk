// Class Map
Q.Class.extend("Map", {
	
	init: function(settings){
		
		// Map settings provided when called
		var s = this.settings = Q._extend({
			
			mapName: "",
			fileName: "", 							//--opt (blackmap if not provided)
			
			loadingPoints:  { default: [0, 0] },	//--opt if blackmap
			switchPoints: [],						//--opt
			
			items: [], 								//--opt
			invisibles: [], 						//--opt
			persons: [], 							//--opt
			music: "",								//--opt
			
			firstAct: "",							//--opt
			acts: [], 								//--opt, can be hash
			
			loadAssetsOf: []						//--opt [for which maps this one should also preload]
		
		}, settings);
		
		// Map properties
		// Accesible by others
		var p = this.p = {
			
			items: s.items, // All items the map can have, format {x: int, y: int, found: bool, no: int}
			itemInstances: [], // The actual instances of the items on the map. May contain destroyed (found) items
			invisibles: [], // The invisibles that are currently on this map (during this act)
			persons: [],	// The persons that are currently on this map (during this act)
			act: s.firstAct,
			
			assets: [], // So that other maps know what files this one uses & can load them beforehand
			visited: false
			
		};
	
		// p.assets: the stuff nearby maps load for this map
		if (s.music) 	p.assets.push( s.music );
		if (s.fileName) p.assets.push( s.fileName );
		
		// Create scene with proper name
		Q.scene(s.mapName, function(stage) {
			
			// stage contains the actual visible stuff, thus you can do stage.insert
			
			$activeMap = s.mapName;
			
			p.visited = true;
			
			var currentAct = p.act,
				comingFrom,
				oldDirection,
				loadX,
				loadY,
				direction,
				isDoor;
			
			// ----- Start player config
			
			if ($player){
			
				comingFrom = $player.getMap();
				oldDirection = $player.getDirection();
					
				// If the location where player comes from doesn't have it's own loading point
				if (typeof s.loadingPoints[comingFrom] == "undefined"){
					
					// Use default loading point
					comingFrom = "default";
					
				}
				
			} else { // Player does not exist yet => Game has just started
			
				isDoor = false;
			
				if ($savegame){ // New game with savegame => load data
			
					loadX = $savegame.player.x;
					loadY = $savegame.player.y;
					
					direction = $savegame.player.direction;
				
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
			
			resetPlayer();
			$player.set(playerConfig);

			if (isDoor) $player.go(direction);
			
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
				
					stage.insert($player);
				
					// Camera follows player
					stage.add("viewport").follow($player);
				
					// ----- Start items inserting
					
					p.itemInstances = [];
				
					var i = 0,
						items = p.items,
						l = items.length;
						
					for ( ; i < l; i++ ){
					
						// Wenn erstens das Item nicht mit dem Spieler crasht, und zweitens das Item noch nicht gefunden wurde, tus rauf
						if ( (items[i].x != $player.p.x || items[i].y != $player.p.y) && (!items[i].hasOwnProperty("found") || items[i].found == false))
							p.itemInstances.push( stage.insert(new Q.Item( items[i], i ) ) );
					
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
					
					var l = persons.length;
					
					// Go through persons, display them and put their instances in properties
					for (var i = 0; i < l; i++ ){
					
						// Tue Person nur auf die Map, wenn sie nicht mit Spieler crasht
						if (persons[i].x != $player.p.x || persons[i].y != $player.p.y)
							p.persons.push( stage.insert( new Q.Person( persons[i], false ) ) );
					
					}
					
					l = invisibles.length;
					
					// Go through invisibles, display them and put their instances in properties
					for (var i = 0; i < l; i++ ){
					
						p.invisibles.push( stage.insert( new Q.Invisible( invisibles[i] ) ) );
					
					}
				
					// ----- End persons, invisibles inserting
					
					organiseAct();
				
				}
			
				// ----- End map creation
			
				// Put on music
				handleMusic( s.music );
			
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

// Class Person
Q.Sprite.extend("Person", {

	init: function(p, isPlayer) {
	
		this._super(p, { // default options
		
			collisionMask: ~Q.SPRITE_PARTICLE, // Hit everything except for particles (=invisibles)
			x: 8, // Starting position
			y: 0,
			sheet: "max", // Tilesheet used
			sprite: "person_animations", // Animations used
			
			points: [  [ -8, 0 ], [  8, 0 ], [  8,  16 ], [ -8,  16 ] ],
			
			direction: "down", // Starting direction
			
			walk: false, // Random walking
			walkRadius: 16,
			timeSinceWalk: 0,
			
			go_array: [],
			
			userControlledStepping: false,
			
			stepDistance: 16, // One step is 16 pixels
			stepDelay: 0.25,
			
			freeze: false,
			marked: false,
			interact: function(){}
		
		});
		
		this.add("2d, animation, smartControls");
		
		if (isPlayer){
		
			this.add("playerFunctions");
		
		}
		
		this.p.startingX = this.p.x;
		this.p.startingY = this.p.y;
		
	},
	
	togglemark: function(){
	
		var p = this.p;
	
		p.marked = !p.marked;
		
		if (p.marked){
		
			p.old_sheet = p.sheet;
			p.sheet = MARKER_SHEET;
		
		} else {
		
			p.sheet = p.old_sheet;
		
		}
	
	},
		
	step: function(dt){
		
		var p = this.p;
		
		// Enables dynamic on/off switching of walking
		if (p.walk && !p.freeze){
		
			var p = this.p;
		
			p.timeSinceWalk += dt;
			
			var dirs = [];
			
			if (p.y - 16 >= p.startingY - p.walkRadius) dirs.push("up");
			if (p.y + 16 <= p.startingY + p.walkRadius) dirs.push("down");
			
			if (p.x - 16 >= p.startingX - p.walkRadius) dirs.push("left");
			if (p.x + 16 <= p.startingX + p.walkRadius) dirs.push("right");
			
			if ( p.timeSinceWalk >= 0.7 && Math.random() > 0.995 ){
				
				p.timeSinceWalk = 0;
			
				var direction_no = Math.round( Math.random()*(dirs.length-1) ); // Number between 0 and length of dirs-1
				
				p.go_array.push( dirs[direction_no] );
			
			}
		
		}
	
	},
	
	setFreeze: function(val){
		
		this.p.freeze = !!val;
		
	},
	
	go: function(orders, callback){
		
		var p = this.p;
	
		if (typeof orders == "string"){ p.go_array.push(orders); }
	
		else { p.go_array = p.go_array.concat(orders); }
		
		if (typeof callback == "function"){
			
			var _super = this;
			
			this.on("step", function(){
				
				if ( p.go_array.length === 0 ){
				
					callback();
					_super.off("step", this);
					
				}
				
			});	
			
		}
	
	},
	
	getMap: function(){
		
		return this.p.mapName;	
		
	},
	
	getDirection: function(){
		
		return this.p.direction;	
		
	},
	
	setControl: function(val){
		
		this.p.userControlledStepping = !!val;
		
	}

});

// Class Item
Q.Sprite.extend("Item", {

	init: function(p, id_on_map) {
	
		this._super(p, {
		
			x: 8,
			y: 8,
			points: [  [ -8, 0 ], [  8, 0 ], [  8,  16 ], [ -8,  16 ] ],
			asset: IMAGEFILE_ITEM,
			no: 1, // What item is it?
			interact:  void 0,
			found: false,
			marked: false,
			id_on_map: 0, // Identifies item on the map to be able to delete it
	
		});
		
		var extraInteract;
		if (typeof this.p.interact == "function") extraInteract = this.p.interact;
		
		this.p.interact = function(callback){
				
			var item = this,
				no = item.p.no;
				
			playSound(SOUNDFILE_ITEM);
		
			displayText([$itemNames[no] + " gefunden!"], function(){
				
				item.silentFind();
				
				if (typeof extraInteract == "function") extraInteract(callback);
				else if (typeof callback == "function") callback();
					
			});
			
		}
		
		this.p.found = false;
		this.p.id_on_map = id_on_map;
		
		this.add("2d");
		this.on("hit", this, "collision");
		this.on("inserted", this, "inserted");
		
	},
	
	togglemark: function(){
	
		var p = this.p;
	
		p.marked = !p.marked;
		
		if (p.marked){
		
			p.old_asset = p.asset;
			p.asset = IMAGEFILE_ASSET_MARKER;
		
		} else {
		
			p.asset = p.old_asset;
		
		}
	
	},
	
	silentFind: function(){
	
		var item = this,
			p = item.p,
			no = p.no;
			
		// Increase quantity in hold by one
		if (typeof $state.items[no] == "number"){ 
			
			$state.items[no]++; // If player already holds one, just increase
			
		} else $state.items[no] = 1; // Else set to one
		
		// So that item doesn't reappear!
		$maps[ p.mapName ].p.items[p.id_on_map].found = true; // Modify item representation in "map.items"
		p.found = true; // Modify actual item object
		
		item.destroy();
	
	},
	
	inserted: function(info){
		
		// Save map name in p
		this.p.mapName = info.scene.name;
		
	},
	
	step: function(dt){
		
		var p = this.p;
		
		// Save position in case of collision
		p.origX = p.x;
		p.origY = p.y;
	
	},
	
	collision: function(col) {

		var p = this.p;
		
		// Reset position; make sprite effectively immoveable
		p.x = p.origX;
		p.y = p.origY;

	}
	
});

// Class Invisible
Q.Sprite.extend("Invisible", {

	init: function(p) {
	
		this._super(p, {
		
			collisionMask: Q.SPRITE_NONE,
			type: Q.SPRITE_PARTICLE,
			h: 16,
			w: 16,
			cx: 16,
			cy: 16,
			x: 8,
			y: 8,
			interact: function(callback){}
	
		});
		
	},
	
	togglemark: function(){
	
		var p = this.p;
	
		p.marked = !p.marked;
		
		if (p.marked){
		
			p.old_asset = p.asset;
			p.asset = IMAGEFILE_ASSET_MARKER;
		
		} else {
		
			p.asset = p.old_asset;
		
		}
	
	},
	
});
