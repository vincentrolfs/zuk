// Create class Person
Q.Sprite.extend("Person", {

	init: function(p, isPlayer) {
	
		this._super(p, {
		
			x: 8, // Starting position
			y: 0,
			sheet: "dp_persons_sheet", // Tilesheet used
			sprite: "dp_persons_anim", // Animations used
			
			points: [  [ -8, 0 ], [  8, 0 ], [  8,  16 ], [ -8,  16 ] ],
			
			direction: "down", // Starting direction
			
			personNumber: 1, // Which person?
			
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
				
				if ( !p.go_array.length ){
				
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

// Create class Item
Q.Sprite.extend("Item", {

	init: function(p, id_on_map) {
	
		this._super(p, {
		
			x: 8,
			y: 8,
			sheet: "main_sheet",
			frame: 334,
			no: 1, // What item is it? Pokeball etc
			id_on_map: 0, // Identifies item on the map to be able to delete it
			interact: function(){
				
				var p = this.p,
					no = this.p.no;
			
				displayText(["Player found " + $itemNames[no] + "!"]);
				
				Q.audio.play("item_found.mp3");
				
				// Increase quantity in hold by one
				if (typeof $state.items[no] == "number") $state.items[no]++; // If player already holds one, just increase
				else $state.items[no] = 1; // Else set to one
				
				// So that item doesn't reappear!
				$maps[ p.mapName ].items.splice( p.id_on_map, 1 );
				
				this.destroy();
				
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