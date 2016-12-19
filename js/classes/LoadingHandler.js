Q.Class.extend("LoadingHandler", {

	init: function(UIHandler){
	
		this.UIHandler = UIHandler;
	
	},
	
	displayLoadingText: function(text, loaded, total){
	
		if (typeof text !== "string" || !text.length) return;
	
		var textWithPercentage = text.replace(PERCENTAGE_PLACEHOLDER, Math.round((loaded/total)*100));

		console.log("Loading text: ", textWithPercentage);
		this.UIHandler.displayLoadingText(textWithPercentage);
	
	},
	
	load: function(loadArray, callback, text){
	
		console.log("Loading: ", loadArray);
		
		if (typeof loadArray === "undefined" || !loadArray.length) return;
	
		var loadingHandler = this,
			UIHandler = this.UIHandler;
		
		if (typeof text === "undefined") text = "Lade "+ PERCENTAGE_PLACEHOLDER + "%...";
		
		loadingHandler.displayLoadingText(text, 0, loadArray.length);
	
		Q.load(loadArray, function() {
		
			UIHandler.hideLoadingText();
			console.log("Loaded succesfully: ", loadArray);
			if (typeof callback === "function") callback();

		}, {
	
			progressCallback: function(loaded, total){
			
				loadingHandler.displayLoadingText(text, loaded, total);
	
			},
	
		});
	
	},

});