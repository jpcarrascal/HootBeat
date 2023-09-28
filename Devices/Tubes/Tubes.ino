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

#define PINL 16
#define NUMLEDS 59
#define HALF_NUMLEDS 30
#define LEFT_TUBE_ADDR "7C:9E:BD:4B:07:A4"

String addr;

uint8_t anim = 100;
uint8_t r1=0, g1=0, b1=0;
uint8_t r2=0, g2=0, b2=0;
uint32_t connColor      = 0x080808,
         disconnColor   = 0x080000,
         bdColor        = 0x0044FF,
         sdColor        = 0xFF0000;

HootBeat hb = HootBeat(NUMLEDS, PINL);

void setup() {
  Serial.begin(115200);
  //delay(1000);
  Serial.print("Reading MAC address... ");
  addr = WiFi.macAddress();
  Serial.println(addr);
  if(addr == LEFT_TUBE_ADDR) {
      Serial.println("Left!");
      BLEMidiServer.begin("Left Tube");
  } else {
    Serial.println("Right!");
    BLEMidiServer.begin("Right Tube");
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
  Serial.println("Running");
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
  if(controller == 120)
    r1 = value*2;
  if(controller == 121)
    g1 = value*2;
  if(controller == 122)
    b1 = value*2;
  bdColor = hb.rgb2color(r1, g1, b1);
  hb.setColor(r1, g1, b1);
  if(controller == 123)
    r2 = value*2;
  if(controller == 124)
    g2 = value*2;
  if(controller == 125)
    b2 = value*2;
  sdColor = hb.rgb2color(r2, g2, b2);
  Serial.printf("Received control change : channel %d, controller %d, value %d (timestamp %dms)\n", channel, controller, value, timestamp);
  if(controller == 122) {
    Serial.print("BD color: #");
    Serial.println(bdColor, HEX);
  }
  if(controller == 125) {
    Serial.print("SD color: #");
    Serial.println(sdColor, HEX);
  }
}

void onProgramChange(uint8_t channel, uint8_t value, uint16_t timestamp)
{
    hb.isRunning = false;
    Serial.println("paused");
    anim = value;
    Serial.print("Anim: ");
    Serial.println(anim);
    Serial.printf("Received PC change : channel %d, value %d (timestamp %dms)\n", channel, value, timestamp);
}
