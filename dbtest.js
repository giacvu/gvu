// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/newdb", function(err, db) {
  if(err) { return console.dir(err); }

  var books = db.collection('books');
  books.find().toArray(function(err, items) {
	  console.log(items);
	  
	  db.close();
  });
  
  

});