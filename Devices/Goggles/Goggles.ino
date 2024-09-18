/*
 * Based on this example: https://github.com/max22-/ESP32-BLE-MIDI/blob/master/examples/03-Receiving-Data/03-Receiving-Data.ino
 * and Adafruit Neopixel goggles: https://learn.adafruit.com/kaleidoscope-eyes-neopixel-led-goggles-trinket-gemma/overview
 */

#include <Arduino.h>
#include <BLEMidi.h>
#include <Adafruit_NeoPixel.h>
#include <HootBeat.h>

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

String addr;

uint8_t anim = 100;
uint8_t r1=0, g1=0, b1=0;
uint8_t r2=0, g2=0, b2=0;
uint32_t connColor      = 0x080808,
         disconnColor   = 0x080000,
         bdColor        = 0x0044FF,
         sdColor        = 0xFF0000;

HootBeat hb = HootBeat(NUMLEDS, PINL, PINR);

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
    hb.setColor(connColor);
    anim = 100;
  });
  BLEMidiServer.setOnDisconnectCallback([](){ // callback with a lambda function
    Serial.println("Disconnected");
    hb.setColor(disconnColor);
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
  hb.step(anim);
}

// MIDI Callbacks:

void onNoteOn(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  hb.isRunning = true;
  if(velocity > 0) {// && hb.drums) {
    if(note == 36 && bdColor > 0) {
      hb.setColor(bdColor);
      hb.triggerFlash();  
    }
    else if(note == 38 && sdColor > 0) {
      hb.setColor(sdColor);
      hb.triggerFlash();
    } else if(note == 49) {
      hb.setColor(bdColor);
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
  if(controller == 100)
    r1 = value*2;
  if(controller == 101)
    g1 = value*2;
  if(controller == 102)
    b1 = value*2;
  bdColor = hb.rgb2color(r1, g1, b1);
  hb.setColor(r1, g1, b1);
  if(controller == 103)
    r2 = value*2;
  if(controller == 104)
    g2 = value*2;
  if(controller == 105)
    b2 = value*2;
  sdColor = hb.rgb2color(r2, g2, b2);
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
    hb.isRunning = true;
    float fade = (float) value / 127;
    hb.dim(fade);
  }
}

void onProgramChange(uint8_t channel, uint8_t value, uint16_t timestamp)
{
    hb.isRunning = false;
    anim = value;
    Serial.print("Anim: ");
    Serial.println(anim);
}
