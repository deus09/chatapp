// const express = require('express');
// const router = express.Router();
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io').listen(server);
// const port = 3000;

var express = require('express');
var router = express.Router();

// io.on('connection', socket => {
//   console.log('a user is connected');
// })



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
