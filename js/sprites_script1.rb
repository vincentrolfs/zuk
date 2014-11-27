str = 'stand_up?: { 	frames: [038], loop: false },
stand_down?: { 	frames: [059], loop: false },
stand_right?: { frames: [039], loop: false },
stand_left?: { 	frames: [076], loop: false },
		
walk_up?: { frames: [040, 038, 096], rate: 1/3 },
walk_down?: { frames: [097, 059,078], rate: 1/3 },
walk_right?: { frames: [058, 039, 077], rate: 1/3 },
walk_left?: { frames: [057, 076, 095], rate: 1/3 },'

for i in 0..18

	puts str.gsub(/\d\d\d/){ |pat|
		
		(pat.to_i+19*4*i).to_s
		
	}.gsub("?", (i*6).to_s)

end