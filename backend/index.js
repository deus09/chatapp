const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
var mysql = require('mysql');
var bodyparser = require('body-parser');
const port = 3000;

app.use(bodyparser.json());
app.use(express.json());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'users',
})


/*
users database contains 4 tables
1) Storage
=> This table will be used while origin tracing, i.e, to trace the source of message.
=> This table has four columns:
        i) sender (datatype varchar(250))
        ii) receiver (datatype varchar(250))
        iii) message (datatype varchar(250))
        iv) timestamp (datatype timestamp(6))

2) user
=> This table contains details about user.
=> This table has four columns:
        i) firstname (datatype varchar(250))
        ii) lastname (datatype varchar(250))
        iii) phonenumber (datatype varchar(250))
        iv) password (datatype varchar(250))
        
3) friends
=> This table contains details about friends.
=> This table has three columns:
        i) user (datatype varchar(250))
        ii) name (datatype varchar(250))
        iii) friend (datatype varchar(250))

4) message
=> This table contains details about pending messages.
=> This table has three columns:
        i) sender (datatype varchar(250))
        ii) receiver (datatype varchar(250))
        iii) message (datatype varchar(250))
*/


users = [];

io.on("connection", function (socket) {
  socket.on("user_connected", function(data) {
    users[data.sender] = socket.id;
  });
  
  socket.on("send_message", function(data) {
    var socketId = users[data.receiver];
    io.to(socketId).emit("new_message", data);
  });
  socket.on("Disconnect",function(data){
    delete users[data.sender];
  })
})

app.post('/login', function (req, res, next) {
  var phonenumber = req.body.phonenumber;
  var password = req.body.password;

  connection.query(
    "SELECT * FROM user WHERE phonenumber = ? AND password = ?",
    [phonenumber, password], function (err, row, field) {
      if (err) {
        console.log(err);
        res.send({ success: false, message: 'Could not connect to database' });
      }
      if (row.length > 0) {
        res.send({ success: true, phonenumber: row[0].phonenumber });
      }
      else {
        res.send({ success: false, message: 'User not found' });
      }
    });
});

app.post('/checkforexistinguser', function (req, res, next) {
  var phonenumber = req.body.Phonenumber;
  connection.query(
    "SELECT * FROM user WHERE phonenumber = ?",
    [phonenumber], function (err, row, field) {
      if (err) {
        console.log(err);
        res.send({ success: false, message: 'Could not connect to database' });
      }
      if (row.length > 0) {
        res.send({ success: false, message: 'User already exists' });
      }
      else {
        res.send({ success: true });
      }
    });
});

app.post('/register', function (req, res, next) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var Phonenumber = req.body.Phonenumber;
  var password = req.body.password;
  var sql = "INSERT INTO user VALUES('" + firstname + "','" + lastname + "','" + Phonenumber + "','" + password + "')";
  connection.query(sql, function (err) {
    if (err) {
      console.log(err);
      res.send({ success: false, message: err });
    }
    res.send({ success: true });
  });
});

app.post('/alreadyfriend', function (req, res, next) {
  var phonenumber = req.body.phonenumber;
  var usernumber = req.body.usernumber;
  connection.query(
    "SELECT * FROM friends WHERE user = ? AND friend = ?",
    [usernumber, phonenumber], function (err, row, field) {
      if (err) {
        console.log(err);
        res.send({ success: false, message: 'Could not connect to database' });
      }
      if (row.length > 0) {
        res.send({ success: false, message: 'Already a friend' });
      }
      else {
        res.send({ success: true });
      }
    });
});

app.post('/addfriend', function (req, res, next) {
  var phonenumber = req.body.phonenumber;
  var usernumber = req.body.usernumber;
  var name = req.body.name;
  var sql = "INSERT INTO friends VALUES('" + usernumber + "','" + name + "','" + phonenumber + "')";
  connection.query(sql, function (err) {
    if (err) {
      console.log(err);
      res.send({ success: false, message: 'could not connect to database' });
    }
    res.send({ success: true });
  });
});

app.post('/getfriends', function (req, res, next) {
  var user = req.body.usernumber;
  connection.query(
    "SELECT * FROM friends WHERE user = " + user, function (err, row, field) {
      if (err) {
        console.log(err);
        res.send({ success: false, message: 'Could not connect to database' });
      }
      res.send({ success: true, friend: row })
    });
});

app.post('/savemessage', function (req, res, next) {
  var sql = "INSERT INTO messages VALUES('" + req.body.sender + "','" + req.body.receiver + "','" + req.body.message + "')";
  connection.query(sql, function (err) {
    if (err) {
      console.log(err);
      res.send({ success: false, message: err });
    }
    res.send({ success: true });
  });
});

app.post('/getmessages', function (req, res, next) {
  sender = req.body.sender;
  receiver = req.body.receiver;
  connection.query(
    "SELECT * FROM messages WHERE receiver = ?",
    [receiver], function (err, row, field) {
      if (err) {
        console.log(err);
        res.send({ success: false, message: 'Could not connect to database' });
      }
      res.send({ success: true, message: row });
    });
});

app.post('/deletemessages', function (req, res, next) {
  sender = req.body.sender;
  receiver = req.body.receiver;
  connection.query(
    "DELETE FROM messages WHERE receiver = ?",
    [receiver], function (err, row, field) {
      if (err) {
        console.log(err);
        res.send({ success: false, message: 'Could not connect to database' });
      }
      res.send({success: true});
    });
});

app.post('/isReceiverOnline', function (req, res, next) {
  receiver = req.body.receiver;
  if(users[receiver] !== undefined)
  {
    res.send({success: true});
  }
  else
  {
    res.send({success: false});
  }
});

app.post('/permenentStorage', function (req, res, next) {
  var sql = "INSERT INTO storage VALUES('" + req.body.sender + "','" + req.body.receiver + "','" + req.body.message + "', now(6))";
  connection.query(sql, function (err) {
    if (err) {
      console.log(err);
      res.send({ success: false, message: err });
    }
    res.send({ success: true });
  });
});

server.listen(port, () => console.log('server is running on port: ' + port));

