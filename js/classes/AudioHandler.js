Q.Class.extend("AudioHandler", {

	init: function(){
	
		this.musicEnabled = MUSIC_ENABLED_DEFAULT;
		this.soundEnabled = SOUND_ENABLED_DEFAULT;
		
		this.currentSong =  "";
	
	},
	
	setSong: function(song){
	
		console.warn("new song: ", song);
	
		if (this.currentSong == song) return;
	
		this.currentSong = song;
		this._handleMusicSettingChange();
	
	},
	
	setMusicEnabled: function(value){
	
		if (this.musicEnabled == !!value) return;
	
		this.musicEnabled = !!value;
		this._handleMusicSettingChange();
	
	},
	
	setSoundEnabled: function(value){
	
		this.soundEnabled = value;
	
	},
	
	_handleMusicSettingChange: function(){
	
		Q.audio.stop();
	
		if (!this.musicEnabled || !this.currentSong){
			
			return;
		
		}
		
		var songToPlay = this.currentSong,
			audioHandler = this;
		
		Q.load(songToPlay, function(){
	
			// The chosen song might change while we are loading. If that happens, don't
			if (audioHandler.musicEnabled && songToPlay == audioHandler.currentSong){
		
				Q.audio.play(songToPlay, { loop: true });
		
			}
		
		});	
	
	},
	
	playSound: function(soundfile){

		if (this.soundEnabled) Q.audio.play(soundfile);

	}

});