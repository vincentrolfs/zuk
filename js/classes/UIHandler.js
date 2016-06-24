Q.Class.extend("UIHandler", {

	init: function(game, audioHandler){
	
		this.busy = false;
		
		this.textContainer;
		this.text;
		this.textTriangle;
	
		this.game = game;
		this.audioHandler = audioHandler;
		
		this.createSprites();
		this.createScenes();
		this.setupCheckboxes();
		this.setupSaveButton();
	
	},
	
	isBusy: function(){
	
		return this.busy;
	
	},
	
	outputString: function(str, showTriangle){
	
		this.text.p.label = str;
	
		this.textContainer.p.hidden = false;
		this.textTriangle.p.hidden = showTriangle;
	
	},
	
	displayText: function(textArray, callback, autoChange){

		var UIHandler = this;
		UIHandler.busy = true;
	
		if (autoChange && typeof autoChange != "number") autoChange = DEFAULT_TEXT_SPEED;
	
		// String in Array umwandeln, sodass automatisch umgebrochen wird
		if (typeof textArray === "string"){
		
			var rawTextArray = textArray.split("\n");
			textArray = [];
		
			for (var i in rawTextArray){
		
				var line = rawTextArray[i];
		
				var words = line.split(" "),
					sentence = "",
					j = 0,
					words_l = words.length;
				
				while (j < words.length){
			
					var word = words[j];
				
					if (sentence.length + word.length < 56) sentence += " " + word;
					else {
				
						textArray.push(sentence.trim());
						sentence = word;
				
					}
				
					j++;
			
				}
			
				textArray.push(sentence.trim());
		
			}
	
		}
	
		UIHandler.game.setGlobalFreeze(true);
	
		// Display 1st text
		UIHandler.outputString(textArray[0], !!autoChange);
		
		var textArrayCounter = 1, // Counter that goes through textArray
			timeoutInterval;
	
		// Wird gecallt wenn Spieler umblättert oder wenn automatisch geblättert wird
		function _nextText(){
	
			// If all texts have been displayed…
			if (textArrayCounter >= textArray.length){
			
				UIHandler.busy = false;
				UIHandler.game.setGlobalFreeze(false);
			
				UIHandler.textContainer.p.hidden = true;
			
				if (typeof callback == "function") callback();
			
				if (autoChange){

					window.clearInterval(timeoutInterval);

				} else {

					// Remove listener
					Q.input.off("action", this);

				}
			
			} else {
	
				UIHandler.outputString(textArray[textArrayCounter], !!autoChange);
		
				textArrayCounter += 1;
		
			}
		
		}
	
		if (autoChange){
	
			timeoutInterval = window.setInterval(_nextText, autoChange);
	
		} else {
	
			// Add listener to change into the next text
			Q.input.on("action", _nextText);
	
		}
	
	},
	
	createSprites: function(){
	
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
	
	},
	
	createScenes: function(){
	
		var UIHandler = this;
	
		// Scene for surrounding blackness
		Q.scene(SCENE_BLACKMAP, function(stage){

			stage.insert(new Q.Blackness());
	
		});

		// Scene for ui
		Q.scene(SCENE_UI, function(stage){

			UIHandler.textContainer = stage.insert(new Q.UI.Container({
		
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
			}), UIHandler.textContainer);
	
			UIHandler.textTriangle = stage.insert(new Q.UI.Button({
				asset: "triangle.png",
				x: 330,
				y: 20
			}), UIHandler.textContainer);
	
			UIHandler.text = stage.insert(new Q.UI.Text({
				label: "",
				color: "black",
				family: TEXT_FAMILY,
				size: TEXT_SIZE,
				x: 0,
				y: 0
			}), UIHandler.textContainer);
	
		});
	
	},
	
	setupCheckboxes: function(){
	
		var audioHandler = this.audioHandler,
			musicCheckbox = document.getElementById(MUSIC_CHECKBOX_ID),
			soundCheckbox = document.getElementById(SOUND_CHECKBOX_ID),
			musicEnabledInitially = (docCookies.hasItem(MUSIC_COOKIENAME)? (docCookies.getItem(MUSIC_COOKIENAME) === COOKIE_TRUTHVALUE) : MUSIC_ENABLED_DEFAULT),
			soundEnabledInitially = (docCookies.hasItem(SOUND_COOKIENAME)? (docCookies.getItem(SOUND_COOKIENAME) === COOKIE_TRUTHVALUE) : SOUND_ENABLED_DEFAULT);
		
		audioHandler.setMusicEnabled(musicEnabledInitially);
		audioHandler.setSoundEnabled(soundEnabledInitially);
		
		musicCheckbox.checked = musicEnabledInitially;
		soundCheckbox.checked = soundEnabledInitially;
		
		musicCheckbox.onclick = function(){
	
			 audioHandler.setMusicEnabled(musicCheckbox.checked);
	 
			 docCookies.setItem(MUSIC_COOKIENAME, musicCheckbox.checked? COOKIE_TRUTHVALUE : COOKIE_FALSEVALUE, Infinity);
	 
			 Q.el.focus();
	
		}
		
		soundCheckbox.onclick = function(){
	
			 audioHandler.setSoundEnabled(soundCheckbox.checked);
	 
			 docCookies.setItem(SOUND_COOKIENAME, soundCheckbox.checked? COOKIE_TRUTHVALUE : COOKIE_FALSEVALUE, Infinity);
	 
			 Q.el.focus();
	
		}
	
	},
	
	setupSaveButton: function(){
	
		var game = this.game;
	
		document.getElementById(SAVE_BUTTON_ID).onclick = function(){
		
			game.save();
		
		};
	
	},

});