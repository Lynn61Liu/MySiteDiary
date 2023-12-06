var express = require('express');
const session = require('express-session');
var path = require('path');
var db=require('./dbConfig');
const { log } = require('console'); 
const app = express(); 
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: '123', // Change this to a secure key
	resave: true,
	saveUninitialized: true
  }));
  
app.use(function(req, res, next) {
	res.locals.username = req.session.username || null;
	next();
  });
app.get('/', function(req, res, next) {
	res.render('home', { title: 'Home' });
});

app.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
	  if (err) {
		console.error(err);
	  } else {
		res.redirect('/login'); 
	  }
	});
  });
  

// app.post('/', function(req, res, next) {
// 	var search = req.body.search;
// 	console.log(search);
// 	//db.query(`SELECT * FROM incidents WHERE beach="${search}"`, function (err, result) {
// 	db.query(`SELECT * FROM incidents WHERE MATCH description AGAINST ("${search}" WITH QUERY EXPANSION);`, function (err, result) {
// 		if (err) throw err;
// 		console.log(result);
// 		res.render('getIncidents', { title: 'xyz', incidentData: result});
// 	});
// });

// app.get('/videos', function(req, res, next) {
// 	res.render('videos', { title: 'Videos' });
// });
app.get('/signup', function(req, res, next) {
	res.render('signup');
});



 app.post('/signup', function(req, res, next) {
	var userName = req.body.userName;
	var email = req.body.email;
	var password = req.body.password;
	var sql = `INSERT INTO users (user_name, email, password) VALUES ("${userName}", "${email}", "${password}")`;
	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log('user inserted');
		req.session.username = userName;
		 res.render('login',{username: userName });
		// res.render('login');
	});
});




app.get('/login', function(req, res, next) {
	res.render('login', { title: 'login' });
});

//login verification
app.post('/login', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	var sql = `SELECT * FROM users WHERE email="${email}" AND password="${password}"`;
	console.log(sql);//vevify above code excuted

	db.query(sql, function(err, result) {
		if (err) throw err;
		if (result.length>0) {
			console.log(result);//verify above code excuted

			var username = result[0].user_name;
			req.session.username = username;
			res.render('login',{username: username });
		} else {
			console.log("fiald");
			res.render('login', { loginFailed: true, statusMSG: 'Login Failed. Please check your email and password.'});
		  }
	});
});

app.get('/siteDiary', function(req, res, next) {
	res.render('siteDiary', { title: 'siteDiary' });
});

app.get('/summary', function(req, res, next) {
	res.render('summary', { title: 'summary' });
});
app.get('/contact', function(req, res, next) {
	res.render('contact', { title: 'contact' });
});




app.get('/jobAssignment', function(req, res, next) {
	db.query("SELECT user_name,user_id FROM users;", function (err, result) {
				if (err) throw err;
		 		console.log(result);
	res.render('jobAssignment', { userData: result });
});
});


// app.get('/addIncidents', function(req, res, next) {
// 	res.render('addIncidents', { title: 'Home' });
// });
 
// app.get('/getIncidents', function(req, res){
// 	db.query("SELECT * FROM incidents", function (err, result) {
// 		if (err) throw err;
// 		console.log(result);
// 		res.render('getIncidents', { title: 'xyz', incidentData: result});
// 	});
// });
 
// app.get('/deaths', function(req, res){
// 	db.query("SELECT * FROM deaths", function (err, result) {
// 		if (err) throw err;
// 		console.log(result);
// 		res.render('deaths', { title: 'xyp', deathData: result});
// 	});
// });

// app.get('/graph', function(req, res){
// 	db.query("SELECT * FROM deaths", function (err, result) {
// 		if (err) throw err;
// 		console.log(result);
// 		res.render('graph', { title: 'graph', graphData: result});
// 	});
// });

// app.post('/addIncidents', function(req, res, next) {
// 	var beach = req.body.beach;
// 	var city = req.body.city;
// 	var email = req.body.email;
// 	var detail = req.body.detail;
// 	var sql = `INSERT INTO incidents (beach, city, email, detail, reported_at) VALUES ("${beach}", "${city}", "${email}", "${detail}", NOW())`;
// 	db.query(sql, function(err, result) {
// 		if (err) throw err;
// 		console.log('record inserted');
// 		res.render('addIncidents');
// 	});
// });

//login 


app.listen(3000);
console.log('Node app is running on port 3000');