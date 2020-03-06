const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = 3000;
const usersRouter = require('./routes/users');

app.use(express.json());
app.use('/users', usersRouter);

io.on("connection", socket => {
    socket.on("chat message",msg =>{
        console.log(msg);
        io.emit("chat message",msg);
    })
})

server.listen(port , () => console.log('server is running on port: ' + port));