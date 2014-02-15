define([
        'marionette',
        'appLayout'], 

function(Marionette, AppLayout){
	var app = new Marionette.Application();
	
	app.addRegions({
		main:"#mainContainer"
	});
	
	app.addInitializer(function(){
		this.appLayout = new AppLayout();
	});
	
	app.on("initialize:after", function() {
		this.main.show(this.appLayout);
	});
	
	return app;
});