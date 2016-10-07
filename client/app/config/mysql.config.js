var mysql      = require('mysql');

if(process.env.NODE_ENV && process.env.NODE_ENV === "dev") {
	var pool = mysql.createPool({
	  host     : '127.0.0.1',
	  user     : 'root',
	  password : '123456',
	  database : 'ABTestNew'
	});

}else{
	var pool = mysql.createPool({
	  host     : '127.0.0.1',
	  user     : 'root',
	  password : 'rock4me',
	  database : 'ABTestNew'
	});
}


module.exports = pool;