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
// Hardware-specific
#define PINL 16
#define PINR 17
#define NUMLEDS 12
#define NUMSTRIPS 2

Adafruit_NeoPixel left  = Adafruit_NeoPixel(NUMLEDS, PINL);
Adafruit_NeoPixel right = Adafruit_NeoPixel(NUMLEDS, PINR);
Adafruit_NeoPixel strips[] = {left, right};
uint8_t directions[] = {LEFT, RIGHT};


uint8_t  anim       = 100,
         offset     = 0,
         dly        = 41,
         colorCount = 4,
         maxCount   = 4;
float fade = 0, fade2 = 0, fade3 = 0; // Color intensities
uint8_t r1=0, g1=0, b1=0;
uint8_t r2=0, g2=0, b2=0;
uint32_t connColor      = 0x080808,
         disconnColor   = 0x080000,
         baseColor      = disconnColor,
         //highlightColor = 0x777777,
         bdColor        = 0x0044FF,
         sdColor        = 0xFF0000;
bool isRunning = true, drums = false, strobeOn = true;

String addr;

void onNoteOn(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  isRunning = true;
  if(velocity > 0 && drums) {
    if(note == 36 && bdColor > 0) {
      baseColor = bdColor;
      colorCount = maxCount;   
    }
    else if(note == 38 && sdColor > 0) {
      baseColor = sdColor;
      colorCount = maxCount;    
    }
  }
  //Serial.printf("Received note on : channel %d, note %d, velocity %d (timestamp %dms)\n", channel, note, velocity, timestamp);
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
  bdColor = rgb2color(r1, g1, b1);
  baseColor = bdColor;
  if(controller == 123)
    r2 = value*2;
  if(controller == 124)
    g2 = value*2;
  if(controller == 125)
    b2 = value*2;
  sdColor = rgb2color(r2, g2, b2);
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
    isRunning = false;
    anim = value;
    Serial.print("Anim: ");
    Serial.println(anim);
}

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
    baseColor = connColor;
  });
  BLEMidiServer.setOnDisconnectCallback([](){     // To show how to make a callback with a lambda function
    Serial.println("Disconnected");
    baseColor = disconnColor;
    isRunning = true;
    anim = 100;
  });
  BLEMidiServer.setNoteOnCallback(onNoteOn);
  BLEMidiServer.setNoteOffCallback(onNoteOff);
  BLEMidiServer.setControlChangeCallback(onControlChange);
  BLEMidiServer.setProgramChangeCallback(onProgramChange);
  //BLEMidiServer.enableDebugging();

  for(int i=0; i<NUMSTRIPS; i++) {
    strips[i].begin();
    strips[i].setBrightness(100);
  }
}

void loop() {
  if (BLEMidiServer.isConnected()) {
      /*
      BLEMidiServer.noteOn(0, 69, 127);
      delay(1000);
      BLEMidiServer.noteOff(0, 69, 127);
      delay(1000);
      */
  }
  switch (anim) {
    case 0: // All leds on
      animAllOn(offset, baseColor);
      break;
    case 1: // Pulsating
      animPulsating(offset, baseColor);
      break;
    case 2: // Pulsating+rotating
      animPulsatingRotating(offset, baseColor);
      break;
    case 3: // Rotation, no drums
      animRotating(offset, baseColor);
      break;
    case 4: // Drums only
      animDrums(offset, baseColor, colorCount);
      break;
    case 5: // Alternating colors
      animAlternatingColors(offset, baseColor);
      break;
    case 6:
      animStrobe(offset, baseColor);
      break;
    case 7:
      animRotatingAndDrums(offset, baseColor, colorCount);
      break;
    default: // Rotation + BD + SD
      animRotatingAndDrums(offset, baseColor, colorCount);
      break;
  }
  if(!isRunning) {
    animOff();
  }
  for(int i=0; i<NUMSTRIPS; i++) {
    strips[i].show();
  }
  offset++;
  if(offset>=NUMLEDS) offset = 0;
  if(colorCount>0) colorCount--;
  delay(dly);
}

void setPixelAllStrips(uint8_t pixel, uint32_t color) {
  for(int j=0; j<NUMSTRIPS; j++) {
    strips[j].setPixelColor( directions[j] == LEFT? pixel : (NUMLEDS-(pixel+1)) , color);
  }
}

