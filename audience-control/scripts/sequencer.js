var who = "sequencer"
var room = findGetParameter("room") || "spacebarman";
var socket = io("", {query:{room: room, who:who}});


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

var table = document.getElementById("playlist");
playlist.forEach( item => {
  let row = table.insertRow();
  let pc = row.insertCell(0);
  pc.innerHTML = item.pc;
  let name = row.insertCell(1);
  name.innerHTML = item.name;
  name.classList.add("song");
  name.setAttribute("pc", item.pc);
  name.innerHTML = item.name;
  let pcSend = row.insertCell(2);
  pcSend.innerHTML = '<button class="pc-send" pc=' + item.pc + '>Send PC</button>';
});

document.querySelectorAll(".pc-send").forEach(item => {
  item.addEventListener("click", function() {
    var pc = this.getAttribute("pc");
    currentPC = pc;
    sendToDevices([0xC0, pc]);
    document.querySelectorAll(".song").forEach(song => {
      if(song.getAttribute("pc") == pc)
          song.style.backgroundColor = "blue";
      else
          song.style.backgroundColor = "transparent";
    });
  })
});


document.querySelectorAll(".test-devices").forEach(item => {
  item.addEventListener("click", function() {
    var note = this.getAttribute("note");
    console.log("sending  " + note);
    sendToDevices([0x90, note, 127]);
  });
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
