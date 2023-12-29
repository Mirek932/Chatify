var mySelect = document.getElementById('Emojies');
var newOption;
var socket = io();
var emojRange = [
  [128513, 128591], [9986, 10160], [128640, 128704]
];
//inside emojRange 2d array , define range arrays (start number,end number).
//1st array : Emoticons icons
//2nd range : Dingbats.
//3rd range : Transport and map symbols
mySelect.onload = new function(){
    append_Emojies();
};
function append_Emojies()
{
    for (var i = 0; i < emojRange.length; i++) {
      var range = emojRange[i];
      for (var x = range[0]; x < range[1]; x++) {
    
        newOption = document.createElement('button');
        newOption.value = x;
        newOption.style = "background-color: rgb(0 0 0 / 0%); border: 0px;";
        newOption.className = "Emoji";
        newOption.innerHTML = "&#" + x + ";"; 
        newOption.addEventListener('click', (t)=>{
            if(document.getElementById('input').value.length <= 500)
            {
                document.getElementById('input').setAttribute('emojies' , (parseInt(document.getElementById('input').getAttribute('emojies')) + 1));
                document.getElementById('input').value += t.target.innerHTML;
            } else {
                var message = document.createElement('li');
                message.setAttribute('class', 'message');
                message.innerText = "You cant put more Emojis in the Chat (Limit reached) [Only you can see this message and it will be deleted after reloading the webside.]";

                document.getElementById('messages').appendChild(message);
            }
            document.getElementById('input').focus();
            document.getElementById('form').addEventListener('submit', ()=> {
                document.getElementById('input').setAttribute('emojies', 0);
            });
        });
        mySelect.appendChild(newOption);
      }
    
    }
}