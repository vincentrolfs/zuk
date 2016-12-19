// HTML id's

var CANVAS_ID = "canvas";
var MUSIC_CHECKBOX_ID = "musicEnabled";
var SOUND_CHECKBOX_ID = "soundEnabled";
var SAVE_BUTTON_ID = "save";

var BLACKMAP_LEVEL = 0; 
var MAIN_LEVEL = 1;
var UI_LEVEL = 2;

var SCENE_BLACKMAP = "_blackmap";
var SCENE_UI = "_ui";

var MUSIC_COOKIENAME = "musicEnabled";
var SOUND_COOKIENAME = "soundEnabled";
var SAVEGAME_COOKIENAME = "savegame";

var PERCENTAGE_PLACEHOLDER = "___percentage___";

// What value to use when saving a boolean cookie, e.g. soundEnabled
var COOKIE_TRUTHVALUE = "1";
var COOKIE_FALSEVALUE = "0";

var ITEM_NAMES = {

	"1": "Quietscheentchen",
	"2": "Goldtaler"

};

var MAIN_TILESET = "dp_tileset.png";
var INTERIOR_TILESET = "interior.png";

var IMAGEFILE_ASSET_MARKER = "asset_marker.png";
var IMAGEFILE_ITEM = "item.png";
var IMAGEFILE_SCROLL_MARKER = "scroll_marker.png";

var IMAGEFILE_PERSON_MARKER = "persons/person_marker.png";

var MARKER_SHEET = "marker";
var PLAYER_SHEET = "robert";

var SOUNDFILE_BUMP = "bump.mp3";
var SOUNDFILE_ITEM = "item.mp3";

var DEFAULT_MAP = "begin";
var MAP_SWITCH_TIMEOUT = 300;
var DEFAULT_TEXT_SPEED = 1500;

var MUSIC_ENABLED_DEFAULT = true;
var SOUND_ENABLED_DEFAULT = true;

var TEXT_FAMILY = "aller";
var TEXT_SIZE = 26;

var LOAD_ON_STARTUP = [MAIN_TILESET, INTERIOR_TILESET, IMAGEFILE_ITEM, IMAGEFILE_PERSON_MARKER, IMAGEFILE_ASSET_MARKER, "persons/max.png", "persons/jersey.png", "persons/robert.png", "persons/claire.png", "persons/bob.png", "persons/chris.png", "persons/police.png", SOUNDFILE_BUMP, SOUNDFILE_ITEM];