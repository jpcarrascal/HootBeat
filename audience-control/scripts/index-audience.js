var who = findGetParameter("who");
var room = findGetParameter("room") || "spacebarman";
var socket = io("", {query:{session: room, role: "participant", initials: who, who: who}});

// The room only exists once the band's sequencer page has opened it;
// retry until then.
socket.on('session-unavailable', function() {
  setTimeout(function() { window.location.reload(true); }, 2000);
});

var photo = document.getElementById("photo");
photo.classList.add(who);

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
            document.getElementById("click-me-text").style.visibility = "visible";
            document.getElementById("veil").style.display = "none";
            document.body.style.backgroundColor = color;
            //document.getElementById("left-eye").style.backgroundColor = color;
            //document.getElementById("right-eye").style.backgroundColor = color;
        });
    }
);

document.getElementById("photo").addEventListener("click", function(e){
    if(colorSelected) {
        //document.getElementById("click-me").style.display = "none";
        socket.emit('flash', { who: who, color: color } );
        document.getElementById("photo").classList.add("flash");
        setTimeout(function(){
            document.getElementById("photo").classList.remove("flash");
        }
        ,200);
    }
});

socket.on('kick-out', function(msg) {
    if(msg.who == who) {
        console.log("Kicked out :(")
        document.location.replace("/out");
    }
});

socket.on('kick-all-out', function(msg) {
    console.log("Kicked everybody out (nothing personal)")
    document.location.replace("/out");
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