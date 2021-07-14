var express = require('express');
var path = require('path');
var errorhandler = require('errorhandler')

var routes = require('./routes/index');

var http = require('http');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('port', process.env.PORT || 3000);
app.locals.pretty = true;
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));


if ('production' == app.get('env')) {
    app.use(errorhandler());
}

// Routes
app.get('/', routes.mypage);
app.get('/regist', routes.regist);
http.createServer(app).listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
 
