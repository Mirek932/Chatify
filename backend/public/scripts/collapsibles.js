var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", collapsible.bind( null, i));
}

function collapsible(index) {
    var content = document.getElementsByName(coll[index].getAttribute('col'));
    for(var i = 0; i < content.length; i++)
    {
        if (content[i].style.display === "block") {
          content[i].style.display = "none";
        } else {
          content[i].style.display = "block";
        }
    }
    var anti_content = document.getElementsByName(coll[index].getAttribute('anti_col'));
    for(var i = 0; i < anti_content.length; i++)
    {
        if (anti_content[i].style.display === "block") {
            anti_content[i].style.display = "none";
        } else {
            anti_content[i].style.display = "block";
        }
    }
}