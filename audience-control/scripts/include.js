const PCBYTE = 0xC0;
const CCBYTE = 0xB0;
const NOTEONBYTE = 0x90;
const BDMSG = [NOTEONBYTE, 36, 0x7f];
const SDMSG = [NOTEONBYTE, 38, 0x7f];
//const NOTETOPLEFT = 12;
//const NOTETOPRIGHT = 13;
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

const animations = {"allOff": 0,
                    "allOn": 1,
                    "pulsating": 2,
                    "pulsatingRotating": 3,
                    "rotating": 4,
                    "drums": 5,
                    "alternatingColors": 6,
                    "strobe": 7,
                    "rotatingAndDrums": 8
                };

function getAnimIcon(anim) {
    switch(anim) {
        case "allOff":
            return "";
        case "allOn":
            return "●";
        case "pulsating":
            return "❤";
        case "pulsatingRotating":
            return "☯";
        case "drums":
            return "♩";
        case "alternatingColors":
            return "∞";
        case "strobe":
            return "✺";
        case "rotatingAndDrums":
            return "♪";
    }
}