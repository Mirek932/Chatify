var socket = io();
var messages = document.getElementById("messages");

const anim = document.getElementById('letter cooldown');

//anim.addEventListener('animationend', () => {
//    anim.style = 'color: red; font-weight: bolder; font-size: medium;';
//});
//anim.addEventListener('animationcancel', () => {
//    anim.style = 'color: red; font-weight: bolder; font-size: medium;';
//});


//document.getElementById('form').addEventListener('submit', function (e) {
//    e.preventDefault();
//    if(sleepTime() <= 1)
//    {
//        var msg = document.getElementById("input");
//        var title = document.getElementById('title');
//        socket.emit("send letter", msg.value, title.value);
//        title.value = "";
//        msg.value = "";
//        localStorage.setItem('letter cooldown', (date().getMinutes() + 10));
//    } else {
//        var info = document.getElementById('letter cooldown');
//        info.animation
//        info.style = ('animation-name: bigger; animation-duration: 1s; color: red; font-weight: bolder; font-size: medium;');
//        console.warn("Failed to post: 435243");
//    }
//});
socket.on('append profile', (name, descript) => {
    var item = document.createElement('li');
     var center = document.createElement('center');
      var header = document.createElement('h1');
      var description = document.createElement('p');
    
    header.textContent = name;
    description.textContent = descript;

    center.appendChild(header);
    center.appendChild(description);
    item.appendChild(center);
    item.setAttribute('class', "message");
    item.setAttribute('style', "margin-bottom: 1%; background-color: rgb(6, 0, 54); box-shadow: 3px 3px 30px black; border: 10px rgb(17, 0, 255) double; margin-left: 0%;");
    description.setAttribute('style', 'text-wrap: wrap; white-space: pre-line;');
    messages.appendChild(item);
});
socket.on('delete Profiles', () => {
    messages.innerHTML = "";
});
function info()
{
    alert("I can show you some tips and tricks that cloud help you but first i can tell you Why it is loading so long and how to fix it \n \n the main problem is, that the server isnt responsing \n \n #1 The Server is shut down || Fix: nothing :( \n #2 The Server is restarting || Fix: wait \n #3 You have a bad internet connection || Fix: wait \n #4 Server problems || Fix: contact the support \n #5 Your browser is outdated || Fix: download a new / update your | browser \n #6 me = bad coding || Fix: wait for update :)");
}