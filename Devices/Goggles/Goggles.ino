/*
 * Based on this example: https://github.com/max22-/ESP32-BLE-MIDI/blob/master/examples/03-Receiving-Data/03-Receiving-Data.ino
 * and Adafruit Neopixel goggles: https://learn.adafruit.com/kaleidoscope-eyes-neopixel-led-goggles-trinket-gemma/overview
 */

#include <Arduino.h>
#include <BLEMidi.h>
#include <Adafruit_NeoPixel.h>
#include "hootbeat.h"

#ifdef ESP32
  #include <WiFi.h>
#else
  #include <ESP8266WiFi.h>
#endif

#define BOARD2 "94:B9:7E:D4:D1:50"
#define BOARD3 "7C:9E:BD:4B:30:44" //"C8:C9:A3:D1:F5:88" 

#define PINL 16
#define PINR 17
#define NUMLEDS 12

// Hardware-specific
HootBeat hb = HootBeat(NUMLEDS, PINL, PINR);

String addr;

void setup() {
  Serial.begin(115200);
  addr = WiFi.macAddress();
  Serial.println(addr);
  if(addr == BOARD2) {
      BLEMidiServer.begin("BT Goggle 2");
  } else if(addr == BOARD3) {
    BLEMidiServer.begin("BT Goggle 3");
  } else {
    BLEMidiServer.begin("BT Goggle 1");
  }
  BLEMidiServer.setOnConnectCallback([](){
    Serial.println("Connected");
    hb.setColor1(connColor);
    anim = 100;
  });
  BLEMidiServer.setOnDisconnectCallback([](){ // callback with a lambda function
    Serial.println("Disconnected");
    hb.setColor1(disconnColor);
    hb.isRunning = true;
    anim = 100;
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
  switch (anim) {
    case 0: // All leds on
      hb.animAllOff();
      break;
    case 1: // All leds on
      hb.animAllOn();
      break;
    case 2: // Pulsating
      hb.animPulsating();
      break;
    case 3: // Pulsating+rotating
      hb.animPulsatingRotating();
      break;
    case 4: // Rotation, no drums
      hb.animRotating();
      break;
    case 5: // Drums only
      hb.animDrums();
      break;
    case 6: // Alternating colors
      hb.animAlternatingColors();
      break;
    case 7:
      hb.animStrobe();
      break;
    case 8:
      hb.animRotatingAndDrums();
      break;
    default: // Rotation + BD + SD
      hb.animRotatingAndDrums();
      break;
  }
  hb.step();
}

// MIDI Callbacks:

void onNoteOn(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  hb.isRunning = true;
  if(velocity > 0 && drums) {
    if(note == 36 && bdColor > 0) {
      hb.setColor1(bdColor);
      hb.triggerFlash();  
    }
    else if(note == 38 && sdColor > 0) {
      hb.setColor1(sdColor);
      hb.triggerFlash();
    } else if(note == 49) {
      hb.setColor1(bdColor);
      hb.triggerFlash(24);
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
  if(controller == 120)
    r1 = value*2;
  if(controller == 121)
    g1 = value*2;
  if(controller == 122)
    b1 = value*2;
  bdColor = hb.rgb2color(r1, g1, b1);
  hb.setColor1(r1, g1, b1);
  if(controller == 123)
    r2 = value*2;
  if(controller == 124)
    g2 = value*2;
  if(controller == 125)
    b2 = value*2;
  sdColor = hb.rgb2color(r2, g2, b2);
  //Serial.printf("Received control change : channel %d, controller %d, value %d (timestamp %dms)\n", channel, controller, value, timestamp);
  if(controller == 122) {
    Serial.print("BD color: ");
    Serial.println(bdColor, HEX);
  }
  if(controller == 125) {
    Serial.print("SD color: ");
    Serial.println(sdColor, HEX);
  }
}

void onProgramChange(uint8_t channel, uint8_t value, uint16_t timestamp)
{
    hb.isRunning = false;
    anim = value;
    Serial.print("Anim: ");
    Serial.println(anim);
}
