const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const chatRoutes = require("./routes/chat");
const contactRoutes = require('./routes/contact');
const app = express();

const http = require('http').Server(app);
const socket_io = require('socket.io');

const { PORT, MONGO_CONNECTION_STRING } = require('./config');

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/contact', contactRoutes);
app.use((error, req, res, next) => {
  console.log("APP.JS: ",error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGO_CONNECTION_STRING)
  .then(result => {
    console.log('MONGODB: CONNECTED');
    http.listen(PORT);
  })
  .catch(err => console.log(err));

let sockets = {};

var io = socket_io(http, {
  cors: {
    origin: "*",
  }
});
io.on('connection', socket => {

  socket.on('setUserSocket', data => {
    const { userId, username } = data;
    console.log(userId, username, socket.id);
    sockets[userId] = socket;
    console.log(sockets);
  });

  socket.on('sendMessage', data => {
    const{ message, reciever, sender } = data;
    console.log(data);
    sockets[reciever].emit('userMessage', {message, sender});
  });

  socket.on('disconnect', data => {
    for(const k in sockets){
      if (sockets[k].id === socket.id) {
        delete sockets[k];
        break;
      }
    }
    console.log('CLOSED: ' + socket.id);
    console.log(sockets);
  });
});
