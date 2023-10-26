var who = "sequencer"
var room = findGetParameter("room") || "spacebarman";

var socket = io("", {query:{room: room, who:who}});
var cmiSocket;
var mySocketID;
var cmiSocketID;
socket.on("connect", () => {
  console.log("Connected, my socketid:" + socket.id);
  mySocketID = socket.id;

  let cmiURL = "https://count-me-in.azurewebsites.net/";
  let baseUrl = window.location.origin;
  if (baseUrl.includes("localhost"))
    cmiURL = "http://localhost:3000/";
  cmiSocket = io(cmiURL, {'max reconnection attempts' : 3, query:{room: room, initials: "HB", hootbeat: "hootbeat"}});
  cmiSocket.on("connect", () => {
    console.log("Connected to Count-Me-In, my socketid:" + cmiSocket.id);
    cmiSocketID = cmiSocket.id;
  });
});