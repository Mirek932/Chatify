//Client Side
var socket = io();

var user_ID = "f7Fn2NZH3";
var ID = 0;

var client_ID = Math.random(0) * 10000000;

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var isMod = false;

var Username = "New user";
try {
   Username = localStorage.getItem('username');
} catch (error) {
   Username = "new user";
}
Update_Uername();

var form_room_create = document.getElementById('room_create');
var input_room_create = document.getElementById('room_input_create');
var input_room_name_create = document.getElementById('room_name_create');

var form_room_join = document.getElementById('room_join');
var input_room_join = document.getElementById('room_input_join');

var form_username_change = document.getElementById('UsernameChange');

function ChangeUsername(newName) {
  socket.emit('change username confirm', newName, Username, client_ID);
}

function Update_Uername()
{
  document.getElementById('username').innerText = Username;
}

function CheckForAdmin() {
  socket.emit('canGetModerator', user_ID,client_ID);
}


form_username_change.addEventListener('submit', function (e) {
  e.preventDefault();
  ChangeUsername(document.getElementById('username_new').value);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value, ID, Username);
    input.value = '';
  }
});

//CREATE ROOM
form_room_create.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input_room_create.value) {
    socket.emit('create room', input_room_create.value, input_room_name_create.value);
    input_room_join.value = input_room_create.value;
    input_room_create.value = '';
  }
});

//BROADCAST ROOM
form_room_join.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input_room_join.value) {
    socket.emit('join room', input_room_join.value);
    ID = input_room_join.value;
    input_room_join.value = '';
  }
});
socket.on('append Room', function (room_ID, name, username_) {
  //<img src="icons/Rooms/delete.svg" alt="Delete">
  var MainDiv = document.createElement('div');
  MainDiv.setAttribute('code', room_ID);
  var JoinButton = document.createElement('img');
  JoinButton.addEventListener('click', () => {
    socket.emit('chat message', Username + " Joined the Room", room_ID, "Server");
    ID = room_ID;
    socket.emit('join room', room_ID);
  });
  var DeleteButton = document.createElement('img');
  DeleteButton.addEventListener('click', () => {
    socket.emit('chat message', "Deletes room", room_ID, "Server");
    socket.emit('delete Room', room_ID)
  });
  DeleteButton.setAttribute('src', 'icons/Rooms/delete.svg');
  DeleteButton.setAttribute('alt', 'Join');
  DeleteButton.setAttribute('class', 'image');
  JoinButton.setAttribute('src', 'icons/Rooms/join.svg');
  JoinButton.setAttribute('alt', 'Join');
  JoinButton.setAttribute('class', 'image');
  var child = document.createElement('p');
  child.textContent = name;

  MainDiv.className = "room_class";
  MainDiv.appendChild(child);
  MainDiv.appendChild(JoinButton);
  MainDiv.appendChild(DeleteButton);

  document.getElementById('appendRooms').appendChild(MainDiv);
});
socket.on('change username', function (newName, client_id__) {
  if(client_ID == client_id__)
  {
      Username = newName;
      localStorage.setItem('username', Username);
      Update_Uername();
  }
});



var date  = function () {
  return new Date();
};
socket.on('chat message', function (msg, ID_, Sender_Username) {
  if (ID == ID_) {
    var item = document.createElement('li');
    item.setAttribute('class', "message");
    item.textContent = date().getFullYear() + "." + date().getMonth() + "." + (date().getDay() + 1) +  " | " + date().getHours() + ":" + date().getMinutes() + " <" + Sender_Username + "> " + msg;
    messages.appendChild(item);
    document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight);
  }
});
socket.on('reload', function (){
  location.reload();
});
socket.on('has Admin', function (client_ID_) {
  if(client_ID == client_ID_)
  {
    isMod = true;
    socket.emit('chat message', "Someone got Admin", ID, "Server");
  }
});


