var socket = io();

function send_image(image)
{
    alert(image.toString("base64"));
    socket.emit('send Image', image.toString("base64"));
}

socket.on('image', image => {
    // create image with
    const img = new Image();
    // change image type to whatever you use, or detect it in the backend 
    // and send it if you support multiple extensions
    img.src = `data:image/jpg;base64,${image}`; 
    // Insert it into the DOM

    alert("Got image");

    document.getElementById('messages').appendChild(img);
});