define([
        'backbone'],
		
function(Backbone){
	var booksModel = Backbone.Collection.extend({
		url:"/books",
		initialize: function(options) {
       
        }
	});
	
	return booksModel;
});