void animOff() {
  for(int i=0; i<NUMLEDS; i++) {
    setPixelAllStrips(i, 0x000000);
  }
}

void animAllOn(uint8_t offset, uint32_t color) {
  drums = false;
  for(int i=0; i<NUMLEDS; i++) {
    setPixelAllStrips(i, color);
  }
}

void animPulsating(uint8_t offset, uint32_t color) {
  drums = false;
  float fade = sin( ((float) millis())/1200 );
  fade *= fade;
  for(int i=0; i<NUMLEDS; i++) {
    uint32_t c = dimColor(color, fade);
    setPixelAllStrips(i, c);
  }
}

void animRotating(uint8_t offset, uint32_t color) {
  drums = false;
  for(int i=0; i<NUMLEDS; i++) {
    uint32_t c = 0;
    if(i==offset || i==offset+(NUMLEDS/2) || i==offset-(NUMLEDS/2))
      c = color;
    setPixelAllStrips(i, c);
  }
}

void animPulsatingRotating(uint8_t offset, uint32_t color) {
  drums = false;
  for(int i=0; i<NUMLEDS; i++) {
    float fade = sin( (float)(i+offset)/4 );
    fade *= fade;
    uint32_t c = dimColor(color, fade);
    setPixelAllStrips(i, c);
  }
}

void animAlternatingColors(uint8_t offset, uint32_t color) {
  drums = false;
  float fade =  sin( ((float) millis())/1200 );
  float fade2 = cos( ((float) millis())/1200 );
  fade  *= fade;
  fade2 *= fade2;
  for(int i=0; i<NUMLEDS; i++) {
    uint32_t c = dimColor(color, fade, 0, fade2);
    setPixelAllStrips(i, c);
  }
}

void animDrums(uint8_t offset, uint32_t color, uint8_t colorCount) {
  drums = true;
  for(int i=0; i<NUMLEDS; i++) {
    uint32_t c = 0;
    fade = (float) colorCount / maxCount;
    fade *= fade;
    if(colorCount > 0)
      c = dimColor(color, fade);
    setPixelAllStrips(i, c);
  }
}

void animRotatingAndDrums(uint8_t offset, uint32_t color, uint8_t colorCount) {
  drums = true;
  for(int i=0; i<NUMLEDS; i++) {
    uint32_t c = 0;
    float fade = (float) colorCount / 3;
    fade *= fade;
    if(colorCount > 0) {
        c = dimColor(color, fade);
      if(i==offset || i==offset+(NUMLEDS/2) || i==offset-(NUMLEDS/2))
        c = dimColor(color, fade);
    } else if(i==offset || i==offset+(NUMLEDS/2) || i==offset-(NUMLEDS/2)) {
      c = color;
    }
    setPixelAllStrips(i, c);
  }
}

void animStrobe(uint8_t offset, uint32_t color) {
  drums = false;
  uint32_t c;
  if(!strobeOn) {
    c = color;
    strobeOn = true;
  } else {
    c = 0x000000;
    strobeOn = false;
  }
  for(int i=0; i<NUMLEDS; i++) {
    setPixelAllStrips(i, c);
  }
}

uint32_t dimColor(uint32_t color, float fade) {
    uint8_t r = fade * (float) ((color >> 16) & 0x0000FF);
    uint8_t g = fade * (float) ((color >> 8) & 0x0000FF);
    uint8_t b = fade * (float) (color & 0x0000FF);
    uint32_t dimmedColor = (r<<16) + (g<<8) + (b);
    return (dimmedColor);
}

uint32_t dimColor(uint32_t color, float fade1, float fade2, float fade3) {
    uint8_t r = fade1 * (float) ((color >> 16) & 0x0000FF);
    uint8_t g = fade2 * (float) ((color >> 8) & 0x0000FF);
    uint8_t b = fade3 * (float) (color & 0x0000FF);
    uint32_t dimmedColor = (r<<16) + (g<<8) + (b);
    return (dimmedColor);
}

uint32_t rgb2color(uint8_t r, uint8_t g, uint8_t b) {
    uint32_t color = (r<<16) + (g<<8) + (b);
    return (color);
}
