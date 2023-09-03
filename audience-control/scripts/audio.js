var players = new Array();
var numSamples = 0;
var keys = ["a", "s", "d", "f", "g", "h", "j", "k"];

function loadSamples(sampleLocation) {
  console.log("Loading samples from " + sampleLocation);
  const sampleJson = sampleLocation + "index.json";
  fetch(sampleJson)
  .then((response) => response.json())
  .then((soundPreset) => {
    numSamples = soundPreset.length;
    var trackCount = 0;
    for(var i=0; i<numSamples; i++) {
      const url = sampleLocation + "samples/" + soundPreset[i].sound;
      const note = soundPreset[i].params.note;
      const loop = soundPreset[i].params.loop;
      const volume = soundPreset[i].params.volume;
      const name = soundPreset[i].sound.split(".")[0];
      const key = keys[i];
      const player = new Tone.Player({url: url, loop: loop, volume: volume}).toDestination();
      Tone.loaded().then(() => {
        players.push({note: note, player: player});
        appendSampleUI(name, note, key);
        trackCount++;
        //if(trackCount == players.length) document.getElementById('clickme-container').innerHTML = 'Done.';
      });
    }
  });
  //document.getElementById('clickme-container').innerHTML = '';
}

function appendSampleUI(name, note, key) {
  let tableBody = document.getElementById("samples-table");
  let row = tableBody.insertRow();
  let sampleCell = row.insertCell(0);
  sampleCell.innerHTML = name;
  sampleCell.classList.add("sample-name");
  sampleCell.setAttribute("note", note);

  let noteCell = row.insertCell(1);
  noteCell.innerHTML = note;
  noteCell.classList.add("sample-note");
  noteCell.setAttribute("note", note);

  let keyCell = row.insertCell(2);
  keyCell.innerHTML = key;
  keyCell.classList.add("sample-key");
  keyCell.setAttribute("note", note);

  document.addEventListener('keydown', function(event) {
    if (event.code === ("Key"+key.toUpperCase())) {
        playSample([0x90, note, 0x7f]);
    }
  });


}


function playSample(data) {
  if(data[2] > 0) {
    for(var i=0; i<players.length; i++) {
      if(players[i].note == data[1]) {
        if(players[i].player.loop == true && players[i].player.state == "started") {
          players[i].player.stop();
        } else {
          players[i].player.start(Tone.context.currentTime);
        }
      }
      
    }
  }
}

