Q.animations("person_animations", {
		
	stand_up: { 	frames: [0], loop: false },
	stand_down: { 	frames: [5], loop: false },
	stand_right: { frames: [1], loop: false },
	stand_left: { 	frames: [6], loop: false },
		
	walk_up: { frames: [2, 0, 10], rate: 1/3 },
	walk_down: { frames: [11, 5, 8], rate: 1/3 },
	walk_right: { frames: [7, 1, 4], rate: 1/3 },
	walk_left: { frames: [3, 6, 9], rate: 1/3 },
	

});

Q.sheet("person_sheet_old_man",
		"persons/old_man.png",
		{
			tilew: 32,
			tileh: 32,
			spacingX: 16
		}
);


/*
// Define tilesheet named "persons_sheet"
Q.sheet("dp_persons_sheet",
		"dp_persons2.png",
		{
			tilew: 32,
			tileh: 32,
			spacingX: 16
		}
);

Q.animations("dp_persons_anim", {
		
	stand_up3: { 	frames: [9], loop: false },
	stand_down3: { 	frames: [29], loop: false },
	stand_right3: { frames: [10], loop: false },
	stand_left3: { 	frames: [45], loop: false },
		
	walk_up3: { frames: [11, 9, 64], rate: 1/3 },
	walk_down3: { frames: [65, 29,47], rate: 1/3 },
	walk_right3: { frames: [46, 10, 28], rate: 1/3 },
	walk_left3: { frames: [27, 45, 63], rate: 1/3 },

	stand_up5: { 	frames: [12], loop: false },
	stand_down5: { 	frames: [35], loop: false },
	stand_right5: { frames: [16], loop: false },
	stand_left5: { 	frames: [51], loop: false },
		
	walk_up5: { frames: [17, 15, 70], rate: 1/3 },
	walk_down5: { frames: [71, 35,53], rate: 1/3 },
	walk_right5: { frames: [52, 16, 34], rate: 1/3 },
	walk_left5: { frames: [33, 51, 69], rate: 1/3 },
	

});

*/

/*

sprites sind width 32, height 32
x abstand: 16px
y abstand: 0px
rechte seite sieht größer aus als linke

// Define tilesheet named "test"
Q.sheet("test",
		"trchar000.png",
		{
			tilew: 16,
			tileh: 16,
			//spacingX: 16
		}
);

Q.animations("test_anim", {
		
	stand_up3: { 	frames: [12], loop: false },
	stand_down3: { 	frames: [0], loop: false },
	stand_right3: { frames: [0], loop: false },
	stand_left3: { 	frames: [0], loop: false },
		
	walk_up3: { frames: [0, 0, 0], rate: 1/3 },
	walk_down3: { frames: [0, 0,0], rate: 1/3 },
	walk_right3: { frames: [0, 0, 0], rate: 1/3 },
	walk_left3: { frames: [0, 0, 0], rate: 1/3 },

});

*/