/**
 * New node file
 */
var express = require("express");
var app = new express();

app.use(express.logger());
app.use("/static", express.static(__dirname + "/static"));

app.get('/books', function(req, res) {
	// Retrieve
	var MongoClient = require('mongodb').MongoClient;

	// Connect to the db
	MongoClient.connect("mongodb://localhost:27017/newdb", function(err, db) {
		if (err) {
			return console.dir(err);
		}

		var books = db.collection('books');
		books.find().toArray(function(err, items) {
			res.send(items);

			db.close();
		});

	});
});

var port = 8080;
app.listen(port);
console.log('Listening on port ' + port);
