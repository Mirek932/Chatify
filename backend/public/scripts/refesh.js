var socket = io();

socket.on('redirect', function (dir) {
    if(!window.location.pathname.includes(dir))
        window.location.pathname = dir;
  });