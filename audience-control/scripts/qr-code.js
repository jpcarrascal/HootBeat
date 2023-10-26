const localNetUrl = "http://jina.local:3001";
const urlParams = new URLSearchParams(window.location.search);
const whoString = urlParams.get('who') || "Missing WHO!!!";
// Show only first character
const room = urlParams.get('room') || "Missing room!!!";
let baseUrl = window.location.origin;
if (baseUrl.includes("localhost")) baseUrl = localNetUrl;

const whos = whoString.split(",").filter(i => i);

document.querySelector("title").innerHTML += ( "-" + room);

let string = "";
if(whos.length % 2 != 0) whos.push(" ");
for(var i = 0; i < whos.length; i++) {
    let who = whos[i];
    let displayWho = who.split("-").map((el) => el.charAt(0).toUpperCase()).join("_");
    let displayRoom = room;
    let url = baseUrl + "?room=" + room + "&who=" + who;
    let colId = "";
    let qrId = "qr-code-" + i;
    logo = '<img class="logo" src="images/spacebarman-logo.png" alt="spacebarman-logo">';
    if(who == " ") {
        logo = "";
        url = "";
        displayWho = "";
        displayRoom = "";
    }
    if(i % 2 == 0)
        colId = 'left-column';
    else
        colId = 'right-column';
    if(i % 2 == 0) string += '<div class="container">';
    string += `
      <div class="column" id="` + colId + `">
        <div class="qr-code" id="` + qrId + `">
        </div>
        <span class="url">` + url + `</span>
        ` + logo + `
        <span class="who">` + displayWho + `</span>
        <span class="room">` + displayRoom + `</span>
      </div>`;
    
    if((i+1) % 2 == 0) string += '</div>';    
}
document.querySelector("body").innerHTML = string;

for(var i = 0; i < whos.length; i++) {
    if(whos[i] == " ") continue;
    let qrId = "qr-code-" + i;
    let url = baseUrl + "?room=" + room + "&who=" + whos[i];
    const qrcode = new QRCode(qrId, {
        text: url,
        width: 250,
        height: 250,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    
}
