addMap({

	mapName: "town",
	fileName: "town.tmx",
	loadingPoints: {
	
		default: [232, 128, "right"],
		players_room: [88, 96, "down"]
		// Format: [x, y(, dir)]
	
	},
	switchPoints: [
	
		[88, 96, "players_room", true]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map, is_door]
	
	],
	music: "come-on-in-to-post-town.mp3",
	items: [],
	persons: [{
	
		x: 216, 
		y: 272,
		walk: true
	
	}],
	acts: [
	
		{
			
			persons: [
				
				{
				
					x: 248,
					y: 128,
					direction: "left",
					personNumber: 1,
					walk: false,
					interact: function(){
					
						$maps.town.act = "1";
						displayText(["Welcome!", "Dude!"]);
					
					}
				
				}
				
			]
			
		},
		
		{
		
			persons: [
					
				{
				
					x: 248,
					y: 128,
					direction: "left",
					personNumber: 7,
					walk: false,
					interact: function(){
					
						displayText(["Second!", "Dude, too!"]);
					
					}
				
				}
					
			]
			
		}
	
	]

});

addMap({

	mapName: "players_room",
	fileName: "interior.tmx",
	loadingPoints: {
	
		default: [56, 144, "down"],
		begin: [56, 144, "down"],
		town: [152, 32, "down"]
		// Format: [x, y(, dir)]
	
	},
	switchPoints: [
	
		[152, 32, "town", true]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map, is_door]
	
	],
	music: "come-on-in-to-post-town.mp3",
	items: [],
	acts: [
	
		{
			
			organise: function(){
				
				$maps.players_room.act = 1;
				
				displayText(["Oh no! I'm going to be late!"], function(){
					
					$player.setControl(false);
					
					$player.go(["right", "right", "right", "up", "up", "up", "up", "right", "right", "right", "up", "up", "up"], function(){
						
						$player.setControl(true);
						
					});
					
				});
				
			}
			
		}
	
	]

});

addMap({

	mapName: "begin",
	music: "good-night.mp3",
	preload: $maps["town"].assets,
	acts: [
	
		{
			
			organise: function(){
				
				displayText(["Zzz...", "Zzzzz...", "Zzz...", "Zzzzzzzzzzzzz!", "What time is it?", "...", "!!!"], function(){
					
					mapSwitch("players_room");
					
				});
				
			}
			
		}
	
	]

});


/*

addMap({

	mapName: "map1",
	fileName: "map1.tmx",
	defaultDirection: "up",
	loadingPoints: {
	
		default: [200, 368],
		map2: [184, 368],
		blue_cave_1: [104, 80]
		// Format: [x, y]
	
	},
	switchPoints: [
		
		[184, 368, "map2"],
		[104, 64, "blue_cave_1"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
		
	],
	music: "our-first-meeting.mp3",
	items: [
	
		{x: 184, y: 72, no: 1}
	
	],
	organiseEvents: function(stage){
	
		var person1 = stage.insert(new Q.Person({
		
			x: 296,
			y: 144,
			direction: "left",
			personNumber: 0,
			walk: true,
			interact: function(){
			
				displayText(["Hey man! How are you?", "This weather is beautiful!", "I'm awesome."]);
			
			}
		
		}));
		
		var person2 = stage.insert(new Q.Person({
		
			x: 264,
			y: 240,
			direction: "down",
			personNumber: 0,
			walk: false,
			interact: function(){
			
				displayText("Hallo Papa.");
			
			}
		
		}));
		
		var person3 = stage.insert(new Q.Person({
		
			x: 184,
			y: 320,
			direction: "down",
			personNumber: 0,
			walk: false,
			interact: function(){
			
				displayText(["Hey man! How are you?", "This weather is beautiful!", "I'm awesome."]);
			
			}
		
		}));
	
	}

});

addMap({

	mapName: "map2",
	fileName: "map2.tmx",
	defaultDirection: "right",
	loadingPoints: {
	
		default: [72, 112],
		map1: [72, 112]
		// Format: [x, y]
	
	},
	switchPoints: [
	
		[72, 112, "map1"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
	
	],
	music: "despair-light-arrangement.mp3",
	items: [
	
		{x: 24, y: 24, no: 1}
	
	],
	organiseEvents: function(stage){}

});	

addMap({

	mapName: "blue_cave_1",
	fileName: "blue_cave_1.tmx",
	defaultDirection: "up",
	loadingPoints: {
	
		default: [56, 256],
		map1: [56, 256],
		blue_cave_2: [72, 96]
		// Format: [x, y]
	
	},
	switchPoints: [
	
		[56, 272, "map1"],
		[72, 96, "blue_cave_2"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
	
	],
	music: "stompstump-peak.mp3"

});

addMap({

	mapName: "blue_cave_2",
	fileName: "blue_cave_2.tmx",
	defaultDirection: "down",
	loadingPoints: {
	
		default: [56, 32],
		blue_cave_1: [56, 32]
		// Format: [x, y]
	
	},
	switchPoints: [
	
		[56, 32, "blue_cave_1"],
		[184, 240, "map1"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
	
	],
	music: "stompstump-peak.mp3",
	items: [
	
		{ x: 360, y: 136, nr: 1 }
	
	]

}); */