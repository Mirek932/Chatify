const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server, RemoteSocket } = require("socket.io");
const io = new Server(server);
var path = require("path");
var Usernames = [];
const { writeFile } = require('fs/promises');
var fs = require ('fs'); 

var modUserIds = ['f7Fn2NZH3'];
var rooms = [];
var rooms_id = [];

let messages = require("./message.json")

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
  socket.emit('get messages', messages);
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id, " || " + socket.username);
  });
});

io.on('send Image', (image) => {
  console.log("Sending image... " + image);
  socket.emit('image', image); // image should be a buffer
});


io.on('connect', (socket) => {
//  socket.emit('reload');
});

io.on('connection', (socket) => {
  socket.on('Check MPS', (client_ID)=>{
    io.emit('send MPS', client_ID);
  });
  socket.on('chat message', (msg, ID, username, Save) => {
    io.emit('chat message', msg, ID, username);
    
        if(Save == undefined)
          Save = true;
    console.log("Chat Message: " + msg + " with id: " + ID + " From user: " + username + " shuld save? " + Save);

    //Erstelle Message
    let formData = {
      message: msg,
      room: ID,
      username: username,
      timeStamp: date().getFullYear() + "." + date().getMonth() + "." + (date().getDay() + 1) +  " | " + date().getHours() + ":" + date().getMinutes()
  } 

  messages.push(formData);
    
  if(Save)
    //JSON.stringify(msg)
    fs.writeFile('./message.json', JSON.stringify(messages, null, 4), err =>{ 
      if(err) throw err 

      console.log("Done writting text file");
    }); 
  });
  socket.on('response', (ID_, client_ID)=>{
    io.emit('response', ID_, client_ID);
  });
  socket.on('unresponse', (ID_, client_ID)=>{
    io.emit('unresponse', ID_, client_ID);
  });
  socket.on('create room', (room_id, name) => {
    console.log("A new room has been brodcasted. ID: " + room_id + " Name: " + name);
    io.emit('append Room', room_id, name);
    rooms.push(name);
    rooms_id.push(room_id);
  });
  socket.on("upload", (file) => {
    console.log(file); // <Buffer 25 50 44 ...>

    // save the content to the disk, for example
    writeFile("/tmp/upload", file, (err) => {
        console.error("Cant Upload File: " + err);
    });
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

var date  = function () {
  return new Date();
};