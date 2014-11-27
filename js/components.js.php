// Had to change the component "stepControls" to disallow going up+right at the same time
// also making methods to go into directions avaible
Q.component("smartControls", {
	 
	added: function() {
	  
		var p = this.entity.p;

		if (!p.stepDistance) { p.stepDistance = 32; }
		if (!p.stepDelay) { p.stepDelay = 0.2; }
		if (!p.direction) { p.direction = "down"; }
	
		p.stepWait = 0;
		
		p.origX = p.x;
		p.origY = p.y;
		
		this.entity.on("step", this, "step");
		this.entity.on("hit", this, "collision");
	
	},

	collision: function(col) {

		var p = this.entity.p;

		if (p.stepping) {
		
			p.stepping = false;
			
		}
		
		p.x = p.origX;
		p.y = p.origY;

	},

	step: function(dt) {
		
		var p = this.entity.p;
		
		p.stepWait -= dt;

		if (p.stepping) { // Move the player 
		
			p.x += p.diffX * dt / p.stepDelay;
			p.y += p.diffY * dt / p.stepDelay;
		
		} else if (p.freeze){ // If player is not currently stepping and is set on freeze, stop him
		
			this.entity.play("stand_" + p.direction + p.personNumber);
			return;
		
		}

		if (p.stepWait > 0) { return; }
		
		if (p.stepping) {
		
			p.x = p.destX;
			p.y = p.destY;
		
		}
		
		p.stepping = false;
		
		p.origX = p.x;
		p.origY = p.y;

		p.diffX = 0;
		p.diffY = 0;
		
		if (p.userControlledStepping && Q.inputs['left'] || p.go_array[0] == 'left') {
		
			p.diffX = -p.stepDistance;
			p.direction = "left";
			if (p.go_array.length) p.go_array.splice(0, 1);
		
		} else if (p.userControlledStepping && Q.inputs['right'] || p.go_array[0] == 'right') {
		
			p.diffX = p.stepDistance;
			p.direction = "right";
			if (p.go_array.length) p.go_array.splice(0, 1);
		
		} else if (p.userControlledStepping && Q.inputs['up'] || p.go_array[0] == 'up') {
		
			p.diffY = -p.stepDistance;
			p.direction = "up";
			if (p.go_array.length) p.go_array.splice(0, 1);
		
		} else if (p.userControlledStepping && Q.inputs['down'] || p.go_array[0] == 'down') {
		
			p.diffY = p.stepDistance;
			p.direction = "down";
			if (p.go_array.length) p.go_array.splice(0, 1);
		
		}

		if (p.diffY || p.diffX ) {
		
			p.stepping = true;
			p.destX = p.x + p.diffX;
			p.destY = p.y + p.diffY;
			p.stepWait = p.stepDelay;
			
			// If person is walking player proper animation
			// Add personNumber at the end
			this.entity.play("walk_" + p.direction + p.personNumber);
		
		} else { // Person is currently standing
		
			this.entity.play("stand_" + p.direction + p.personNumber);
		
		}

	}

});

