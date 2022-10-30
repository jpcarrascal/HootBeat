
var goggles = [null, null, null];
var pcNumberOfSongForAudiencInteraction = 18;
var currentSong = -1;

function listDevices(midi) {
    goggles = [null, null, null];;

    var outputs = midi.outputs.values();
    var inputs  = midi.inputs.values();
    
    document.querySelectorAll(".status").forEach(elem => {
        elem.classList.remove("online");
        elem.innerText = "offline";
    });
    
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        switch(input.value.name) {
            case "USB MIDI Interface":
                document.getElementById("status-triggers").classList.add("online");
                document.getElementById("status-triggers").innerText = "online";
                input.value.onmidimessage = triggersHandler;
                break;
            case "WIDI Jack Bluetooth":
                document.getElementById("status-pedalboard").classList.add("online");
                document.getElementById("status-pedalboard").innerText = "online";
                input.value.onmidimessage = pedalboardHandler;
                break; 
            case "IAC Driver Bus 2: notes":
                document.getElementById("status-iac").classList.add("online");
                document.getElementById("status-iac").innerText = "online";
                input.value.onmidimessage = triggersHandler;
        }
    }
    
    for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
        switch(output.value.name) {
            case "BT Goggle 1 Bluetooth":
                document.getElementById("status-jp").classList.add("online");
                document.getElementById("status-jp").innerText = "online";
                goggles[0] = midi.outputs.get(output.value.id);
                break;
            case "BT Goggle 2 Bluetooth":
                document.getElementById("status-daniel").classList.add("online");
                document.getElementById("status-daniel").innerText = "online";
                goggles[1] = midi.outputs.get(output.value.id);
                break;
            case "BT Goggle 3 Bluetooth":
                document.getElementById("status-mauro").classList.add("online");
                document.getElementById("status-mauro").innerText = "online";
                goggles[2] = midi.outputs.get(output.value.id);
                break; 
        }
    }
}

if (navigator.requestMIDIAccess) {
    console.log('Browser supports MIDI. Yay!');
    navigator.requestMIDIAccess().then(success, failure);
}

function success(midi) {
    listDevices(midi);

    midi.onstatechange = (event) => {
        listDevices(midi);
    };

}

function failure(){ console.log("MIDI not supported by browser :(")};

function triggersHandler(midiMsg) {
    if(midiMsg.data[0] == 144 && (midiMsg.data[1] == 36 || midiMsg.data[1] == 38) ) {
        //console.log("Note ON\t" + midiMsg.data[1] + "\tvelocity: " + midiMsg.data[2]);
        if(pcNumberOfSongForAudiencInteraction !== currentSong) {
            sendToGoggles(midiMsg.data);
        }
    } else if(midiMsg.data[0] == 144 && (midiMsg.data[1] == 60 || midiMsg.data[1] == 62) ) {
        //console.log("Note ON\t" + midiMsg.data[1] + "\tvelocity: " + midiMsg.data[2]);
        midiMsg.data[1] = midiMsg.data[1] - 24;
        sendToGoggles(midiMsg.data);
    } else if (midiMsg.data[0] == 128) {
        //console.log("Note OFF\t" + midiMsg.data[1] + "\tvelocity: " + midiMsg.data[2]);
    }
}

function pedalboardHandler(midiMsg) {
    if (midiMsg.data[0] >= 0xC0 && midiMsg.data[0] <= 0xCF) { // Program Change
        sendToGoggles(midiMsg.data);
        currentSong = midiMsg.data[1];
        document.querySelectorAll(".song").forEach(song => {
            if(song.getAttribute("pc") == midiMsg.data[1])
                song.style.backgroundColor = "blue";
            else
                song.style.backgroundColor = "transparent";
        });
    }
}

function audienceHandler(who) {
    const noteOn = [0x90, 36, 0x7f];
    var index = -1;
    switch (who) {
        case "jp":
            index = 0;
            break;
        case "daniel":
            index = 1;
            break;
        case "mauro":
            index = 2;
            break;
    }
    if (goggles[index] !== null) goggles[index].send(noteOn);
}

function sendToGoggles(message) {
    for(var i=0; i<goggles.length; i++) {
        if(goggles[i] !== null)
            goggles[i].send(message);
    }
}