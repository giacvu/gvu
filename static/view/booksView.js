define([
        'marionette',
        'hbs!template/booksView.html',
        'model/booksModel'], 
		
function(Marionette, booksViewTemplate, BooksModel){
	var BooksView = Marionette.ItemView.extend({
		template:booksViewTemplate,
		collection:null,
		
		initialize: function(options){
			this.collection = new BooksModel(options);
			this.collection.fetch();
		}
	});
	return BooksView;
});