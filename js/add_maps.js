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
		interact: function(){
		
			displayText(["On a scale of one to ten,", "seven being the highest,", "what is your favourite color?"]);
		
		},
		walk: true
	
	}],
	firstAct: "",
	acts: {
	
		new_game: {
		
			persons: [{ 
			
				x: 120,
				y: 112,
				direction: "left",
				interact: function(){
				
					displayText(["Oh there you are!", "I was looking for you!"]);
				
				}
			
			}],
			
			organise: function(){
			
				$player.setControl(false);
				$player.go(["right", "down", "right", "right"], function(){
				
					$maps.town.p.persons[1].p.interact();
				
				});
			
			}
		
		}
	
	}

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
	firstAct: "new_game",
	acts: {
	
		new_game: {
			
			organise: function(){
				
				$maps.players_room.p.act = "";
				$maps.town.p.act = "new_game";
				
				displayText(["Oh no! I'm going to be late!"], function(){
					
					$player.setControl(false);
					
					$player.go(["right", "right", "right", "up", "up", "up", "up", "right", "right", "right", "up", "up", "up"], function(){
						
						$player.setControl(true);
						
					});
					
				});
				
			}
			
		}
	
	}

});

addMap({

	mapName: "begin",
	music: "good-night.mp3",
	loadAssetsOf: "town",
	firstAct: 0,
	acts: [
	
		{
			
			organise: function(){
				
				$maps.players_room.p.act = "new_game";
				
				displayText(["Zzz...", "Zzzzz...", "Zzz...", "Zzzzzzzzzzzzz!", "What time is it?", "...", "!!!"], function(){
					
					mapSwitch("players_room");
					
				});
				
			}
			
		}
	
	]

});