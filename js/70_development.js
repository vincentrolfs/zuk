(function(){

	Q.debug = 0;
	
	devArea = $("#devArea");
	devArea.hide();
	
	$("body").on("keyup", toggleDevMode); // Press ctrl+g
	$(Q.el).on("click", canvasClick);

	function toggleDevMode(e){
	
		if (!e.ctrlKey || e.keyCode != 71) return; // Press ctrl+g
	
		$dev_mode = !$dev_mode;
		devArea.toggle();
		console.log("dev_mode: ", $dev_mode? "ON" : "OFF");
		
		if ($dev_mode) updateDevArea();
	
	}
	
	function updateDevArea(){
	
		var listArea = $("#list", devArea);
	
		listArea.html("");
	
		var actionSprites = getActionSprites(),
			l = actionSprites.length,
			el,
			sprite;
		
		for (var i = 0; i < l; i++){
		
			sprite = actionSprites[i];
		
			el = $('<span>' + sprite.className + " @ x: " + sprite.p.x + ", y: " + sprite.p.y + '</span>');
			el.on("click", sprite, function(event){
			
				$(this).toggleClass("blue");
				event.data.togglemark();
			
			});
			
			listArea.append(el);
			listArea.append("<br/>")
		
		}
	
	}
	
	function canvasClick(e){
	
		if (!$dev_mode) return false;
		
		var clickArea = $("#click", devArea),
			tileX = Math.floor(Q.inputs["mouseX"]/16.0) * 16 + 8,
			tileY = Math.floor(Q.inputs["mouseY"]/16.0) * 16,
			itemButton = $('<input type="button" value="Create item"/>');
		
		itemButton.on("click", [tileX, tileY], createItem);
		
		clickArea.html("You clicked on x: " + tileX + ", y: " + tileY + ". What do you wish to do? <br/>");
		clickArea.append(itemButton);
	
	}
	
	function createItem(event){
	
		var clickX = event.data[0],
			clickY = event.data[1];
	
		Q.stage(MAIN_LEVEL).insert( new Q.Item({no: 1, x: clickX, y:clickY}) );
	
	}

}());
