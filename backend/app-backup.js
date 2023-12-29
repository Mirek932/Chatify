const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server, RemoteSocket } = require("socket.io");
const io = new Server(server);
var path = require("path");
const { writeFile } = require('fs/promises');
var fs = require('fs');
var colors = require("colors/safe");

var modUserIds = ['f7Fn2NZH3'];
var rooms_id = [];

var rooms = require("./storage/rooms.json");
var users = require("./storage/profile/user.json");
let messages = require("./storage/message.json")

app.use(express.static(path.join(__dirname, 'public')));

//Bekomme die HTML File
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Fall jemand bei IO connected
io.on('connection', (socket) => {
  
  socket.emit("delete Room");
  for (var i = 0; i < rooms.length; i++) {
    socket.emit('append Room', rooms[i].id, rooms[i].name);
  }
  
  socket.on("connect_error", (err) => {
    console.error(`connect_error due to ${err.message}`);
  });

  socket.emit('get messages', messages);
  if(socket.handshake.query.username == undefined)
    console.log(colors.black("(ID: " + socket.id + ")"));
  else
    console.log(colors.yellow(socket.handshake.query.username + ' connected') + colors.black(' (ID: ' + socket.id + ")"));
  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id, " || " + socket.username);
  });
});

io.on('send Image', (image) => {
  console.log("Sending image... " + image);
  socket.emit('image', image); // image should be a buffer
});

function deleteDict(dict, point) {
  var newDict = [];
  for(var i = 0; i < dict.length; i++) {
    console.log(dict[i]);
    if(i != point) {
    console.log(dict[i]);
    newDict.push(dict[i]);
    }
  }
  if(newDict == undefined || newDict == null || newDict == "")
  {
    return [];
  } else 
  {
    console.log(colors.america("the new Dict is: " + JSON.stringify(newDict, null, 4)));
    return newDict;
  }
}

function DictToArray(dict, f)
{
  var newArray = [];
  for(var i = 0; i < dict.length; dict++)
  {
    newArray.push(dict[i].f);
  }
  return newArray;
}

function overwriteFile(dir, dict, output, error)
{
  fs.writeFile(dir, JSON.stringify(dict, null, 4), err => {
     if(error && err) console.error(error + "\n" + err);

     console.log(output);
  });
}

io.on('connect', (socket) => {
  //  socket.emit('reload');
});

io.on('connection', (socket) => {
  socket.on('Check MPS', (client_ID) => {
    io.emit('send MPS', client_ID);
  });
  socket.on('chat message', (msg, ID, username, Save) => {
    io.emit('chat message', msg, ID, username);

    if (Save == undefined)
      Save = true;
    console.log(colors.green("Chat Message: ") + colors.bgMagenta(msg) + colors.green(" From user: ") + colors.bgYellow(username) + colors.gray(" (ID: " + socket.id + ") ")  + colors.green("shuld save? ") + colors.blue(Save));

    //Erstelle Message
    let formData = {
      message: msg,
      room: ID,
      username: username,
      timeStamp: date().getFullYear() + "." + date().getMonth() + "." + (date().getDay() + 1) + " | " + date().getHours() + ":" + date().getMinutes()
    }

    messages.push(formData);

    if (Save)
      //JSON.stringify(msg)
    overwriteFile('./storage/message.json', messages, "Done writting text file", "an Error occoued: ");
  });
  socket.on('response', (ID_, client_ID) => {
    io.emit('response', ID_, client_ID);
  });
  socket.on('unresponse', (ID_, client_ID) => {
    io.emit('unresponse', ID_, client_ID);
  });
  socket.on('create room', (room_id, name) => {
    console.log(colors.rainbow("A new room has been brodcasted.") + colors.black(" Room ID: " + room_id + " || Name: " + name));
    io.emit('append Room', room_id, name);

    var newRoom = {
      "name": name,
      "id": room_id
    };
    rooms.push(newRoom);
    overwriteFile('./storage/rooms.json', rooms, "Done writting text file", "An error occoured ");
  });
  socket.on("upload", (file) => {
    console.log(file); // <Buffer 25 50 44 ...>

    // save the content to the disk, for example
  });
  socket.on('delete Room', (Room_ID) => {
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].id == Room_ID) {
        socket.emit("chat message", "Deleting Room... This may take some while", Room_ID, "Server",  false);
        rooms = deleteDict(rooms, i);
        overwriteFile('./storage/rooms.json', rooms, "Done writting text file", "An error occoured: ");
        //console.log(colors.red(rooms[i].name + " // " + i));
        //console.log(colors.red(rooms[i]));
        socket.emit("chat message", "Success Delets room! This message shuld you not see ", Room_ID, "ERROR", false);
        io.emit('reload');
        break;
      }
    }
    socket.emit('chat message', "Cant delete Room: Cant find Room", Room_ID, "Server");
  });
  socket.on('change username confirm', (newName, oldName, client_ID, description) => {
    var PrototyeNewName = newName;
    console.log("Checking for new username: " + newName);
    for (var i = 0; i < users.length; i++) {
      console.warn(PrototyeNewName + " == " +users[i].name);
      if (PrototyeNewName == users[i].name) {
        PrototyeNewName = oldName;
        console.log(colors.bgBlack(colors.gray("Failed to change username: Username already exists")));
        console.log(users);
        users[i].description = description;
        overwriteFile('./storage/user.json', users, "Done writting text file", "An error occoured:  ");
        return;
      }
      if (users[i].name == oldName) {
        console.log(users + " || " + i);
        users[i].description = description;
        users = deleteDict(users, i);
        //var UserDict ={
          //name: newUsername,
   //       description: "This is an demo Description",
     //     id: "DEMO",
       //   picture: "0.png"
        //};
        console.log("Delets User: " + users[i]);
        overwriteFile('./storage/profile/user.json', users, "Done writting text file", "An error occoured: ");
        console.log(users);
      }
    }
    console.log("Changing username to " + PrototyeNewName);
    var newUser = {
      name: PrototyeNewName,
      description: description,
      ID: "DEMO",
      picture: "0.png"
    }
    users.push(newUser);
    overwriteFile('./storage/profile/user.json', users, "Done writting text file 2", "An error occoured");
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
  console.log(colors.magenta("http://localhost:3000"));
});

var date = () => new Date();