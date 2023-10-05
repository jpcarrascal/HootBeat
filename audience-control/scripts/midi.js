var devices = [null, null, null, null, null];
var currentGoggleScene = { "pc": -1,
                "anim": "drums",
                "color1": "050008",
                "color2": "050008"};
var currentTubeScene = { "pc": -1,
                "anim": "drums",
                "color1": "050008",
                "color2": "000000"};

var currentSongScenes = {goggles: [], tubes: []};

function compileSceneData(sceneTable) {
    for (var i=0; i<sceneTable.length; i++) {
        var pc = sceneTable[i].pc;
        for(var j=0; j<sceneTable[i].scenes.length; j++) {
            sceneTable[i].scenes[j].pc = pc;
            const animName = sceneTable[i].scenes[j].anim;
            sceneTable[i].scenes[j].animName = sceneTable[i].scenes[j].anim;
            sceneTable[i].scenes[j].anim = animations[animName];
        }
    }
}
compileSceneData(goggleScenes);
compileSceneData(tubeScenes);

function listDevices(midi) {
    console.log("Scanning devices...");
    devices = [null, null, null, null, null];

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
            case "IAC Driver Bus 2":
            case "IAC Driver Bus 2: notes":
                document.getElementById("status-iac").classList.add("online");
                document.getElementById("status-iac").innerText = "online";
                input.value.onmidimessage = triggersHandler;
                break;
            case "Transparent Bluetooth":
                if(USEAUDIO) {
                    document.getElementById("status-transparent").classList.add("online");
                    document.getElementById("status-transparent").innerText = "online";
                    input.value.onmidimessage = transparentHandler;
                }
        }
    }
    
    for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
        switch(output.value.name) {
            case "BT Goggle 1 Bluetooth":
                document.getElementById("status-jp").classList.add("online");
                document.getElementById("status-jp").innerText = "online";
                devices[0] = midi.outputs.get(output.value.id);
                devices[0].send([PCBYTE, 0]); // Initializing to 0 as currentPC is -1
                sendColor(devices[0], currentGoggleScene.color1, currentGoggleScene.color2);
                break;
            case "BT Goggle 2 Bluetooth":
                document.getElementById("status-daniel").classList.add("online");
                document.getElementById("status-daniel").innerText = "online";
                devices[1] = midi.outputs.get(output.value.id);
                devices[1].send([PCBYTE, 0]); // Initializing to 0 as currentPC is -1
                sendColor(devices[1], currentGoggleScene.color1, currentGoggleScene.color2);
                break;
            case "BT Goggle 3 Bluetooth":
                document.getElementById("status-mauro").classList.add("online");
                document.getElementById("status-mauro").innerText = "online";
                devices[2] = midi.outputs.get(output.value.id);
                devices[2].send([PCBYTE, 0]);  // Initializing to 0 as currentPC is -1
                sendColor(devices[2], currentGoggleScene.color1, currentGoggleScene.color2);
                break;
            case "Left Tube Bluetooth":
                document.getElementById("status-left-tube").classList.add("online");
                document.getElementById("status-left-tube").innerText = "online";
                devices[3] = midi.outputs.get(output.value.id);
                devices[3].send([PCBYTE, 0]); // Initializing to 0 as currentPC is -1
                break;
            case "Right Tube Bluetooth":
                document.getElementById("status-right-tube").classList.add("online");
                document.getElementById("status-right-tube").innerText = "online";
                devices[4] = midi.outputs.get(output.value.id);
                devices[4].send([PCBYTE, 0]); // Initializing to 0 as currentPC is -1
                break; 
        }
    }
    //sendToGoggles([PCMSG, currentPC]);
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
    if( isNoteOn(midiMsg.data[0]) && (midiMsg.data[1] == 60 || midiMsg.data[1] == 62) ) {
        midiMsg.data[1] = midiMsg.data[1] - 24;
    }
    if( isNoteOn(midiMsg.data[0]) ){//}  && (midiMsg.data[1] == 36 || midiMsg.data[1] == 38) ) {
        if(!songsForGoggles.includes(currentGoggleScene.pc)) {
            sendToGoggles(midiMsg.data);
        }
        if(!songsForTubes.includes(currentGoggleScene.pc)) {
            sendToTubes(midiMsg.data);
        }
    }
}

function pedalboardHandler(midiMsg) {
    if ( isPC(midiMsg.data[0]) && (midiMsg.data[0] & 0x0F) == 12 ) { // Program Change
        selectRowAndLoadSongData(midiMsg.data[1]);
    } else if (isCC(midiMsg.data[0]) && (midiMsg.data[1]) == GOGGLESCENECC ) {
        sendScene(currentSongScenes.goggles[midiMsg.data[2]], "goggles");
        document.getElementById("current-scene-goggles").innerText = (currentSongScenes.goggles[midiMsg.data[2]].animName);
    } else if (isCC(midiMsg.data[0]) && (midiMsg.data[1]) == TUBESCENECC ) {
        sendScene(currentSongScenes.tubes[midiMsg.data[2]], "tubes");
        document.getElementById("current-scene-tubes").innerText = (currentSongScenes.tubes[midiMsg.data[2]].animName);
    } else if (isCC(midiMsg.data[0]) && (midiMsg.data[1]) == TUBEFADEECC ) {
        //sendScene(currentSongScenes.tubes[midiMsg.data[2]], "tubes");
        sendToTubes(midiMsg.data);
    } else if( isNoteOn(midiMsg.data[0]) && (midiMsg.data[1] == NOTETOPLEFT || midiMsg.data[1] == NOTETOPRIGHT) ) {
        sendToTubes(midiMsg.data);
        //console.log("received top note");
        //console.log(midiMsg.data);
    }
}

