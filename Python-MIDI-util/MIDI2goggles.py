#!/usr/bin/env python
# https://github.com/SpotlightKid/python-rtmidi

'''from __future__ import print_function
import subprocess
import json'''
import sys
import rtmidi
from rtmidi.midiconstants import (NOTE_ON, NOTE_OFF, PROGRAM_CHANGE, CONTROL_CHANGE)

if len(sys.argv) < 3:
    print("Usage:")
    print(sys.argv[0] + " PROGRAM_CHANGE|NOTE_ON|NOTE_OFF|CONTROL_CHANGE channel value1 [value2]")
    sys.exit()

msg_type = eval(sys.argv[1])
channel = int(sys.argv[2])
value1 = int(sys.argv[3])
if len(sys.argv) > 4:
    value2 = int(sys.argv[4])
else:
    value2 = 0

midiout = rtmidi.MidiOut()
goggles = []
ports = midiout.get_ports()
for i in range(0,len(ports)):
    port = ports[i]
    if "Goggle" in port:
        print("Sending to: " + port)
        goggles.append(i)

for goggle in goggles:
    midiout.open_port(goggle)
    msg = [msg_type | channel, value1, value2] 
    midiout.send_message(msg)
    midiout.close_port()
