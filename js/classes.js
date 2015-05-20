// Class Map
Q.Class.extend("Map", {
	
	init: function(settings){
		
		// Map settings provided when called
		this.settings = Q._extend({
			
			mapName: "",
			fileName: "", 							//--opt (blackmap if not provided)
			
			loadingPoints:  { default: [0, 0] },	//--opt if blackmap
			switchPoints: [],						//--opt
			
			items: [], 								//--opt
			persons: [], 							//--opt
			music: "",								//--opt
			
			firstAct: 0,							//--opt
			acts: [], 								//--opt, can be hash
			
			loadAssetsOf: []						//--opt [for which maps this one should also preload]
		
		}, settings);
		
		var s = this.settings;
		
		// Map properties
		// Accesible by others
		this.p = {
			
			items: s.items, // The items that are still on this map
			persons: [],	// The persons that are on this map
			act: s.firstAct,
			
			assets: [], // So that other maps know what files this one uses & can load them beforehand
			visited: false
			
		};
		
		// Faster access
		var p = this.p;
	
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
				direction;
			
			// ----- Start player config
			
			if ($player){
			
				comingFrom = $player.getMap();
				oldDirection = $player.getDirection();
					
				// If the location where player comes from doesn't have it's own loading point
				if (typeof s.loadingPoints[comingFrom] == "undefined"){
					
					// Use default loading point
					comingFrom = "default";
					
				}
				
			} else { // No player there yet
			
				comingFrom = "default";	
				
			}
			
			loadX = s.loadingPoints[comingFrom][0];
			loadY = s.loadingPoints[comingFrom][1];
			
			direction = s.loadingPoints[comingFrom][2] || oldDirection || "down";
			
			// Make changes to the player instance
			var playerConfig = {
				
				hasMoved: false,
			
				x: loadX,
				y: loadY,
				
				startingX: loadX,
				startingY: loadY,
				
				direction: 	direction,
				
				mapName: s.mapName,
				
				switchPoints: s.switchPoints
				// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
			
			};
			
			if (!$player) $player = new Q.Person(playerConfig, true);
			
			else $player.set(playerConfig);
			
			// ----- End player config
			
			// ----- Start organising act
			
			function organiseAct(){
			
				if (s.acts[currentAct] && (typeof s.acts[currentAct].organise === "function")){
					
					s.acts[currentAct].organise();
					
				}
				
			}
			
			// ----- End organising act
			
			// ----- Start map creation
			
			// Blackmap if no tmx file is provided!
			if (!s.fileName){
				
				//Q.stageScene("blackmap", 1);
				
				organiseAct();
				
			} else {
			
				// Load tmx file
				Q.load(s.fileName, function(){
			
					// Display tmx map
					Q.stageTMX(s.fileName, stage);
					
					stage.insert($player);
					
					// Camera follows player
					stage.add("viewport").follow($player);
					
					// ----- Start items inserting
					
					var i = 0,
						items = p.items, // The items that are still on this map
						l = items.length;
						
					for ( ; i < l; i++ ){
						
						stage.insert(new Q.Item( items[i], i ) );
						
					}
					
					// ----- End items inserting
					
					// ----- Start persons inserting
					
					var persons = s.persons || []; // Persons that appear no matter what act it is
					
					// If current act exists and provides special persons
					if (s.acts[currentAct] && s.acts[currentAct].persons){
						
						// Add persons of this act to the array
						persons = persons.concat( s.acts[currentAct].persons );
						
					}
						
					var l = persons.length,
						i = 0;
						
					// Go through persons, display them and put their instances in propeties
					for ( ; i < l; i++ ){
						
						p.persons.push( stage.insert( new Q.Person( persons[i]) ) );
						
					}
					
					// ----- End persons inserting
					
					organiseAct();
					
				});
				
			}
			
			// ----- End map creation
			
			// Put on music
			handleMusic( s.music );
			
			// ----- Start loading of nearby maps' asses
			
			// Go through reachable maps and load their assets!
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
		
			x: 8, // Starting position
			y: 0,
			sheet: "person_sheet_old_man", // Tilesheet used
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
			interact: function(){}
		
		});
		
		this.add("2d, animation, smartControls");
		
		if (isPlayer){
		
			this.add("playerFunctions");
		
		}
		
		this.p.startingX = this.p.x;
		this.p.startingY = this.p.y;
		
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
			
			if ( p.timeSinceWalk >= 3 || (p.timeSinceWalk >= 0.7 && Math.random() > 0.999) ){
				
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
			asset: "item.png",
			no: 1, // What item is it? Pokeball etc
			id_on_map: 0, // Identifies item on the map to be able to delete it
			interact: function(){
				
				var item = this,
					p = this.p,
					no = this.p.no;
			
				displayText(["Player found " + $itemNames[no] + "!"], function(){
					
					// Increase quantity in hold by one
					if (typeof $state.items[no] == "number"){ 
						
							$state.items[no]++; // If player already holds one, just increase
						
					} else 	$state.items[no] = 1; // Else set to one
					
					// So that item doesn't reappear!
					$maps[ p.mapName ].p.items.splice( p.id_on_map, 1 );
					
					item.destroy();	
						
				});
				
				Q.audio.play("item_found.mp3");
				
			}
	
		});
		
		this.p.id_on_map = id_on_map;
		
		this.add("2d");
		
		this.on("hit", this, "collision");
		
		this.on("inserted", this, "inserted");
		
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