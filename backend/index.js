const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = 3000;
const usersRouter = require('./routes/users');
users = {};

app.use(express.json());
app.use('/users', usersRouter);

io.on("connection", function(socket){
    console.log('Connected' + socket.id);
})

server.listen(port , () => console.log('server is running on port: ' + port));

