var date = () => new Date();
var finalMinutes = 0;

var sleepTime = () => {
    var cooldown = localStorage.getItem('letter cooldown');
    if(cooldown == null || cooldown == undefined)
     return localStorage.setItem('letter cooldown', 0);
    else
     return localStorage.getItem("letter cooldown");
}

var tickInterval = setInterval(tick, 1000);

function tick()
{
    var getItem = localStorage.getItem('letter cooldown');
    console.log(getItem - date().getMinutes())
    if(getItem > date().getMinutes())
     finalMinutes = (getItem - date().getMinutes());
    document.getElementById('letter cooldown').textContent = finalMinutes;
    if(getItem == NaN || getItem == "NaN")
    {
        alert("Something went wrong :/ \n \n code: 6527G98X4F3 \n\n\n\n Try to fix bug... press OK to continue");
        var fixedGetItem = localStorage.getItem('letter cooldown');
        try {
            localStorage.setItem('letter cooldown', new Date().getMinutes() + 10);
        } catch (error) {
            alert("Codnt Fix bug: \n\n" + error + " \n\n\n if this message pops up twice please restart your browser/PC");
        }
    }
}//Change to real time with date