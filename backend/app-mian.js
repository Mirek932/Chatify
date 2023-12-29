const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server, RemoteSocket } = require("socket.io");
const io = new Server(server);
var path = require("path");

var Usernames = [];

var modUserIds = ['f7Fn2NZH3'];
var rooms = [];
var rooms_id = [];

app.use(express.static(path.join(__dirname, 'public')));


//Bekomme die HTML File
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
//Fall jemand bei IO connected
io.on('connection', (socket) => {
  for (var i = 0; i < rooms.length; i++) {
    socket.emit('append Room', rooms_id[i], rooms[i]);
  }
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('send Image', (image) => {
  console.log("Sending image... " + image);
  socket.emit('image', image); // image should be a buffer
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg, ID, username) => {
    io.emit('chat message', msg, ID, username);
    console.log("Chat Message: " + msg + " with id: " + ID + " From user: " + username);
  });
  socket.on('create room', (room_id, name) => {
    console.log("A new room has been brodcasted. ID: " + room_id + " Name: " + name);
    io.emit('append Room', room_id, name);
    rooms.push(name);
    rooms_id.push(room_id);
  });
  socket.on('delete Room', (Room_ID) => {
    for(var i = 0; i < rooms_id.length; i++)
    {
      if(rooms_id[i] == Room_ID)
      {
        socket.emit("chat message", "Deleting Room... This may take some while", Room_ID, "Server");
        rooms_id.splice(i, 1);
        rooms.splice(i, 1);
        console.log(rooms_id + " // " + i);
        console.log(rooms);
        socket.emit("chat message", "Success Delets room! This message shuld you not see ", Room_ID, "ERROR");
        io.emit('reload');
        break;
      }
    }
    socket.emit('chat message', "Cant delete Room: Cant find Room", Room_ID, "Server");
  });
  socket.on('change username confirm', (newName, oldName, client_ID) => {
    var PrototyeNewName = newName;
    console.log("Checking for new username: " + newName);
    for (var i = 0; i < Usernames.length; i++) {
      if (Usernames[i] == oldName) {
        console.log(Usernames + " || " + i);
        Usernames.splice(i, 1);
        console.log(Usernames);
        console.log("Delets Username: " + Usernames[i]);
      }
      if (PrototyeNewName == Usernames[i]) {
        PrototyeNewName = oldName;
        console.log("Failed to change username: Username already exists");
        console.log(Usernames);
        break;
      }
    }
    console.log("Changing username to " + PrototyeNewName);
    Usernames.push(PrototyeNewName);
    io.emit('change username', PrototyeNewName, client_ID);
  });
  socket.on('join room', (room_id) => {
    console.log("Someone joined an room ID: " + room_id);
  });
  socket.on('canGetModerator', (id, client_id) => {
    console.log(id + " trys to get Admin");
    for (var i = 0; i < modUserIds.length; i++) {
      if (modUserIds[i] == id) {
        console.log("user is an Admin!");
        io.emit('has Admin', client_id);
      }
    }
  });
});

server.listen(3000, () => {
  console.log("http://localhost:3000");
});