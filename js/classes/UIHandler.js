Q.Class.extend("UIHandler", {

	init: function(game, audioHandler){
	
		this.busy = false;
		
		this.textContainer;
		this.text;
		this.scrollMarker;
		this.loadStatus;
	
		this.game = game;
		this.audioHandler = audioHandler;
		this.loadingHandler;
		
		this.createSprites();
		this.createScenes();
		this.setupCheckboxes();
		this.setupSaveButton();
		
		this.stageScenes();
	
	},
	
	registerLoadingHandler: function(loadingHandler){
	
		this.loadingHandler = loadingHandler;
	
	},
	
	isBusy: function(){
	
		return this.busy;
	
	},
	
	outputString: function(str, showScrollMarker){
	
		this.text.p.label = str;
	
		this.textContainer.p.hidden = false;
		this.scrollMarker.p.hidden = showScrollMarker;
	
	},
	
	displayLoadingText: function(text){
	
		this.loadStatus.p.hidden = false;
		this.loadStatus.p.label = text;
	
	},
	
	hideLoadingText: function(){
	
		this.loadStatus.p.hidden = true;
	
	},
	
	stringToArray(text){
	
		var lines = text.split("\n"),
			textArray = [],
			l = lines.length;
	
		for ( var i = 0; i < l; i++ ){
	
			var line = lines[i],
				words = line.split(" "),
				word,
				sentence = "",
				words_length = words.length;
				
			for (var j = 0; j < words_length; j++){
		
				word = words[j].trim();
				
				if (word === ""){
				
					continue;
					
				}
			
				if (sentence.length + words_length < 66){
				
					sentence += " " + word;
					
				} else {
			
					textArray.push(sentence.trim());
					sentence = word;
			
				}
		
			}
		
			textArray.push(sentence.trim());
	
		}
		
		return textArray;
	
	},
	
	displayText: function(textArray, callback, autoChange){

		var UIHandler = this;
		UIHandler.busy = true;
	
		if (autoChange && typeof autoChange !== "number") autoChange = DEFAULT_TEXT_SPEED;
	
		if (typeof textArray == "string") textArray = UIHandler.stringToArray(textArray);
	
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
			
				if (autoChange){

					window.clearInterval(timeoutInterval);

				} else {

					// Remove listener
					Q.input.off("action", this);

				}
				
				if (typeof callback == "function") callback();
			
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
	
			// Upper border
			stage.insert(new Q.UI.Container({
				w: Q.el.width,
				h: 5,
				y: -40,
				fill: "#627C85",
				radius: 0
			}), UIHandler.textContainer);
	
			UIHandler.scrollMarker = stage.insert(new Q.UI.Button({
				asset: null,
				x: 330,
				y: 20
			}), UIHandler.textContainer);
	
			UIHandler.text = stage.insert(new Q.UI.Text({
				label: "",
				color: "black",
				family: TEXT_FAMILY,
				size: TEXT_SIZE,
				x: 0,
				y: -15
			}), UIHandler.textContainer);
			
			UIHandler.loadStatus = stage.insert(new Q.UI.Text({
				label: "...",
				hidden: true,
				color: "white",
				family: TEXT_FAMILY,
				size: TEXT_SIZE,
				x: Q.el.width/2,
				y: Q.el.height/2 - 15
			}));
	
		});
	
	},
	
	applyLoadedAssets: function(){
	
		this.scrollMarker = Q.stages[UI_LEVEL].insert(new Q.UI.Button({
			asset: IMAGEFILE_SCROLL_MARKER,
			x: 330,
			y: 20
		}), this.textContainer);
	
	},
	
	loadAssets: function(callback){
	
		if (!this.loadingHandler) throw "loadAssets called with no loading handler set";
	
		var UIHandler = this;
	
		this.loadingHandler.load([IMAGEFILE_SCROLL_MARKER], function(){
			
			UIHandler.applyLoadedAssets();
			if (typeof callback == "function") callback();
		
		}, "Lade Oberfläche: " + PERCENTAGE_PLACEHOLDER + "%...");
	
	},
	
	stageScenes: function(){
	
		Q.stageScene(SCENE_BLACKMAP, BLACKMAP_LEVEL);
		Q.stageScene(SCENE_UI, UI_LEVEL);
	
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
	
		};
		
		soundCheckbox.onclick = function(){
	
			 audioHandler.setSoundEnabled(soundCheckbox.checked);
	 
			 docCookies.setItem(SOUND_COOKIENAME, soundCheckbox.checked? COOKIE_TRUTHVALUE : COOKIE_FALSEVALUE, Infinity);
	 
			 Q.el.focus();
	
		};
	
	},
	
	setupSaveButton: function(){
	
		var game = this.game;
	
		document.getElementById(SAVE_BUTTON_ID).onclick = function(){
		
			game.save();
		
		};
	
	},

});