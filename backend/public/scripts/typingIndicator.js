var socket = io();

const isUserTyping = function ()
{
    if(document.getElementById('input').value != '') {
        return true;
    } else
    {
        return false;
    }
}

var LooadInterval = setInterval(Loop, 100);

var unrespnonsed = false;

function Loop()
{
  if(isUserTyping())
  {
    unrespnonsed = true;
    socket.emit('response', ID, client_ID);
  } else {
    if(unrespnonsed)
    {
        unrespnonsed = false;
        socket.emit('unresponse', ID, client_ID);
    }
  }
}

document.onload = new function() {
    document.getElementById('response').innerText = "";
};

socket.on('response', (ID_, client_ID_) => { //IS NOT ACUAL FUNCTION MAY NOT WORK
    if(ID_ == ID && client_ID_ != client_ID)
    {
        document.getElementById('response').innerText = "Someone is responsing...";
    }
});

socket.on('unresponse', (ID_, client_ID_) => { //IS NOT ACUAL FUNCTION MAY NOT WORK
    if(ID_ == ID && client_ID_ != client_ID)
    {
        document.getElementById('response').innerText = "";
    }
});