Q.component("playerFunctions", {
	 
	// Initialize some stuff
	added: function() {
	  
		var p = this.entity.p;

		// Activity user controls (see step function of smartControls)
		p.userControlledStepping = true;
		
		p.personNumber = 102;
		
		// Points where to switch maps
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
		if (!p.switchPoints) { p.switchPoints = []; }
		
		if (!p.mapName) { p.mapName = ""; } // Map on which the player is on
		if (!p.hasMoved) { p.hasMoved = false; } // Has the player moved since arrival/map loading
	
		// check switch points everytime player moves
		this.entity.on("step", this, "checkSwitchPoints");
		
		// Make bump sound!
		
		p.serious_bumps = 0; // Bumps against Persons/Items play 3 times but shouldn't. Let's prevent it by counting!
		
		this.entity.on("hit", this, "bumpSound");
		
		// check action (talking, items) everytime player presses action key
		Q.input.on("action", this, "checkAction");
		
		/*Q.input.on("up", this, "checkSwitchPointsDoors");
		Q.input.on("down", this, "checkSwitchPointsDoors");
		Q.input.on("left", this, "checkSwitchPointsDoors");
		Q.input.on("right", this, "checkSwitchPointsDoors");*/

	},
	
	bumpSound: function(collision){
		
		var obj = collision.obj;
		
		// Bumps against Persons/Items play 3 times but shouldn't. Let's prevent it by counting!
		if (obj.isA("Item") || obj.isA("Person")){
			
			var p = this.entity.p;
			
			p.serious_bumps++; // Counts hits on Persons/Items because 
			
			if (p.serious_bumps >= 3){
			
				p.serious_bumps = 0;
				// The third hit should create a sound, thus no return statement!
				
			} else {
			
				return; // End function execution and don't play sound!	
				
			}
		
		}
		
		Q.audio.play("bump.mp3");
		
	},
	
	// Check if player is tryna talk to somebody
	checkAction: function(){
		
		var p = this.entity.p;
		
		// Only check action if player is allowed to move + is standing still
		if (p.freeze || p.stepping) return;
		
		// key: 	direction in which player is looking
		// value: 	x coordinates of that point (converted so size of sprite doesn't matter)
		// 			y coords (converted)
		// 			inverted direction
		var places = { 
		
				"up": 		[p.x + p.cx, 		p.y + p.cy - 16, 	"down"	],
				"down": 	[p.x + p.cx, 		p.y + p.cy + 16, 	"up"	],
				"left": 	[p.x + p.cx - 16, 	p.y + p.cy, 		"right"	],
				"right": 	[p.x + p.cx + 16, 	p.y + p.cy,			"left"	]
		
			},
			spot = places[p.direction], // The actual spot the player is looking at
			actionSprites = Q("Person", 1).items.concat( Q("Item", 1).items ), // All the sprites the player can interact with (persons+items)
			i = 0,
			l = actionSprites.length,
			sprite;
			
		for ( ; i < l; i++){ // Loop through actionSprites
			
			sprite = actionSprites[i];
		
			if ( (sprite.p.x + sprite.p.cx) == spot[0] && (sprite.p.y + sprite.p.cy) == spot[1]){ // If the sprite is on the spot the player is looking at
				
				if (!$ui_busy){
					
					if (sprite.p.direction){
						
						// Change direction of sprite if it has one
						sprite.p.direction = spot[2];
						
					}
						
					// Interact with sprite; call the interact function so that "this" symbolizes the sprite
					sprite.p.interact.call(sprite, {ensure: sprite.render});
					
				}
			
			}
		
		}
	
	},
	
	/*checkSwitchPointsDoors: function(info){
		
		var p = this.entity.p,
			places = { 
	
				"up": 		[p.x, 		p.y - 16],
				"down": 	[p.x, 		p.y + 16],
				"left": 	[p.x - 16, 	p.y],
				"right": 	[p.x + 16, 	p.y]
	
			},
			possible_dir,
			dir;
		
		// Find out in what direction the player is going
		for (possible_dir in places){
			
			if (Q.inputs[possible_dir]){
				
				dir = possible_dir;
				break;
				
			}
			
		}
		
		// When player is moving steadily, event is fired in between => correct the numbers
		var destX = Math.round( ( p.x - 8  )/16 ) * 16 + 8,
			destY = Math.round( ( p.y - 16 )/16 ) * 16;
		
		var i = 0,
			l = p.switchPoints.length;
			
		for ( i = 0; i < l; i++){
			
			if ( !p.switchPoints[i][3] ) continue; // If type is undefined or zero, it's not a switch point for a door!
			
			if (destX == p.switchPoints[i][0] && destY == p.switchPoints[i][1]){
				
				//mapSwitch(p.switchPoints[i][2]);
			
				
				
			}
			
		}
		
	},*/
	
	checkSwitchPoints: function(){
	
		var p = this.entity.p;
	
		if (p.stepping) return; // abort if player is moving
		
		// Check if player has moved since he arrived on the map
		if (
		
			(!p.hasMoved) // Peform check only if he hasMoved isn't already true 
			
			&&
			
			(
				// If player is on another location than he was when he came...
				(p.startingX != p.x) || (p.startingY != p.y)
			)
		
		){
		
			// ...we can say that he must have moved
			p.hasMoved = true;
		
		}
		
		// If the player hasnt moved yet, return
		if (!p.hasMoved) return;
		
		var i = 0,
			l = p.switchPoints.length;
			
		// Go through switchPoints, check if player is on one
		for ( i = 0; i < l; i++){
			
			// If player is on the switch point
			if (p.x == p.switchPoints[i][0] && p.y == p.switchPoints[i][1]){
				
				mapSwitch(p.switchPoints[i][2], p.switchPoints[i][3]);
				
				// Stop searching!
				break;
				
			}
		
		}
		
	}
	
});