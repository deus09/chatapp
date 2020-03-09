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
  password: 'abcdef1234',
  database: 'users',
})

users = [];

io.on("connection", function (socket) {
  console.log('Connected   ' + socket.id);
  socket.on("user connected", function(data) {
    users[data.sender] = socket.id;
    console.log(data.sender);
  });
  
  socket.on("send message", data => {
    console.log(data);
    var socketId = users[data.receiver];
    console.log(data.receiver + " " + socketId);
    io.to(socketId).emit("new message", data);
  });
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
  var sql = "INSERT INTO friends VALUES('" + usernumber + "','" + phonenumber + "')";
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
    "SELECT friend FROM friends WHERE user = " + user, function (err, row, field) {
      if (err) {
        console.log(err);
        res.send({ success: false, message: 'Could not connect to database' });
      }
      res.send({ success: true, friend: row })
    });
});

app.post('/savemessage', function (req, res, next) {
  console.log(req.body.sender);
  console.log(req.body.receiver);
  console.log(req.body.message);
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
    "SELECT message FROM messages WHERE sender = " + sender + " AND receiver = " + receiver, function (err, row, field) {
      if (err) {
        console.log(err);
        res.send({ success: false, message: 'Could not connect to database' });
      }
      console.log(row);
      res.send({ success: true, message: row })
    });
});

app.post('/isReceiverOnline', function (req, res, next) {
  receiver = req.body.receiver;
  console.log(users);
  console.log("Nkajdhasj " + receiver);
  if(users[receiver] !== undefined)
  {
    res.send({success: true});
    console.log("Hai");
  }
  else
  {
    res.send({success: false});
    console.log("Nahi hai");
  }
});

server.listen(port, () => console.log('server is running on port: ' + port));

