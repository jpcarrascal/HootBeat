
var goggles = [null, null, null];
var pcNumberOfSongForAudiencInteraction = 18;
var currentPC = 0;

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
                console.log("updating PC")
                goggles[0].send([0xC0, currentPC]);
                break;
            case "BT Goggle 2 Bluetooth":
                document.getElementById("status-daniel").classList.add("online");
                document.getElementById("status-daniel").innerText = "online";
                goggles[1] = midi.outputs.get(output.value.id);
                goggles[1].send([0xC0, currentPC]);
                break;
            case "BT Goggle 3 Bluetooth":
                document.getElementById("status-mauro").classList.add("online");
                document.getElementById("status-mauro").innerText = "online";
                goggles[2] = midi.outputs.get(output.value.id);
                goggles[3].send([0xC0, currentPC]);
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

    if( isNoteOn(midiMsg.data[0])  && (midiMsg.data[1] == 36 || midiMsg.data[1] == 38) ) {
        //console.log("Note ON\t" + midiMsg.data[1] + "\tvelocity: " + midiMsg.data[2]);
        if(pcNumberOfSongForAudiencInteraction !== currentPC) {
            sendToGoggles(midiMsg.data);
        }
    } else if( isNoteOn(midiMsg.data[0]) && (midiMsg.data[1] == 60 || midiMsg.data[1] == 62) ) {
        //console.log("Note ON\t" + midiMsg.data[1] + "\tvelocity: " + midiMsg.data[2]);
        midiMsg.data[1] = midiMsg.data[1] - 24;
        sendToGoggles(midiMsg.data);
    } else if (midiMsg.data[0] == 128) {
        //console.log("Note OFF\t" + midiMsg.data[1] + "\tvelocity: " + midiMsg.data[2]);
    } else if(midiMsg.data[0] == 254) { // Bloody active sensing
        
    }
}

function pedalboardHandler(midiMsg) {
    if ( isPC(midiMsg.data[0]) ) { // Program Change
        sendToGoggles(midiMsg.data);
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
    if(pcNumberOfSongForAudiencInteraction == currentPC){
        var index = -1;
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
        if(what == "flash") {
            console.log("sending flash")
            if (goggles[index] !== null) {
                const noteOn = [0x90, 36, 0x7f];
                goggles[index].send(noteOn);
            }
        } else if(what == "set-color") {
            console.log("sending color")
            if (goggles[index] !== null) {
                var cc;
                var r = Math.floor(parseInt(msg.color.substring(1,3), 16)/2);
                cc = [0xB0, 120, r];
                goggles[index].send(cc);
                var g = Math.floor(parseInt(msg.color.substring(3,5), 16)/2);
                cc = [0xB0, 121, g];
                goggles[index].send(cc);
                var b = Math.floor(parseInt(msg.color.substring(5,7), 16)/2);
                cc = [0xB0, 122, b];
                goggles[index].send(cc);
            }
        }
    }
}

function sendToGoggles(message) {
    for(var i=0; i<goggles.length; i++) {
        if(goggles[i] !== null)
            goggles[i].send(message);
    }
}

function isNoteOn(msg) {
    return (msg >= 0x90 && msg <= 0x9F);
}

function isPC(msg) {
    return (msg >= 0xC0 && msg <= 0xCF);
}