const soundParam = "ElAnsia";//findGetParameter("sounds") || "tr808";
const soundFolder = "/sounds/" + soundParam + "/";
const soundsJson = soundFolder + "index.json";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();

var soundArrayBuffers = new Array();
var numSamples = 0;

const clickme = document.getElementById('clickme');
clickme.addEventListener('click', function() {
  fetch(soundsJson)
    .then((response) => response.json())
    .then((soundPreset) => {
      numSamples = soundPreset.length;
      var trackCount = 0;
      for(var i=0; i<numSamples; i++) {
        if(soundPreset[i].type == "sampler") {
          const src = soundFolder + "sounds/" + soundPreset[i].sound;
          const note = soundPreset[i].params.note;
          const loop = soundPreset[i].params.loop;
          const response = fetch(src).then(response => {
            const arrayBuffer = response.arrayBuffer().then(arrayBuffer => {
              const audioBuffer = audioContext.decodeAudioData(arrayBuffer).then(audioBuffer => {
                soundArrayBuffers.push({note: note, buffer: audioBuffer, loop: loop});
              });
            });
          });
        }
        trackCount++;
      }
      document.getElementById('clickme-container').innerHTML = 'Done.';
      console.log(soundArrayBuffers);
    });
    document.getElementById('clickme-container').innerHTML = 'Loading...';
});

function playSample(data) {
  if(data[2] > 0) {
    for(var i=0; i<soundArrayBuffers.length; i++) {
      if(soundArrayBuffers[i].note == data[1]) {
        const source = audioContext.createBufferSource();
        source.buffer = soundArrayBuffers[i].buffer;
        source.connect(audioContext.destination);
        source.start(0);
      }
      
    }
  }
}


if(audioContext.state === 'suspended'){
  audioContext.resume();
};

