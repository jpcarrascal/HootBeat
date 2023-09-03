const PCMSG = 0xC0;
const CCMSG = 0xB0;
const NOTEONMSG = 0x90;
const NOTETOPLEFT = 12;
const NOTETOPRIGHT = 13;
const urlParams = new URLSearchParams(window.location.search);
const USEAUDIO = urlParams.get('audio') == "true"? true : false;
