var mongo = require('mongodb');

module.exports.ready = function(db_name, callback){
  if ( process.env.MONGOLAB_URI ){
    mongo.connect(process.env.MONGOLAB_URI, {}, function(err, db){
      callback(db);
    });
  }else{
    new mongo.Db('tictactoe', new mongo.Server('localhost', 27017), {safe: false}).open(function(err,db){
      callback(db);
    });
  }
};
