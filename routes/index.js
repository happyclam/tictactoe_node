var url = require('url');
var buf = new Array();
var MyCrypt = require("../lib/Crypt");
var MB = require("../lib/MongoBuilder");
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var users = new Array();
exports.mypage = function(req, res){
  MB.ready('tictactoe', function(db){
    var collection = db.collection("tictactoe");
    collection.find().sort({score: -1}).limit(100).toArray(function(err, users) {
      assert.equal(null, err);
      console.log(users);       
      res.render('index', {title: '三目並べ「無敗」', users: users});
    });
  });
}

exports.regist = function(req, res){
  console.log("exports.routes.regist");
  var urlObj = url.parse(req.url, true);
  var cb = urlObj.query.callback;
  var username = urlObj.query.username;
  var org_unbeaten = urlObj.query.unbeaten;
  console.log("org_unbeaten=");
  console.log(org_unbeaten);
  var unbeaten = 0
  if (org_unbeaten != null && org_unbeaten != 'undefined') {
    unbeaten = parseInt(MyCrypt.decrypt(org_unbeaten.split(","), "fancyserialNO"), 10);
  }
  console.log(unbeaten);
  var uid = urlObj.query.uid;
  if (uid == 'null' || uid == 'undefined'){
    uid = null;
  }
  console.log(urlObj.query);
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var doc = {uid:null, name:username, score:unbeaten, remote: ip, date: null};
  
  if (username && unbeaten > 0) {
    console.log("db.open");
    MB.ready('tictactoe', function(db){
      console.log("check0");
      console.log("uid=");
      console.log(uid);
      var collection = db.collection("tictactoe");
      temp_id = new ObjectID(uid);
      collection.update({_id: temp_id}, {name:username, score:unbeaten, remote: ip, date: new Date()}, {upsert:true, w: 1}, function(err, result) {
        if (err) { throw err; }
        console.log("check1");
        assert.equal(null, err);
//        assert.equal(1, result.result.ok);
        collection.findOne({_id: temp_id}, function(err, item) {
          if (err) { throw err; }
          console.log("check2");
          console.log(item);
          if (item) {
            doc._id = item._id;
            doc.date = item.date;
            assert.equal(null, err);
            assert.equal(unbeaten, item.score);
            assert.equal(username, item.name);
          }
        });
        console.log("check3");
        collection.find().sort({score: -1}).limit(100).toArray(function(err, items) {
//          collection.find().sort({score: -1}, {date: -1}).limit(100).toArray(function(err, items) {
          assert.equal(null, err);
          buf = items;
          //自分のレコードを先頭に追加
          buf.unshift({_id: doc._id, name: username, score: unbeaten, remote: ip, date: doc.date});
          func_str = cb + "(" + JSON.stringify(buf) + ")";
          console.log(func_str);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(func_str);
        });
      });
    });
  } else {
    buf.unshift(doc);
    func_str = cb + "(" + JSON.stringify(buf) + ")";
    res.end(func_str);
  }

};

