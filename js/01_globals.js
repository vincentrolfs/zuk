// Global varibales start with $
var $musicEnabled = docCookies.getItem(MUSIC_COOKIENAME) === COOKIE_TRUTHVALUE,
	$soundEnabled = docCookies.getItem(SOUND_COOKIENAME) === COOKIE_TRUTHVALUE,
	$currentSong = "",
	
	$state = {
		
		items: {}
	
	},
	
	$itemNames = {
	
		"1": "Sprudel",
		"2": "Goldtaler"
	
	},
	
	$savegame, // Hier werden die gespeicherten Daten reingetan, wenn Spiel geladen wird
	
	$activeMap = "",
	$maps = {},
	
	$ui_textContainer, // Container for displayed text
	$ui_textTriangle,
	$ui_text, // Displayed text itself
	$ui_busy = false,
	
	$player; // Variable holds instance of Person class that has player functions