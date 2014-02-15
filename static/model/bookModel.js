define([
        'backbone'],
		
function(Backbone){
	var bookModel = Backbone.Model.extend({
		url:"/book",
		initialize: function(options) {
            if (options != undefined && options.hasOwnProperty('id')) {
				this.url += options.id;
			}
        }
	});
	
	return bookModel;
});