function transparentHandler(midiMsg) {
    if(USEAUDIO) {
        if( isNoteOn(midiMsg.data[0]) ) {
            playSample(midiMsg.data);
        }
    }
}

function audienceHandler(what, msg) {
    var index = -1;
    if(songsForGoggles.includes(currentGoggleScene.pc)) {
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
        //currentGoggleScene.anim = animations["drums"];
        //sendToAllDevices([PCBYTE, currentGoggleScene.anim]);
    }
    if(songsForTubes.includes(currentGoggleScene.pc)) {
        switch (msg.who) {
            case "left-tube":
                index = 3;
                break;
            case "right-tube":
                index = 4;
                break;    
        }
    }
    devices[index].send([PCBYTE, animations["drums"]]);
    console.log("INDEX: " + index)
    if(index >= 0) {
        if(what == "flash") {
            if (devices[index] !== null) {
                console.log("flash");
                devices[index].send(BDMSG);
            }
        } else if(what == "set-color") {
            if (devices[index] !== null) {
                console.log("set-color")
                console.log(msg.color);
                sendColor(devices[index], msg.color, msg.color);
            }
        }
    }
    return 0;
}

function sendToAllDevices(message) {
    if( isPC(message[0]) ) {
        receivedPC = message[1];
        let altMsgDrums = [message[0], 4]; // Drums, to be controlled by audience
        let altMsgAllOff = [message[0], 0]; // All leds off
        //let altMessage = [message[0], 127];
        //altMessage[1] = 4; // Drums, to be controlled by audience
        // Goggles:
        for(var i=0; i<3; i++) {
            if(devices[i] !== null) {
                if(songsForGoggles.includes(receivedPC))
                    devices[i].send(altMsgDrums);
                else
                    devices[i].send(message);
            }
        }
        // Tubes:
        for(var i=3; i<5; i++) {
            if(devices[i] !== null) {
                if(songsForTubes.includes(receivedPC))
                    devices[i].send(altMsgDrums);
                else
                    devices[i].send(altMsgAllOff); // Tubes' default is all off
                    //devices[i].send(message);
            }
        }
    } else {
        for(var i=0; i<5; i++) {
            if(devices[i] !== null)
                devices[i].send(message);
        }
    }
}

function selectRowAndLoadSongData(pc) {
    document.querySelectorAll(".song").forEach(song => {
        if(song.getAttribute("pc") == pc) {
            currentSongScenes.goggles = getSceneData(pc, goggleScenes);
            currentSongScenes.tubes = getSceneData(pc, tubeScenes);
            currentGoggleScene = currentSongScenes.goggles[0];
            currentTubeScene = currentSongScenes.tubes[0];
            document.getElementById("current-scene-goggles").innerText = (currentGoggleScene.animName);
            document.getElementById("current-scene-tubes").innerText = (currentTubeScene.animName);
            song.parentElement.style.backgroundColor = "white";
            song.parentElement.style.color = "black";
            sendScene(currentGoggleScene, "goggles");
            sendScene(currentTubeScene, "tubes");
            if(!songsForGoggles.includes(currentGoggleScene.pc)) {
                socket.emit('kick-all-out', {} );
            }
        }
        else {
            song.parentElement.style.backgroundColor = "transparent";
            song.parentElement.style.color = "white";
        }
    });
}

function sendColor(device, color1, color2) {
    if(typeof device === 'Integer') {
        device = devices[device];
    }
    const c1 = hexTo7bitDec(color1);
    const c2 = hexTo7bitDec(color2);
    c1.forEach((value, index) => {
        device.send([0xB0, 120 + index, value]);
    });
    c2.forEach((value, index) => {
        device.send([0xB0, 123 + index, value]);
    });
}

function getSceneData(pc, sceneTable) {
    for (var i = 0; i < sceneTable.length; i++) {
      if (sceneTable[i].pc === pc) {
        return sceneTable[i].scenes;
      }
    }
    return null;
}

function sendScene(scene, sendTo) {
    let devs2send = [];
    if(typeof sendTo === 'Array') {
        devs2send = sendTo;
    } else if(sendTo == "all" || sendTo === undefined) {
        devs2send = devices;
    } else if(sendTo == "goggles") {
        devs2send = devices.slice(0, 3);
    } else if(sendTo == "tubes") {
        devs2send = devices.slice(3, 5);
    } else {
        console.log("ERROR: sendTo must be an array or 'all', 'goggles' or 'tubes'");
        return;
    }
    for(var i=0; i<devs2send.length; i++) {
        if(devs2send[i] !== null) {
            sendColor(devs2send[i], scene.color1, scene.color2);
            devs2send[i].send([PCBYTE, scene.anim]);
        }
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

function isCC(msg) {
    return (msg >= 0xB0 && msg <= 0xBF);
}

function printMIDImsg(msg) {
    let type = "";
    let channel = msg[0] & 0x0F;
    if(isNoteOn(msg[0]))
        type = "Note ON";
    if(isPC(msg[0]))
        type = "PC";
    if(isCC(msg[0]))
        type = "CC";
    console.log(type + "\tchannel: " + channel + "\tdata0: " + msg[1] + "\tdata1: " + msg[2]);
}
