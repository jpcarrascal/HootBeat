var who = "sequencer"
var room = findGetParameter("room") || "spacebarman";
var socket = io("", {query:{room: room, who:who}});
document.querySelectorAll(".device-url").forEach(item => {
  const urlParams = new URLSearchParams(window.location.search);
  const destWho = item.getAttribute("who");
  let baseUrl = window.location.origin;
  item.setAttribute("href", baseUrl + "/qr-code?room=" + room + "&who=" + destWho);
});


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
  document.getElementById(id).style.backgroundColor = msg.color;
  //console.log(msg);
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
  //console.log(msg.who + " set to " + msg.color)
});

socket.on('audience-exit', function(msg) {
  //console.log(msg.who + " left")
  var elem  = "color-" + msg.who;
  document.getElementById(elem).style.backgroundColor = "black";
});

if(USEAUDIO) document.getElementById("samples").style.display = "block";
var playlistTable = document.getElementById("playlist");
//playlist.sort((a, b) => {
//  return a.order - b.order;
//});

playlist.forEach( item => {
  if(item.show) {
    // Colors:
    let row = playlistTable.insertRow();
    row.setAttribute("pc", item.pc);
    row.classList.add("song-row");
    let color = row.insertCell(0);
    color.classList.add("goggle-colors");
    var goggleScene = getSceneData(item.pc, goggleScenes)[0];
    var tubeScene = getSceneData(item.pc, tubeScenes)[0];
    // Animation colors
    var icon = getAnimIcon(goggleScene.anim);
    var c1 = document.createElement('div');
    c1.classList.add("color-div");
    c1.style.backgroundColor = "#" + goggleScene.color1;
    c1.innerHTML ="<span class='anim-icon'>" + icon + "</span>";
    color.appendChild(c1);
    let c2 = document.createElement('div');
    c2.classList.add("color-div");
    c2.style.backgroundColor = "#" + goggleScene.color2;
    c2.innerHTML ="<span class='anim-icon'>" + icon + "</span>";
    color.appendChild(c2);

    // Song name:
    let name = row.insertCell(1);
    name.classList.add("song");
    name.setAttribute("pc", item.pc);
    name.setAttribute("anim", goggleScene.anim);
    name.setAttribute("color1", goggleScene.color1);
    name.setAttribute("color2", goggleScene.color2);
    name.innerHTML = item.name;
    if(item.samples !== "none") {
      name.innerHTML += " *";
    }

    let pc = row.insertCell(2);
    pc.innerHTML = item.pc;

    let pcSend = row.insertCell(3);
    pcSend.innerHTML = '<button class="pc-send" pc=' + item.pc +
                      ' samples=' + item.samples + '>Send</button>';
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "audience";
    checkbox.classList.add("goggles-checkbox");
    checkbox.value = item.audience;
    //checkbox.id = "id";
    checkbox.setAttribute("pc",item.pc);
    checkbox.setAttribute("anim",goggleScene.anim);
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
    selectRowAndLoadSongData(pc);
    if(USEAUDIO) {
    // Load samples, if any. First stop all samples being played
      players.forEach(player => {
        player.player.stop();
      });
      players = new Array();
      const samples = item.getAttribute("samples");
      let tableBody = document.getElementById("samples-table");
      if(samples !== "none" && USEAUDIO) {
        tableBody.innerHTML = "";
        const sampleLocation = "/sounds/" + samples + "/";
        loadSamples(sampleLocation);
      } else {
        tableBody.innerHTML = "<tr><td>None</td></tr>";
      }
    }
  })
});


document.querySelectorAll(".goggles-checkbox").forEach(item => {
  item.addEventListener("click", function() {
    const pc = parseInt(this.getAttribute("pc"));
    if (this.checked) {
      songsForGoggles.push(pc);
    } else {
      const index = songsForGoggles.indexOf(pc);
      if (index > -1) { // only splice array when item is found
        songsForGoggles.splice(index, 1); // 2nd parameter means remove one item only
      }
      if(pc == currentGoggleScene.pc) {
        sendScene(currentGoggleScene,"goggles");
      }
    }
  });
});

document.querySelectorAll(".tubes-checkbox").forEach(item => {
  item.addEventListener("click", function() {
    const pc = parseInt(this.getAttribute("pc"));
    if (this.checked) {
      songsForTubes.push(pc);
    } else {
      const index = songsForTubes.indexOf(pc);
      if (index > -1) { // only splice array when item is found
        songsForTubes.splice(index, 1); // 2nd parameter means remove one item only
      }
      if(pc == currentTubeScene.pc) {
        sendScene(currentTubeScene,"tubes");
      }
    }
  });
});

document.querySelectorAll(".test-devices").forEach(item => {
  item.addEventListener("click", function() {
    var note = this.getAttribute("note");
    sendToAllDevices([NOTEONBYTE, note, 127]);
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
