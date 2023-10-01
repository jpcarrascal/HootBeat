const playlist = [
    {"pc":0, "name": "Clone",                      "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":1, "name": "Si algun día todo falla",    "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":2, "name": "One with the machine",       "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":3, "name": "Lullaby",                    "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":4, "name": "Bad boy",                  "samples": "BadBoy", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":5, "name": "FOMO",                       "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":6, "name": "Tantra",                     "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":7, "name": "Sex tape",                   "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":9, "name": "This body",                  "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":10,"name": "Lockdown",                   "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":11,"name": "No place for us",            "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":12,"name": "Never let me down",          "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":18,"name": "Si un día te vas",   "samples": "SiUnDiaTeVas", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":19,"name": "El Ansia",                "samples": "ElAnsia", "audience_goggles": false, "audience_tubes": false, "show": true}
];

const tubeScenes = [
    {"pc": 0, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "This Body Shimmer",               "cc": 127, "id": 1, "color1": "FF00FF", "color2": "000000", "anim": "allOn"}
        ]
    },
    {"pc": 1, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "Strobe on SADTF",                 "cc": 127, "id": 1, "color1": "FF0000", "color2": "000000", "anim": "strobe"}
        ]
    },
    {"pc": 2, "scenes": [
            {"name": "Default/synth",                   "cc": 127, "id": 0, "color1": "00FF00", "color2": "000000", "anim": "drums"},
            {"name": "Verses -  One with the machine",  "cc": 127, "id": 1, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "Chorus",                          "cc": 127, "id": 2, "color1": "00FFFF", "color2": "000000", "anim": "pulsatingRotating"},
            {"name": "Srobe last chorus",               "cc": 127, "id": 3, "color1": "00FFFF", "color2": "000000", "anim": "strobe"}
        ]
    },
    {"pc": 3, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "Spider man talks",                "cc": 127, "id": 1, "color1": "000000", "color2": "FFFF00", "anim": "drums"},
            {"name": "Spinning thing",                  "cc": 127, "id": 2, "color1": "00FF00", "color2": "000000", "anim": "strobe"},
            {"name": "End, distortion",                 "cc": 127, "id": 3, "color1": "FF0000", "color2": "FF0000", "anim": "drums"}
        ]
    },
    {"pc": 4, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "Drums on BadBoy, distortion",      "cc": 127, "id": 1, "color1": "FF0000", "color2": "FF0000", "anim": "drums"}
        ]
    },
    {"pc": 5, "scenes": [
            {"name": "Default - FOMO BD",               "cc": 127, "id": 0, "color1": "9900FF", "color2": "000000", "anim": "drums"},
            {"name": "FOMO synth",                      "cc": 127, "id": 1, "color1": "9900FF", "color2": "000000", "anim": "pulsatingRotating"}
        ]
    },
    {"pc": 6, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "Tantra intro Drums",              "cc": 127, "id": 1, "color1": "00FFFF", "color2": "000000", "anim": "drums"},
            {"name": "Tantra Drums, distortion",        "cc": 127, "id": 2, "color1": "00FFFF", "color2": "00FFFF", "anim": "drums"}
        ]
    },
    {"pc": 7, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "Sex Tape synth",                  "cc": 127, "id": 1, "color1": "4600FF", "color2": "000000", "anim": "pulsating"},
            {"name": "Sex Tape distortion",             "cc": 127, "id": 2, "color1": "4600FF", "color2": "000000", "anim": "strobe"}
        ]
    },
    {"pc": 8, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
        ]
    },
    {"pc": 9, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "This Body Shimmer",               "cc": 127, "id": 1, "color1": "FF00FF", "color2": "000000", "anim": "allOn"},
            {"name": "This Body Distortion",            "cc": 127, "id": 2, "color1": "FF00FF", "color2": "FF00FF", "anim": "drums"}
        ]
    },
    {"pc": 10, "scenes": [
            {"name": "Default - Drums BD",              "cc": 127, "id": 0, "color1": "0000FF", "color2": "000000", "anim": "drums"},
            {"name": "Lockdown distortion",             "cc": 127, "id": 1, "color1": "F000FF", "color2": "F000FF", "anim": "drums"}
        ]
    },
    {"pc": 11, "scenes": [
            {"name": "Default-No Place For Us",         "cc": 127, "id": 0, "color1": "993300", "color2": "999900", "anim": "pulsatingRotating"},
        ]
    },
    {"pc": 12, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "Never let me down chorus",        "cc": 127, "id": 1, "color1": "0000FF", "color2": "000000", "anim": "pulsatingRotating"},
            {"name": "Never let me down dist",          "cc": 127, "id": 2, "color1": "FF00FF", "color2": "FF00FF", "anim": "drums"}
        ]
    },
    {"pc": 13, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"}
        ]
    },
    {"pc": 14, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
        ]
    },
    {"pc": 15, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
        ]
    },
    {"pc": 16, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
        ]
    },
    {"pc": 17, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
        ]
    },
    {"pc": 18, "scenes": [
            {"name": "Default",                         "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "allOff"},
            {"name": "Si un dia te vas pad guitar",     "cc": 127, "id": 1, "color1": "883300", "color2": "000000", "anim": "pulsating"},
            {"name": "Si un dia te vas distortion",     "cc": 127, "id": 2, "color1": "FF8800", "color2": "FF8800", "anim": "drums"}
        ]
    },
    {"pc": 19, "scenes": [
            {"name": "Default - Ansia Drums",           "cc": 127, "id": 0, "color1": "33FF00", "color2": "33FF00", "anim": "drums"},
            {"name": "El Ansia distortion",             "cc": 127, "id": 1, "color1": "33FF00", "color2": "33FF00", "anim": "drums"}
        ]
    }
];

