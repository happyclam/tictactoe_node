var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    assert = require('assert');

var params = {name: process.argv[2], score: process.argv[3]};
var db = new Db('tictactoe', new Server('localhost', 27017), {safe: false});

db.open(function(err, db) {
  var collection = db.collection("tictactoe");

  collection.insert({
    name: params.name, 
    score: params.score,
    remote: "192.168.1.3",
    date: new Date()
  });

  db.close();
});
