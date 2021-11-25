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
from rtmidi.midiconstants import (PROGRAM_CHANGE)

class MidiInputHandler(object):
    def __init__(self, port):
        self.port = port
        self._wallclock = time.time()

    def __call__(self, event, data=None):
        message, deltatime = event
        self._wallclock += deltatime
        if message[0] == 204:
            print ( "Program change received: ",message[1], " at ", int(self._wallclock), " rt: ", int(time.time()) )
            savestring = str(int(message[1])) + " " + str(int(time.time()))
            f = open("/tmp/latestPC", "w")
            f.write(savestring)
            f.close()

widi = -1
midiin = rtmidi.MidiIn()
while widi < 0:
    ports = midiin.get_ports()
    for i in range(0,len(ports)):
        port = ports[i]
        if "WIDI Jack" in port:
            print("Receiving from: "+port)
            widi = i
    if widi == -1:
        print ("WIDI Jack not found, trying again...")
        time.sleep(10)

try:
    midiin.open_port(widi)
    #midiin, port_name = open_midiinput(widi)
except (EOFError, KeyboardInterrupt):
    sys.exit()

midiin.set_callback(MidiInputHandler(ports[widi]))

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
