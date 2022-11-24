var who = "sequencer"
var room = findGetParameter("room") || "spacebarman";
var socket = io("", {query:{room: room, who:who}});
var songsForGoggles = [];
var songsForTubes = [];

var mySocketID;
socket.on("connect", () => {
  console.log("Connected, my socketid:" + socket.id);
  mySocketID = socket.id;
});

socket.on('flash', function(msg) {
  audienceHandler('flash', msg);
  var id = "color-" + msg.who;
  console.log(msg);
  document.getElementById(id).classList.add("flash-border");
  setTimeout(function(){
    document.getElementById(id).classList.remove("flash-border");
  }
  ,300);
});

socket.on('set-color', function(msg) {
  audienceHandler('set-color', msg);
  var id = "color-" + msg.who;
  document.getElementById(id).style.backgroundColor = msg.color;
  console.log(msg.who + " set to " + msg.color)
});

socket.on('track exit', function(msg) {
  console.log(msg.who + " left")
  var elem  = "color-" + msg.who;
  console.log(elem)
  document.getElementById(elem).style.backgroundColor = "black";
});

var table = document.getElementById("playlist");
//playlist.sort((a, b) => {
//  return a.order - b.order;
//});

playlist.forEach( item => {
  if(item.show) {
    let row = table.insertRow();

    let name = row.insertCell(0);
    name.innerHTML = item.name;
    name.classList.add("song");
    name.setAttribute("pc", item.pc);
    name.innerHTML = item.name;

    let pc = row.insertCell(1);
    pc.innerHTML = item.pc;
    //pc.style.backgroundColor = "#" + item.baseColor;

    let pcSend = row.insertCell(2);
    pcSend.innerHTML = '<button class="pc-send" pc=' + item.pc + '>Send</button>';
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "audience";
    checkbox.classList.add("goggles-checkbox");
    checkbox.value = item.audience;
    //checkbox.id = "id";
    checkbox.setAttribute("pc",item.pc)
    if(item.audience_goggles) {
      checkbox.checked = true;
      songsForGoggles.push(item.pc);
    }
    let audience = row.insertCell(3);
    audience.appendChild(checkbox);

    var checkbox2 = document.createElement('input');
    checkbox2.type = "checkbox";
    checkbox2.name = "audience";
    checkbox2.classList.add("tubes-checkbox");
    checkbox2.value = item.audience;
    //checkbox.id = "id";
    checkbox2.setAttribute("pc",item.pc)
    if(item.audience_tubes) {
      checkbox2.checked = true;
      songsForTubes.push(item.pc);
    }
    let audience2 = row.insertCell(4);
    audience2.appendChild(checkbox2);
  }
});

document.querySelectorAll(".pc-send").forEach(item => {
  item.addEventListener("click", function() {
    var pc = parseInt(this.getAttribute("pc"));
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


document.querySelectorAll(".goggles-checkbox").forEach(item => {
  item.addEventListener("click", function() {
    var pc = parseInt(this.getAttribute("pc"));
    if (this.checked) {
      songsForGoggles.push(pc);
    } else {
      const index = songsForGoggles.indexOf(pc);
      if (index > -1) { // only splice array when item is found
        songsForGoggles.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    console.log(songsForGoggles);
  });
});

document.querySelectorAll(".tubes-checkbox").forEach(item => {
  item.addEventListener("click", function() {
    var pc = parseInt(this.getAttribute("pc"));
    if (this.checked) {
      songsForTubes.push(pc);
    } else {
      const index = songsForTubes.indexOf(pc);
      if (index > -1) { // only splice array when item is found
        songsForTubes.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    console.log(songsForTubes)
  });
});

document.querySelectorAll(".test-devices").forEach(item => {
  item.addEventListener("click", function() {
    var note = this.getAttribute("note");
    console.log("Note on:  " + note);
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