const goggleScenes = [
    {"pc":0,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "220099", "color2": "220099", "anim": "pulsating"}	
        ]
    },
    {"pc":1,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "FF0000", "color2": "000000", "anim": "drums"}	
        ]
    },
    {"pc":2,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "00FF00", "color2": "00FFFF", "anim": "drums"}	
        ]
    },
    {"pc":3,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "FF7700", "color2": "FF1100", "anim": "drums"}	
        ]
    },
    {"pc":4,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "FF0000", "color2": "FF0000", "anim": "drums"}	
        ]
    },
    {"pc":5,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "000000", "color2": "8800FF", "anim": "drums"}	
        ]
    },
    {"pc":6,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "00FFFF", "color2": "00FFFF", "anim": "pulsatingRotating"}	
        ]
    },
    {"pc":7,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "000000", "color2": "4600FF", "anim": "drums"}	
        ]
    },
    {"pc":8,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "FF0000", "color2": "FF0000", "anim": "drums"}	
        ]
    },
    {"pc":9,  "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "FF00FF", "color2": "FF00FF", "anim": "alternatingColors"}	
        ]
    },
    {"pc":10, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "000000", "color2": "0000FF", "anim": "drums"}	
        ]
    },
    {"pc":11, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "FF5500", "color2": "FF5500", "anim": "pulsating"}	
        ]
    },
    {"pc":12, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "0000FF", "color2": "0000FF", "anim": "drums"}	
        ]
    },
    {"pc":13, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "drums"}	
        ]
    },
    {"pc":14, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "drums"}	
        ]
    },
    {"pc":15, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "drums"}	
        ]
    },
    {"pc":16, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "drums"}	
        ]
    },
    {"pc":17, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "000000", "color2": "000000", "anim": "drums"}	
        ]
    },
    {"pc":18, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "FF8800", "color2": "FF8800", "anim": "drums"}	
        ]
    },
    {"pc":19, "scenes": [
        {"name": "Default", "cc": 127, "id": 0, "color1": "33FF00", "color2": "33FF00", "anim": "drums"}	
        ]
    },
];

