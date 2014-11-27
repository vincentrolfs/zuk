// Handle live user settings

document.getElementById("audio_enabled").checked = $audio_enabled;

document.getElementById("audio_enabled").onclick = function(){
	
	 $audio_enabled = document.getElementById("audio_enabled").checked;
	 
	 handle_music();
	 
	 document.getElementById("canvas").focus();
	
}

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
		shadow: 0,
		radius: 0,
		
		x: Q.el.width/2,
		y: Q.el.height-40,
		
		w: Q.el.width,
		h: 80,
		
		hidden: true
	
	}));
	
	$ui_text = stage.insert(new Q.UI.Text({
		label: "",
		color: "black",
		x: 0,
		y: 0
	}), $ui_textContainer);
	
});