Q.Class.extend("AudioHandler", {

	init: function(){
	
		this.musicEnabled = MUSIC_ENABLED_DEFAULT;
		this.soundEnabled = SOUND_ENABLED_DEFAULT;
		
		this.currentSong =  "";
	
	},
	
	setSong: function(newSong){
	
		if (this.currentSong == newSong) return;
	
		this.currentSong = newSong;
		this.handleMusicSettingChange();
	
	},
	
	setMusicEnabled: function(value){
	
		if (this.musicEnabled == !!value) return;
	
		this.musicEnabled = !!value;
		this.handleMusicSettingChange();
	
	},
	
	setSoundEnabled: function(value){
	
		this.soundEnabled = value;
	
	},
	
	handleMusicSettingChange: function(){
	
		Q.audio.stop();
	
		if (!this.musicEnabled || !this.currentSong){
			
			return;
		
		}
		
		if (typeof Q.assets[this.currentSong] === undefined){
		
			console.warn("Song " + this.currentSong + " has not been loaded and can't be played.");
			return;
			
		}
		
		Q.audio.play(this.currentSong, { loop: true });
	
	},
	
	playSound: function(soundfile){
	
		console.log("called");

		if (this.soundEnabled) Q.audio.play(soundfile);

	}

});