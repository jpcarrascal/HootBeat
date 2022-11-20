
var devices = [null, null, null, null];
var pcNumberOfSongForAudiencInteraction = 18;
var currentPC = 0;

function listDevices(midi) {
    devices = [null, null, null, null];

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
                devices[0] = midi.outputs.get(output.value.id);
                console.log("updating PC")
                devices[0].send([0xC0, currentPC]);
                break;
            case "BT Goggle 2 Bluetooth":
                document.getElementById("status-daniel").classList.add("online");
                document.getElementById("status-daniel").innerText = "online";
                devices[1] = midi.outputs.get(output.value.id);
                devices[1].send([0xC0, currentPC]);
                break;
            case "BT Goggle 3 Bluetooth":
                document.getElementById("status-mauro").classList.add("online");
                document.getElementById("status-mauro").innerText = "online";
                devices[2] = midi.outputs.get(output.value.id);
                devices[2].send([0xC0, currentPC]);
                break;
            case "Left Tube Bluetooth":
                document.getElementById("status-left-tube").classList.add("online");
                document.getElementById("status-left-tube").innerText = "online";
                devices[3] = midi.outputs.get(output.value.id);
                devices[3].send([0xC0, currentPC]);
                break;
            case "Right Tube Bluetooth":
                document.getElementById("status-right-tube").classList.add("online");
                document.getElementById("status-right-tube").innerText = "online";
                devices[4] = midi.outputs.get(output.value.id);
                devices[4].send([0xC0, currentPC]);
                break; 
        }
    }
    //sendToGoggles([0xC0, currentPC]);
}

if (navigator.requestMIDIAccess) {
    console.log('Browser supports MIDI. Yay!');
    navigator.requestMIDIAccess().then(success, failure);
}

function success(midi) {
    listDevices(midi);
    midi.onstatechange = (event) => {
        console.log("Scanning devices...")
        listDevices(midi);
    };

}

function failure(){ console.log("MIDI not supported by browser :(")};

function triggersHandler(midiMsg) {
    if( isNoteOn(midiMsg.data[0]) && (midiMsg.data[1] == 60 || midiMsg.data[1] == 62) ) {
        midiMsg.data[1] = midiMsg.data[1] - 24;
    }
    if( isNoteOn(midiMsg.data[0])  && (midiMsg.data[1] == 36 || midiMsg.data[1] == 38) ) {
        //console.log("Note ON\t" + midiMsg.data[1] + "\tvelocity: " + midiMsg.data[2]);
        //if(pcNumberOfSongForAudiencInteraction !== currentPC) {
        if(!songsForGoggles.includes(currentPC)) {
            sendToGoggles(midiMsg.data);
        }
        if(!songsForTubes.includes(currentPC)) {
            sendToTubes(midiMsg.data);
        }
    }
}

function pedalboardHandler(midiMsg) {
    if ( isPC(midiMsg.data[0]) && (midiMsg.data[0] & 0x0E) == 12 ) { // Program Change
        console.log("PC change: " + midiMsg.data[1]);
        sendToDevices(midiMsg.data);
        currentPC = midiMsg.data[1];
        document.querySelectorAll(".song").forEach(song => {
            if(song.getAttribute("pc") == midiMsg.data[1])
                song.style.backgroundColor = "blue";
            else
                song.style.backgroundColor = "transparent";
        });
    }
}

function audienceHandler(what, msg) {
    var index = -1;
    if(songsForGoggles.includes(currentPC)) {
        console.log("in songsForGoogles");
        switch (msg.who) {
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
    }
    if(songsForTubes.includes(currentPC)) {
        console.log("in SongsForTubes");
        switch (msg.who) {
            case "left-tube":
                index = 3;
                break;
            case "right-tube":
                index = 4;
                break;    
        }
    }
    console.log("INDEX: " + index)
    if(index >= 0) {
        if(what == "flash") {
            if (devices[index] !== null) {
                console.log("sending flash");
                const noteOn = [0x90, 36, 0x7f];
                devices[index].send(noteOn);
            }
        } else if(what == "set-color") {
            if (devices[index] !== null) {
                console.log("sending color")
                var cc;
                var r = Math.floor(parseInt(msg.color.substring(1,3), 16)/2);
                cc = [0xB0, 120, r];
                devices[index].send(cc);
                var g = Math.floor(parseInt(msg.color.substring(3,5), 16)/2);
                cc = [0xB0, 121, g];
                devices[index].send(cc);
                var b = Math.floor(parseInt(msg.color.substring(5,7), 16)/2);
                cc = [0xB0, 122, b];
                devices[index].send(cc);
            }
        }
    }
    return 0;
}

function sendToDevices(message) {
    for(var i=0; i<devices.length; i++) {
        if(devices[i] !== null)
            devices[i].send(message);
    }
}

function sendToGoggles(message) {
    for(var i=0; i<3; i++) {
        if(devices[i] !== null)
            devices[i].send(message);
    }
}

function sendToTubes(message) {
    for(var i=3; i<5; i++) {
        if(devices[i] !== null)
            devices[i].send(message);
    }
}

function isNoteOn(msg) {
    return (msg >= 0x90 && msg <= 0x9F);
}

function isPC(msg) {
    return (msg >= 0xC0 && msg <= 0xCF);
}