define([
        'marionette',
        'hbs!js/template/bookView.html',
        'js/model/bookModel'], 
		
function(Marionette, bookViewTemplate, BookModel){
	var BookView = Marionette.ItemView.extend({
		template:bookViewTemplate,
		model:null,
		
		initialize: function(options){
			this.model = new BookModel(options);
		}
	});
	
	return BookView;
});