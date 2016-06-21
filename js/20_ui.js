// Handle live user settings
document.getElementById("musicEnabled").checked = $musicEnabled;
document.getElementById("musicEnabled").onclick = function(){
	
	 $musicEnabled = document.getElementById("musicEnabled").checked;
	 
	 docCookies.setItem(MUSIC_COOKIENAME, $musicEnabled? COOKIE_TRUTHVALUE : COOKIE_FALSEVALUE, Infinity);
	 
	 handleMusic();
	 
	 document.getElementById("canvas").focus();
	
}

document.getElementById("soundEnabled").checked = $soundEnabled;
document.getElementById("soundEnabled").onclick = function(){
	
	 $soundEnabled = document.getElementById("soundEnabled").checked;
	 
	 docCookies.setItem(SOUND_COOKIENAME, $soundEnabled? COOKIE_TRUTHVALUE : COOKIE_FALSEVALUE, Infinity);
	 
	 document.getElementById("canvas").focus();
	
}

document.getElementById("save").onclick = saveGame;

// Sprite for surrounding blackness
Q.Sprite.extend("Blackness", {

	init: function(p){
	
		this._super(p, {
		
			w: Q.el.width*2,
			h: Q.el.height*2,
			x: 0,
			y: 0,
			type: 0
		
		});
	
	},

	draw: function(ctx){
	
		ctx.fillStyle = "black";
		ctx.fillRect(this.p.x - this.p.cx, this.p.y - this.p.cy, this.p.w, this.p.h);
	}

});

// Scene for surrounding blackness
Q.scene("_blackmap", function(stage){

	stage.insert(new Q.Blackness());
	
});

// Scene for ui
Q.scene("_ui", function(stage){

	$ui_textContainer = stage.insert(new Q.UI.Container({
		
		fill: "white",
		border: 0,
		stroke: "#627C85",
		shadow: 0,
		radius: 0,
		
		x: Q.el.width/2,
		y: Q.el.height-40,
		
		w: Q.el.width,
		h: 80,
		
		hidden: true
	
	}));
	
	stage.insert(new Q.UI.Container({
		w: Q.el.width,
		h: 5,
		y: -40,
		fill: "#627C85",
		radius: 0
	}), $ui_textContainer);
	
	$ui_textTriangle = stage.insert(new Q.UI.Button({
		asset: "triangle.png",
      	x: 330,
      	y: 20
	}), $ui_textContainer);
	
	$ui_text = stage.insert(new Q.UI.Text({
		label: "",
		color: "black",
		family: TEXT_FAMILY,
		size: TEXT_SIZE,
		x: 0,
		y: 0
	}), $ui_textContainer);
	
});

function displayText(txtArr, callback, autoChange){

	$ui_busy = true;
	
	if (autoChange && typeof autoChange != "number") autoChange = DEFAULT_TEXT_SPEED;
	
	// String in Array umwandeln, sodass automatisch umgebrochen wird
	if (typeof txtArr === "string"){
		
		var rawTxtArr = txtArr.split("\n");
		txtArr = [];
		
		for (var i in rawTxtArr){
		
			var line = rawTxtArr[i];
		
			var words = line.split(" "),
				sentence = "",
				j = 0,
				words_l = words.length;
				
			while (j < words.length){
			
				var word = words[j];
				
				if (sentence.length + word.length < 56) sentence += " " + word;
				else {
				
					txtArr.push(sentence.trim());
					sentence = word;
				
				}
				
				j++;
			
			}
			
			txtArr.push(sentence.trim());
		
		}
	
	}
	
	// ----- start freezing
	
	var persons = $maps[$activeMap].p.persons;
	
	persons.push($player);
		
	var	persons_length = persons.length,
		person_no = 0;
		
	for ( ; person_no < persons_length; person_no++ ){
		
		persons[person_no].setFreeze(true);
		
	}
	
	// ----- end freezing
	
	// Function that actually puts the text on the map
	function _display(text){
		
		$ui_text.p.label = text;
		
		$ui_textContainer.p.hidden = false;
		$ui_textTriangle.p.hidden = !!autoChange;
		
	}
	
	// Display 1st text
	_display(txtArr[0]);
	
	var i = 1, // Counter that goes through txtArr
		timeout_id;
	
	// Wird gecallt wenn Spieler umblättert oder wenn automatisch geblättert wird
	function _nextText(){
	
		// If all texts have been displayed…
		if (i >= txtArr.length){
			
			$ui_busy = false;
			
			// ----- start unfreezing
			
			person_no = 0;
			
			for ( ; person_no < persons_length; person_no++ ){
	
				persons[person_no].setFreeze(false);
	
			}
			
			// ----- end unfreezing
			
			$ui_textContainer.p.hidden = true;
			
			if (typeof callback == "function") callback();
			
			if (autoChange){

				window.clearInterval(timeout_id);

			} else {

				// Remove listener
				Q.input.off("action", this);

			}
			
		} else {
	
		_display(txtArr[i]);
		
			i += 1;
		
		}
		
	}
	
	if (autoChange){
	
		timeout_id = window.setInterval(_nextText, autoChange);
	
	} else {
	
		// Add listener to change into the next text
		Q.input.on("action", _nextText);
	
	}
	
}