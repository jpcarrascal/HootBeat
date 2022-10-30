var who = findGetParameter("who");
var socket = io("", {query:{room: "spacebarman", who:who}});

document.getElementById("photo").classList.add(who);

var mySocketID;
socket.on("connect", () => {
  console.log("Connected, my socketid:" + socket.id);
  mySocketID = socket.id;
});

var colorSelected = false;
var color;
document.querySelectorAll(".color-cell").forEach(elem => {
        elem.addEventListener("click", function(e){
            colorSelected = true;
            var filter = elem.getAttribute("filter");
            color = elem.getAttribute("color");
            socket.emit('set-color', { who: who, color: color } );
            filter += " brightness(1.2)";
            document.getElementById("photo").style.filter = filter;
            document.getElementById("go").style.backgroundColor = color;
            document.getElementById("go").style.visibility = "visible";
            document.getElementById("veil").style.display = "none";
            document.body.style.backgroundColor = color;
            //document.getElementById("left-eye").style.backgroundColor = color;
            //document.getElementById("right-eye").style.backgroundColor = color;
        });
    }
);

document.getElementById("go").addEventListener("click", function(e){
    var who = "jp";
    if(colorSelected) {
        socket.emit('flash', { who: who, color: color } );
        document.getElementById("photo").classList.add("flash");
        setTimeout(function(){
            document.getElementById("photo").classList.remove("flash");
        }
        ,200);
    }
});

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
  }