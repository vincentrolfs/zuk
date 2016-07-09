Q.Class.extend("LoadingHandler", {

	init: function(UIHandler){
	
		this.UIHandler = UIHandler;
	
	},
	
	displayLoadingText: function(text, loaded, total){
	
		var textWithPercentage = text.replace(PERCENTAGE_PLACEHOLDER, Math.round((loaded/total)*100));

		this.UIHandler.displayLoadingText(textWithPercentage);
	
	},
	
	load: function(loadArray, callback, text){
	
		console.log("Loading: ", loadArray);
	
		var loadingHandler = this,
			UIHandler = this.UIHandler;
		
		if (typeof text === "undefined") text = "Lade "+ PERCENTAGE_PLACEHOLDER+"%...";
		
		loadingHandler.displayLoadingText(text, 0, loadArray.length);
	
		Q.load(loadArray, function() {
		
			UIHandler.hideLoadingText();
			if (typeof callback === "function") callback();

		}, {
	
			progressCallback: function(loaded, total){
			
				loadingHandler.displayLoadingText(text, loaded, total);
	
			},
	
		});
	
	},

});