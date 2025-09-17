/*
 * Based on this example: https://github.com/max22-/ESP32-BLE-MIDI/blob/master/examples/03-Receiving-Data/03-Receiving-Data.ino
 * and Adafruit Neopixel goggles: https://learn.adafruit.com/kaleidoscope-eyes-neopixel-led-goggles-trinket-gemma/overview
 */

 #include <Arduino.h>
 #include <BLEMidi.h>
 #include <Adafruit_NeoPixel.h>
 #include <HootBeat.h>
 
 #define PINL 32
 #define NUMLEDS 13
 
 
 uint8_t disconnAnim = 10;
 uint8_t connAnim = 0;
 uint8_t anim = disconnAnim;
 uint8_t r1=0, g1=0, b1=0;
 uint8_t r2=0, g2=0, b2=0;
 uint32_t connColor      = 0x080808,
          disconnColor   = 0x0F00F0,
          bdColor        = 0x0044FF,
          sdColor        = 0xFF0000;
 
 HootBeat sidebar = HootBeat(NUMLEDS, PINL);
 
 void setup() {
   Serial.begin(115200);
   sidebar.setDelay(2);
   sidebar.setColor(disconnColor);
   BLEMidiServer.begin("2barHat");
   BLEMidiServer.setOnConnectCallback([](){
     Serial.println("Connected");
     sidebar.setColor(connColor);
     anim = connAnim;
   });
   BLEMidiServer.setOnDisconnectCallback([](){ // callback with a lambda function
     Serial.println("Disconnected");
     sidebar.setColor(disconnColor);
     sidebar.isRunning = true;
     anim = disconnAnim;
   });
   BLEMidiServer.setNoteOnCallback(onNoteOn);
   BLEMidiServer.setNoteOffCallback(onNoteOff);
   BLEMidiServer.setControlChangeCallback(onControlChange);
   BLEMidiServer.setProgramChangeCallback(onProgramChange);
   //BLEMidiServer.enableDebugging();
 }
 
 void loop() {
   if (BLEMidiServer.isConnected()) {
 
   }
   sidebar.step(anim);
   delay(40);
 }
 
 // MIDI Callbacks:
 
 void onNoteOn(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
 {
   sidebar.isRunning = true;
   if(velocity > 0) {// && hb.drums) {
     if(note == 36 && bdColor > 0) {
       sidebar.setColor(bdColor);
       sidebar.triggerFlash();
     }
     else if(note == 38 && sdColor > 0) {
       sidebar.setColor(sdColor);
       sidebar.triggerFlash();
     } else if(note == 49) {
       sidebar.setColor(bdColor);
       sidebar.triggerFlash(24);
     }
   }
   Serial.printf("Received note on : channel %d, note %d, velocity %d (timestamp %dms)\n", channel, note, velocity, timestamp);
 }
 
 void onNoteOff(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
 {
   //Serial.printf("Received note off : channel %d, note %d, velocity %d (timestamp %dms)\n", channel, note, velocity, timestamp);
 }
 
 void onControlChange(uint8_t channel, uint8_t controller, uint8_t value, uint16_t timestamp)
 {
   if(controller == 102)
     r1 = value*2;
   if(controller == 103)
     g1 = value*2;
   if(controller == 104)
     b1 = value*2;
   bdColor = sidebar.rgb2color(r1, g1, b1);
   sidebar.setColor(r1, g1, b1);
   if(controller == 105)
     r2 = value*2;
   if(controller == 106)
     g2 = value*2;
   if(controller == 107)
     b2 = value*2;
   sdColor = sidebar.rgb2color(r2, g2, b2);
   //Serial.printf("Received control change : channel %d, controller %d, value %d (timestamp %dms)\n", channel, controller, value, timestamp);
   if(controller == 102) {
     Serial.print("BD color: #");
     Serial.println(bdColor, HEX);
   }
   if(controller == 105) {
     Serial.print("SD color: #");
     Serial.println(sdColor, HEX);
   }
   if(controller == 111) {
     sidebar.isRunning = true;
     float fade = (float) value / 127;
     sidebar.dim(fade);
   }
 }
 
 void onProgramChange(uint8_t channel, uint8_t value, uint16_t timestamp)
 {
     sidebar.isRunning = false;
     anim = value;
     Serial.print("Anim: ");
     Serial.println(anim);
 }
 
 /*
 Index	Animation Name
0	All LEDs Off
1	All LEDs On
2	Pulsating
3	Pulsating + Rotating
4	Rotating (no drums)
5	Drums Only
6	Alternating Colors
7	Strobe
8	Rotating And Drums
9	Some On
10	Bounce
 */
 