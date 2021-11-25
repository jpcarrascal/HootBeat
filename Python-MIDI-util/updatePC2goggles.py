#!/usr/bin/env python
# https://github.com/SpotlightKid/python-rtmidi

'''from __future__ import print_function
import subprocess
import json'''
import sys
import rtmidi
from rtmidi.midiconstants import (PROGRAM_CHANGE)


with open('/tmp/latestPC', 'r') as f:
    data = f.read().split(" ")
print(data)
value = int(data[0])
channel = 13
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
    msg = [PROGRAM_CHANGE | channel, value] 
    midiout.send_message(msg)
    midiout.close_port()
