# HOOTBEAT

ESP32-based BLE-MIDI controlled goggles and Raspberry Pi service to manage the system.

Examples (images link to Youtube videos):

[![BLE-MIDI Goggles demo](mauro.gif)](https://www.youtube.com/watch?v=fSSJu2f_Yg4)

## Block diagram
[](HootBeat-block_diagram.jpg)

* See them in action in [Spacebarman](http://www.spacebarman.com)'s music video [FOMO](https://www.youtube.com/watch?v=7elgfIqfh_I):

[![Spacebarman - FOMO - music video](band.jpg)](https://www.youtube.com/watch?v=7elgfIqfh_I)

Directories:
- _ESP32-src_. Arduino code for goggles
- _Python-MIDI-util_. Requires python-rtmidi (https://spotlightkid.github.io/python-rtmidi/)
- _RaspberryPi-util_. Utilities to maintain BLE MIDI connections active
