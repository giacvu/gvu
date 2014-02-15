define([
        'backbone',
        'marionette',
        'hbs!appLayout.html',
        'view/booksView'], 
		
function(Backbone, Marionette, appTemplate, BooksView) {
	var AppLayout = Backbone.Marionette.Layout.extend({
		template: appTemplate,
		regions: {
			main:"#app-region"
		},
		
		initialize: function(options) {
			
		},
		
		onShow: function() {
			this.main.show(new BooksView());
		}
	});
	
	return AppLayout;
});