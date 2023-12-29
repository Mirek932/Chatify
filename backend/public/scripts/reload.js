function reload(id){
    var container = document.getElementById(id);
    var content = container.innerHTML;
    container.innerHTML= content; 
    container.style = "color: red; font-weight: bolder; font-size: medium;";

   //this line is to watch the result in console , you can remove it later	
    console.log("Refreshed", id); 
}