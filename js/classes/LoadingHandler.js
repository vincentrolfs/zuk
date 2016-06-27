Q.Class.extend("LoadingHandler", {

	init: function(UIHandler){
	
		this.UIHandler = UIHandler;
	
	},
	
	load: function(loadArray, callback, preText, postText){
	
		console.log(loadArray);
	
		var UIHandler = this.UIHandler;
		
		if (typeof preText == "undefined") preText = "Lade ";
		if (typeof postText == "undefined") postText = "%...";
	
		Q.load(loadArray, function() {
		
			UIHandler.hideLoadingText();
			if (typeof callback == "function") callback();

		}, {
	
			progressCallback: function(loaded, total){
	
				UIHandler.displayLoadingText(preText + Math.round((loaded/total)*100) + postText);
	
			},
	
		});
	
	},

});