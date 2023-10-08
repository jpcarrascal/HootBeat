const localNetUrl = "http://jina.local:3000";
const urlParams = new URLSearchParams(window.location.search);
let who = urlParams.get('who') || "Missing WHO!!!";
// Show only first character
who = who.split("-").map((el) => el.charAt(0).toUpperCase()).join("_");
const room = urlParams.get('room') || "Missing room!!!";
let baseUrl = window.location.origin;

if (baseUrl.includes("localhost:3000")) baseUrl = localNetUrl;
const url = baseUrl + "?who=" + who + "&room=" + room;

document.querySelectorAll(".url").forEach((el) => {
    el.textContent = url;
});

document.querySelectorAll(".who").forEach((el) => {
    el.textContent = who;
});

document.querySelectorAll(".room").forEach((el) => {
    el.textContent = room;
});

document.querySelectorAll(".qr-code").forEach((el) => {
    let thisId = el.getAttribute("id");
    const qrcode = new QRCode(thisId, {
        text: url,
        width: 450,
        height: 450,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
});