#!/usr/bin/env python3
#
# midiin_callback.py
#
# Dependencies:
# https://github.com/SpotlightKid/python-rtmidi

"""Show how to receive MIDI input by setting a callback function."""

from __future__ import print_function
import subprocess
import sys
import time
import rtmidi
from rtmidi.midiutil import open_midiinput
from rtmidi.midiconstants import (NOTE_ON, NOTE_OFF, PROGRAM_CHANGE, CONTROL_CHANGE)

class MidiInputHandler(object):
    def __init__(self, port):
        self.port = port
        self._wallclock = time.time()

    def __call__(self, event, data=None):
        message, deltatime = event
        self._wallclock += deltatime
        if message[0] == PROGRAM_CHANGE or message[0] == NOTE_ON:
            print ( message[0] + " received: ",message[1], " at ", int(self._wallclock), " rt: ", int(time.time()) )
            self.send2goggles(message)
    
    def send2goggles(msg):
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
            midiout.send_message(msg)
            midiout.close_port()

def check_port(name):
    portID = -1
    midiin = rtmidi.MidiIn()
    while portID < 0:
        ports = midiin.get_ports()
        for i in range(0,len(ports)):
            port = ports[i]
            if name in port:
                print("Port found: "+port)
                portID = i
        if portID == -1:
            print (name + " not found, trying again...")
            time.sleep(5)
    return portID

usb = check_port("USB MIDI Interface")
#widi = check_port("WIDI Jack")
midiin = rtmidi.MidiIn()
ports = midiin.get_ports()

try:
    midiin.open_port(usb)
#    midiin.open_port(widi)
except (EOFError, KeyboardInterrupt):
    sys.exit()

midiin.set_callback(MidiInputHandler(ports[usb]))
#midiin.set_callback(MidiInputHandler(ports[widi]))

try:
    # Just wait for keyboard interrupt,
    # everything else is handled via the input callback.
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print('')
finally:
    print("Exit.")
    midiin.close_port()
    del midiin
