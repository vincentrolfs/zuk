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
		
		var songToPlay = this.currentSong,
			audioHandler = this;
		
		Q.load(songToPlay, function(){
	
			// The chosen song might change while we are loading. If that happens, don't play it1
			if (audioHandler.musicEnabled && songToPlay == audioHandler.currentSong){
		
				Q.audio.play(songToPlay, { loop: true });
		
			}
		
		});	
	
	},
	
	playSound: function(soundfile){
	
		console.log("called");

		if (this.soundEnabled) Q.audio.play(soundfile);

	}

});