const defaultGoggleScenes = [
    {"pc":0,  "color1": "220099", "color2": "220099", "anim": "pulsating"},
    {"pc":1,  "color1": "FF0000", "color2": "000000", "anim": "drums"},
    {"pc":2,  "color1": "00FF00", "color2": "00FFFF", "anim": "drums"},
    {"pc":3,  "color1": "FF7700", "color2": "FF1100", "anim": "drums"},
    {"pc":4,  "color1": "FF0000", "color2": "FF0000", "anim": "drums"},
    {"pc":5,  "color1": "8800FF", "color2": "8800FF", "anim": "drums"},
    {"pc":6,  "color1": "00FFFF", "color2": "00FFFF", "anim": "pulsatingRotating"},
    {"pc":7,  "color1": "000000", "color2": "4600FF", "anim": "drums"},
    {"pc":8,  "color1": "FF0000", "color2": "FF0000", "anim": "drums"},
    {"pc":9,  "color1": "FF00FF", "color2": "FF00FF", "anim": "alternatingColors"},
    {"pc":10, "color1": "0000FF", "color2": "0000FF", "anim": "drums"},
    {"pc":11, "color1": "FF5500", "color2": "FF5500", "anim": "pulsating"},
    {"pc":12, "color1": "0000FF", "color2": "0000FF", "anim": "drums"},
    {"pc":13, "color1": "000000", "color2": "000000", "anim": "drums"},
    {"pc":14, "color1": "000000", "color2": "000000", "anim": "drums"},
    {"pc":15, "color1": "000000", "color2": "000000", "anim": "drums"},
    {"pc":16, "color1": "000000", "color2": "000000", "anim": "drums"},
    {"pc":17, "color1": "000000", "color2": "000000", "anim": "drums"},
    {"pc":18, "color1": "FF5500", "color2": "FF5500", "anim": "drums"},
    {"pc":19, "color1": "00FF00", "color2": "DDDD00", "anim": "drums"},
];

const defaultTubeScenes = [
{"pc":0,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":1,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":2,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":3,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":4,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":5,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":6,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":7,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":8,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":9,  "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":10, "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":11, "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":12, "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":13, "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":14, "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":15, "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":16, "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":17, "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":18, "color1": "000000", "color2": "000000", "anim": "allOff"},
{"pc":19, "color1": "000000", "color2": "000000", "anim": "allOff"},
];

const allTracks = [
    {"pc":0, "name": "Clone",                      "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":1, "name": "Si algun día todo falla",    "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":2, "name": "One with the machine",       "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":3, "name": "Lullaby",                    "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":4, "name": "Bad boy",                  "samples": "BadBoy", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":5, "name": "FOMO",                       "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":6, "name": "Tantra",                     "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":7, "name": "Sex tape",                   "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":8, "name": "One night",                 "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": false},
    {"pc":9, "name": "This body",                  "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":10,"name": "Lockdown",                   "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":11,"name": "No place for us",            "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":12,"name": "Never let me down",          "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":13,"name": "The place you'll never see","samples": "none", "audience_goggles": false, "audience_tubes": false, "show": false},
    {"pc":14,"name": "Sin Fin",                   "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": false},
    {"pc":15,"name": "Angel Electrico",           "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": false},
    {"pc":16,"name": "SADTF2",                    "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": false},
    {"pc":17,"name": "FOMO slow",                 "samples": "none", "audience_goggles": false, "audience_tubes": false, "show": false},
    {"pc":18,"name": "Si un día te vas",   "samples": "SiUnDiaTeVas", "audience_goggles": false, "audience_tubes": false, "show": true},
    {"pc":19,"name": "El Ansia",                "samples": "ElAnsia", "audience_goggles": false, "audience_tubes": false, "show": true}
];

/*
Tubes info:

switch (anim) {
case 0: // All leds on
case 1: // Pulsating
case 3: // Rotation, no drums
case 4: // Drums only
case 5: // Alternating colors
case 6: // Strobe
case 100: // when turned on
case 2:
default: // Pulsating + rotating


Lullaby:          2
No place for us:  1
Tantra:           4
Clone:            2
Sex Tape:         2
One with tM:      4
This body:        5
SADTF:            4
FOMO:             4
Lockdown:         4
Never let me:     2
Si un dia te vas: 2
Default:          4
*/