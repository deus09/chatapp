var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'abcdef1234',
  database: 'users',
})

router.post('/login', function(req, res, next) {
  var phonenumber = req.body.phonenumber;
  var password = req.body.password;
  
  connection.query(
    "SELECT * FROM user WHERE phonenumber = ? AND password = ?",
    [phonenumber, password], function(err, row, field){
      if(err){
        console.log(err);
        res.send({success : false, message: 'Could not connect to database'});
      }
      if(row.length > 0){
        res.send({success : true, phonenumber: row[0].phonenumber});
      }
      else{
        res.send({success : false, message: 'User not found'});
      }
    });
});

router.post('/checkforexistinguser', function(req, res, next) {
  var phonenumber = req.body.Phonenumber;
  connection.query(
    "SELECT * FROM user WHERE phonenumber = ?",
    [phonenumber], function(err, row, field){
      if(err){
        console.log(err);
        res.send({success : false, message: 'Could not connect to database'});
      }
      if(row.length > 0){
        res.send({success : false, message: 'User already exists'});
      }
      else{
        res.send({success : true});
      }
    });
});

router.post('/register', function(req, res, next) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var Phonenumber = req.body.Phonenumber;
  var password = req.body.password;
  var sql = "INSERT INTO user VALUES('" + firstname + "','" + lastname + "','" + Phonenumber + "','" + password + "')";
  connection.query(sql, function(err){
    if(err)
    {
      console.log(err);
      res.send({success: false , message: err});
    }
      res.send({success: true});
  });
});

router.post('/addfriend', function(req, res, next) {
  var phonenumber = req.body.phonenumber;
  var usernumber = req.body.usernumber;
    var sql = "INSERT INTO friendlist VALUES('" + usernumber + "','" + phonenumber + "')";
    connection.query(sql, function(err){
    if(err)
    {
      console.log(err);
      res.send({success: false});
    }
      res.send({success: true});
  });
});

module.exports = router;
