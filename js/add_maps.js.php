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
	items: [{ x: 168, y: 88, no: 1 }],
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
	firstAct: "1",
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
	loadAssetsOf: "town",
	acts: [
	
		{
			
			organise: function(){
				
				$maps.players_room.act = 0;
				
				displayText(["Zzz...", "Zzzzz...", "Zzz...", "Zzzzzzzzzzzzz!", "What time is it?", "...", "!!!"], function(){
					
					mapSwitch("players_room");
					
				});
				
			}
			
		}
	
	]

});