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
		// console.log('user inserted');
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
	// console.log(sql);//vevify above code excuted

	db.query(sql, function(err, result) {
		if (err) throw err;
		if (result.length>0) {
			// console.log(result);//verify above code excuted

			var username = result[0].user_name;
			req.session.username = username;
			res.render('login',{username: username });
		} else {
			// console.log("fiald");
			res.render('login', { loginFailed: true, statusMSG: 'Login Failed. Please check your email and password.'});
		  }
	});
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
		
	res.render('jobAssignment', { userData: result });
});
});

app.post('/jobAssignment', function(req, res, next) {
//   var job_id=req.body.JobCode;
  var job_description_code=req.body.JobCode;
  var team_leader =req.body.TeamLeader;
  var team_member=req.body.TeamMember;
  var tools =req.body.tools;
  var time_starts=req.body.TimeStarts;
  var time_ends =req.body.TimeEnds;
  var Materials =req.body.Materials;
  var task_1=req.body.task1;
  var task_2 =req.body.task2;
  var task_3=req.body.task3;
	console.log(team_member);
	console.log(tools);
	console.log(Materials);
	var sql = `INSERT INTO job_assignment (job_description_code,team_leader,team_member,tools,time_starts,time_ends,Materials,task_1,task_2,task_3) VALUES ("${job_description_code}","${team_leader}","${team_member}","${tools}","${time_starts}","${time_ends}","${Materials}","${task_1}","${task_2}","${task_3}")`;
	console.log(sql);
	db.query(sql, function(err, result) {
 		if (err) throw err;
		console.log('job inserted');
		res.render('jobAssignment', { createStatus: true, statusMSG: 'Successful creation of job Assignmen'});
		 
	});
	
});


//     });
// });

app.get('/siteDiary', function(req, res, next) {
	
	db.query("SELECT * FROM job_assignment;", function (err, result) {
				if (err) throw err;
				console.log(result);
	res.render('siteDiary', { jobData: result });
				
	res.render('siteDiary', { jobData: result,selected:false });
	

});
});

        // Second SQL query
        db.query(`SELECT * FROM job_assignment where job_id="${selectedJobId}";`, function (err, result2) {
            if (err) throw err;

            console.log('jobData:', result1);
            console.log('selectedData:', result2);

            res.render('siteDiary', {
               // selectedData: result2, 
                selected: true, 
				jobData: result1, 
            });
        });
    });
});











app.listen(3000);
console.log('Node app is running on port 3000');
