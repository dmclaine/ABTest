var express	= require('express');
var app = express();
var debug = true;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,Cache-Control');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);
/*
|--------------------------------------------------------------------------
|Check environment
|--------------------------------------------------------------------------
*/
var port = 3000,host="";
if(process.env.NODE_ENV == "dev") {
	host = "http://localhost:3000/";
}else{
	host = "https://abclient.datastars.de";
}



app.get('/campaign', function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');

	require('./app/controller/Campaigns').init(req.query, function(data){
		res.setHeader('Content-Type', 'application/json');
		res.send(data);
	});

});

app.get('/running', function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');
	require('./app/controller/Engine').init(req, function(data){
		res.send(data);
	});

});

app.get('/tracker', function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');
	require('./app/controller/Tracker').init(req.query);
	res.send('');
});

app.get('/test', function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');
	require('./app/controller/Test').init(req.query, function(data){
		res.setHeader('Content-Type', 'application/json');
		res.send(data);
	});

});

/*Debug*/
if(debug) {
	app.use("/js/client.p.js", express.static(__dirname + '/public/js/client.p.unmin.js'));
	console.log("Debug mode on");
}else{
	app.use(express.static(__dirname + '/public'));
}
/*
|--------------------------------------------------------------------------
| Kick start the server. Brrmmm Brrmmm
|--------------------------------------------------------------------------
*/
app.listen(port, function (err) {
	console.log('✅  Example app listening at ' + port);
});
