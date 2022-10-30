var who = "sequencer"
var socket = io("", {query:{room: "spacebarman", who:who}});

var mySocketID;
socket.on("connect", () => {
  console.log("Connected, my socketid:" + socket.id);
  mySocketID = socket.id;
});

socket.on('flash', function(msg) {
  audienceHandler('flash', msg);
  var id = "color-" + msg.who;
  console.log(msg)
  document.getElementById(id).classList.add("flash-border");
  setTimeout(function(){
    document.getElementById(id).classList.remove("flash-border");
  }
  ,200);
});

socket.on('set-color', function(msg) {
  audienceHandler('set-color', msg);
  var id = "color-" + msg.who;
  document.getElementById(id).style.backgroundColor = msg.color;
  console.log(msg.who + " set to " + msg.color)
});