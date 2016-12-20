Q.Class.extend("LoadingHandler", {

	init: function(UIHandler){
	
		this.UIHandler = UIHandler;
		this.doneLoading = [];
	
	},
	
	displayLoadingText: function(text, loaded, total){
	
		if (typeof text !== "string" || !text.length) return;
	
		var textWithPercentage = text.replace(PERCENTAGE_PLACEHOLDER, Math.round((loaded/total)*100));

		console.log("Loading text: ", textWithPercentage);
		this.UIHandler.displayLoadingText(textWithPercentage);
	
	},
	
	removeDuplicates: function(arr){
		var seen = {};
		return arr.filter(function(item) {
			return seen.hasOwnProperty(item) ? false : (seen[item] = true);
		});
	},
	
	load: function(loadArray, callback, text){
		
		if (typeof loadArray === "undefined"){ console.warn("Can't load undefined."); return; }
		
		loadArray = this.removeDuplicates(loadArray);
		console.log("Loading: ", loadArray);
		
		if (!loadArray.length){
			
			this.loadSuccess(loadArray, callback);
		
		} else {
		
			var loadingHandler = this,
				UIHandler = this.UIHandler;
			
			if (typeof text === "undefined") text = "";
		
			loadingHandler.displayLoadingText(text, 0, loadArray.length);
	
			Q.load(loadArray, function() {
		
				UIHandler.hideLoadingText();
				loadingHandler.loadSuccess(loadArray, callback);
			
			}, {
		
				progressCallback: function(loaded, total){
				
					loadingHandler.displayLoadingText(text, loaded, total);
			
				},
		
			});
		
		}
	
	},
	
	loadSuccess: function(loadArray, callback){
	
		console.log("Loaded succesfully: ", loadArray);
		if (typeof callback === "function") callback();
	
	}

});