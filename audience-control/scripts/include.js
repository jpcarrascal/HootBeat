const PCBYTE = 0xC0;
const CCBYTE = 0xB0;
const NOTEONBYTE = 0x90;
const GOGGLESCENECC = 126;
const TUBESCENECC = 127;
const GOGGLEFADEECC = 110;
const TUBEFADEECC = 111;
const NOTETOPLEFT = 12;
const NOTETOPRIGHT = 13;
const BDMSG = [NOTEONBYTE, 36, 0x7f];
const SDMSG = [NOTEONBYTE, 38, 0x7f];
//const NOTETOPLEFT = 12;
//const NOTETOPRIGHT = 13;
const urlParams = new URLSearchParams(window.location.search);
const USEAUDIO = urlParams.get('audio') == "true"? true : false;

function hexTo7bitDec(hex) {
    if(hex.charAt(0) === '#') hex = hex.substring(1);
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
        case 0:
        case "allOff":
            return "";
        case 1:
        case "allOn":
            return "●";
        case 2:
        case "pulsating":
            return "❤";
        case 3:
        case "pulsatingRotating":
            return "☯";
        case 3:
        case "rotating":
            return "⚇";
        case 5:
        case "drums":
            return "♩";
        case 6:
        case "alternatingColors":
            return "∞";
        case 7:
        case "strobe":
            return "✺";
        case 8:
        case "rotatingAndDrums":
            return "♪";
        default:
            return "";
    }
}

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