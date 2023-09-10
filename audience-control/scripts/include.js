const PCMSG = 0xC0;
const CCMSG = 0xB0;
const NOTEONMSG = 0x90;
const NOTETOPLEFT = 12;
const NOTETOPRIGHT = 13;
const urlParams = new URLSearchParams(window.location.search);
const USEAUDIO = urlParams.get('audio') == "true"? true : false;

function hexTo7bitDec(hex) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b].map(function(num) {
        return Math.floor(num / 2);
      });
}

function selectRowAndLoadSongData(pc) {
    document.querySelectorAll(".song").forEach(song => {
        if(song.getAttribute("pc") == pc) {
            currentPC = animations[song.getAttribute("anim")];
            console.log("currentPC: " + currentPC)
            currentColor1 = song.getAttribute("color1");
            currentColor2 = song.getAttribute("color2");
            song.parentElement.style.backgroundColor = "white";
            song.parentElement.style.color = "black";

            //---------- NEEDS TESTING ----------
            // Send MIDI data, first the PC (animation) then 6 CCs (colors)
            sendToDevices([0xC0, currentPC]);
            const c1 = hexTo7bitDec(currentColor1);
            const c2 = hexTo7bitDec(currentColor2);
            c1.forEach((value, index) => {
                sendToDevices([0xB0, 120 + index, value]);
            });
            c2.forEach((value, index) => {
                sendToDevices([0xB0, 123 + index, value]);
            });
            //------------------------------------
        }
        else {
            song.parentElement.style.backgroundColor = "transparent";
            song.parentElement.style.color = "white";
        }
    });
}

const animations = {"allOn": 0,
                    "pulsating": 1,
                    "pulsatingRotating": 2,
                    "rotating": 3,
                    "drums": 4,
                    "alternatingColors": 5,
                    "strobe": 6,
                    "rotatingAndDrums": 7};

function getAnimIcon(anim) {
    switch(anim) {
        case "allOn":
            return "●";
        case "pulsating":
            return "❤";
        case "pulsatingRotating":
            return "☯";
        case "drums":
            return "♪";
        case "alternatingColors":
            return "∞";
        case "strobe":
            return "✺";
        case "rotatingAndDrums":
            return "♪";
    }
}