str = 'stand_up?: { 	frames: [047], loop: false },
stand_down?: { 	frames: [068], loop: false },
stand_right?: { frames: [048], loop: false },
stand_left?: { 	frames: [085], loop: false },
		
walk_up?: { frames: [049, 047, 105], rate: 1/3 },
walk_down?: { frames: [106, 068,087], rate: 1/3 },
walk_right?: { frames: [067, 048, 086], rate: 1/3 },
walk_left?: { frames: [066, 085, 104], rate: 1/3 },'



	puts str.gsub(/\d\d\d/){ |pat|
		
		(pat.to_i-9).to_s
		
	}