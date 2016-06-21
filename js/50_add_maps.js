// Pathway
addMap({

	mapName: "pathway",
	fileName: "pathway.tmx",
	loadingPoints: {
	
		default: [88, 368, "up", true],
		// Format: [x, y(, dir)(, isDoor)]
	
	},
	switchPoints: [
	
		[88, 368, "town"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
	
	],
	music: "pokemon-friends.mp3",
	firstAct: "on_the_way",
	acts: {
	
		on_the_way: {
		
			persons: [{
			
				x: 136,
				y: 80,
				direction: "down",
				walk: true,
				interact: function(callback){
				
					displayText(["In deinem Alter noch so schnell unterwegs...", "Mach's wie ich und gönn' dir mal 'ne Pause!"]);
				
				}
			
			},
			{
			
				x: 72,
				y: 192,
				sheet: "claire",
				direction: "right",
				walk: true,
				interact: function(callback){
				
					displayText(["Major Tom? Ich halte nichts von ihm.", "Ich finde ihn arrogant!"]);
				
				}
			
			}]
			/*{
			
				x: 88,
				y: 304,
				direction: "down",
				interact: function(callback){
				
					if ($maps.pathway.p.act === "meet_tom"){
		
						displayText(["Hey du!", "Komm her!"], function(){
					
							$player.go(["up", "up"], function(){
						
								displayText("Mein Name ist Major Tom.", callback);
						
							});
					
						});
					
					} else {
					
						displayText("...", callback);
					
					}
		
				},
			
			}],
			
			organise: function(){
			
				$player.setControl(false);
				
				$maps.pathway.p.persons[0].p.interact(function(){
					
					$player.setControl(true);
					$maps.pathway.p.act = "exploring";
					
				});
			
			}*/
		
		}
	
	}
	
});

// Blue Room
addMap({

	mapName: "blue_room",
	fileName: "blue_room.tmx",
	loadingPoints: {
	
		default: [200, 208, "up", true],
		town: [216, 208, "up", true]
		// Format: [x, y(, dir)(, isDoor)]
	
	},
	switchPoints: [
	
		[216, 208, "town"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
	
	],
	music: "come-on-in-to-post-town.mp3",
	items: [],
	firstAct: "exploring",
	acts: {
	
	}

});

// Jersey's Room
addMap({

	mapName: "jerseys_room",
	fileName: "jerseys_room.tmx",
	loadingPoints: {
	
		default: [200, 208, "up", true],
		town: [216, 208, "up", true]
		// Format: [x, y(, dir)(, isDoor)]
	
	},
	switchPoints: [
	
		[216, 208, "town"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
	
	],
	music: "come-on-in-to-post-town.mp3",
	items: [],
	firstAct: "exploring",
	acts: {
	
	}

});

// Town
addMap({

	mapName: "town",
	fileName: "town.tmx",
	loadingPoints: {
	
		default: [200, 128, "up", false], // Default loading points must be specified!
		players_room: [88, 224, "down", true],
		pathway: [200, 96, "down", true],
		cave: [104, 368, "down", true],
		jerseys_room: [216, 224, "down", true],
		blue_room: [280, 224, "down", true]
		// Format: [x, y(, dir)(, isDoor)]
	
	},
	switchPoints: [
	
		[88, 224, "players_room"],
		[200, 96, "pathway"],
		[104, 368, "cave"],
		[216, 224, "jerseys_room"],
		[280, 224, "blue_room"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
	
	],
	music: "come-on-in-to-post-town.mp3",
	items: [{ x: 136, y: 96, no: 1 }],
	invisibles: [
	
		{
			x: 40, y: 144,
			interact: function(){
		
				displayText(["Da wurde etwas in den Baum geritzt!", '"Game Development by Vincent (musike)"', "Wer das wohl ist?"]);
		
			}	
		}
		
	],
	persons: [{
	
		x: 232,
		y: 400,
		interact: function(){
		
			displayText("*Hust, Hust* \n Oh man, mir geht es gar nicht gut...");
		
		},
		walk: true
	
	}],
	firstAct: "exploring",
	acts: {
	
		new_game: {
		
			persons: [{ 
			
				x: 120,
				y: 240,
				sheet: "jersey",
				direction: "left",
				interact: function(callback){
				
					var text;
					
					if ($maps.town.p.act == "new_game"){
					
						text = "Ich: Jersey?\nDa bist du ja! Ich wollte dich gerade wecken. Vorhin ist ein Brief eingetroffen - von der Regierung! \nMajor Tom hat geschrieben dass du dich sofort mit ihm treffen sollst. Er wartet im nächsten Dorf auf dich! Am besten gehst du sofort los!";
						
						$maps.town.p.act = "exploring";
					
					} else {
					
						text = "Major Tom erwartet dich im nächsten Dorf.\nKeine Ahnung was er will!";
					
					}
				
					displayText(text, function(){
					
						$player.setControl(true);
						if(typeof callback == "function") callback();
					
					});
				
				}
			
			}],
			
			organise: function(){
			
				$player.setControl(false);
				$player.go(["right"], function(){
				
					$maps.town.p.persons[1].p.interact(function(){
					
						$player.setControl(true);
					
					});
				
				});
			
			}
		
		},
		
		exploring: {
		
			persons: [{ 
			
				x: 328,
				y: 256,
				sheet: "jersey",
				direction: "left",
				interact: function(callback){
				
					displayText("Hast du schon mit Major Tom geredet?\nEr wartet im nächsten Dorf auf dich.", callback);
				
				}
			
			}],
		
		}
	
	}

});

// Players room
addMap({

	mapName: "players_room",
	fileName: "interior.tmx",
	loadingPoints: {
	
		default: [56, 144, "down", false],
		begin: [56, 144, "down", false],
		town: [152, 32, "down", true]
		// Format: [x, y(, dir)(, isDoor)]
	
	},
	switchPoints: [
	
		[152, 32, "town"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
	
	],
	music: "come-on-in-to-post-town.mp3",
	items: [],
	firstAct: "exploring",
	acts: {
	
		new_game: {
			
			organise: function(){
				
				$maps.players_room.p.act = "exploring";
				
				displayText(["Was für eine Nacht...", "So schlecht geträumt habe ich lange nicht mehr.", "Aber jetzt erinnere ich alles nur noch verschwommen...", "Jersey kam vor, denke ich, und noch jemand...", "War es... Major Tom?", "Er antwortet seit Wochen nicht mehr auf meine Briefe.", "Ich sollte gehen und Jersey fragen, ob er etwas", "weiß, immerhin kennt er ihn besser als ich."], function(){
					
					$player.setControl(false);
					
					$player.go(["right", "right", "right", "up", "up", "up", "up", "right", "right", "right", "up", "up", "up"]);
					
				});
				
			}
			
		}
	
	}

});

// Cave
addMap({

	mapName: "cave",
	fileName: "cave.tmx",
	loadingPoints: {
	
		town: [248, 240, "up", true],
		begin: [200, 64, "down", false],
		default: [200, 64, "down", false]
		// Format: [x, y(, dir)(, isDoor)]
	
	},
	switchPoints: [
	
		[248, 240, "town"]
		// Format: [x_on_current_map, y_on_current_map, name_of_new_map]
	
	],
	items:[{ no: 1, x: 56, y: 176 }],
	music: "icy-sanctum.mp3",
	firstAct: "exploring",
	acts: {
	
		new_game: {
		
			persons: [{ 
			
				x: 200, y: 112,
				sheet: "jersey",
				direction: "up"
				
			}, { 
			
				x: 216, y: 96,
				sheet: "jersey",
				direction: "up"
				
			}, { 
			
				x: 184, y: 96,
				sheet: "jersey",
				direction: "up"
				
			}, { 
			
				x: 168, y: 80,
				sheet: "jersey",
				direction: "right"
				
			}, { 
			
				x: 232, y: 80,
				sheet: "jersey",
				direction: "left"
				
			}],
			
			organise: function(){
			
				$player.setControl(false);
				
				$maps.cave.p.act = "exploring";
				$maps.begin.p.act = "intro2";
				
				setTimeout(function(){
				
					displayText("...\n Es ist entschieden!", function(){
				
						setTimeout(function(){
			
							$maps.cave.p.persons[0].go("up", function(){
					
								displayText("Hiermit ernenne ich dich zum Dorfältesten! \n Mögest du uns Weisheit und Wohlstand bringen! \n ALLE: Weisheit und Wohlstand!", function(){
								
									mapSwitch("begin");
								
								}, 3000);
					
							});
				
						}, 1500);
				
					}, 2000);
				
				}, 1500);
			
			}
		
		}
	
	}
	
});

// Begin
addMap({

	mapName: "begin",
	music: "icy-sanctum.mp3", // "good-night.mp3",
	loadAssetsOf: "town",
	firstAct: "intro1",
	acts: {
	
		intro1: {
			
			organise: function(){
				
				$maps.cave.p.act = "new_game";
				$maps.players_room.p.act = "new_game";
				$maps.town.p.act = "new_game";
				
				displayText("Alles begann in einer dunklen Oktobernacht... \n Der Nacht in der ich zum Dorfältesten ernannt wurde...", function(){
					
					mapSwitch("cave");
					
				});
				
			}
			
		},
		
		intro2: {
			
			organise: function(){
				
				displayText("Und so nahm das Unheil seinen Lauf...\nNie hätte ich gedacht, dass sowas \n bei uns passieren würde! \n Aber ich greife vor...", function(){
					
					mapSwitch("players_room");
					
				});
				
			}
			
		}
	
	}

});