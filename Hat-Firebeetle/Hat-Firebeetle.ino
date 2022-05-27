/*
 * Based on this example: https://github.com/max22-/ESP32-BLE-MIDI/blob/master/examples/03-Receiving-Data/03-Receiving-Data.ino
 * and Adafruit Neopixel goggles: https://learn.adafruit.com/kaleidoscope-eyes-neopixel-led-goggles-trinket-gemma/overview
 */

#include <Arduino.h>
#include <BLEMidi.h>
#include <Adafruit_NeoPixel.h>

#ifdef ESP32
  #include <WiFi.h>
#else
  #include <ESP8266WiFi.h>
#endif

#define PINL 16
#define OUTERRING 16


Adafruit_NeoPixel left  = Adafruit_NeoPixel(OUTERRING, PINL);

uint8_t  anim       = 100,  // Current animation
         offset     = 0,  // Position of spinny eyes
         dly        = 41, // Time delay
         colorCount = 3,  // For color envelope
         maxCount   = 3;
float fade = 0, fade2 = 0, fade3 = 0; // Color intensities
uint32_t connColor      = 0x080808,
         disconnColor   = 0x040008,
         baseColor      = disconnColor,
         highlightColor = 0x777777,
         drumColor      = 0x000000,
         bdColor        = 0x0044FF,
         sdColor        = 0xFF0000;
uint32_t prevTime;
bool isRunning = true,
     bdOn      = true,
     sdOn      = true;

String addr;

void connected();

void onNoteOn(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  isRunning = true;
  if(velocity > 0) {
    if(note == 36 && bdOn) {
      drumColor = bdColor;
      colorCount = maxCount;   
    }
    else if(note == 38 && sdOn) {
      drumColor = sdColor;
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
    Serial.printf("Received control change : channel %d, controller %d, value %d (timestamp %dms)\n", channel, controller, value, timestamp);
}

void onProgramChange(uint8_t channel, uint8_t value, uint16_t timestamp)
{
    isRunning = false;
    switch(value) {
      default:
        baseColor = connColor, highlightColor = 0x777777, bdColor = 0x0044FF, sdColor = 0xFF0000;
        bdOn = true, sdOn = true;
        maxCount = 3;
        anim = 100;
        break;
    }
    Serial.printf("Received program change : channel %d, value %d (timestamp %dms)\n", channel, value, timestamp);
}

void connected()
{
  Serial.println("Connected");
  baseColor = connColor;
}

void setup() {
  Serial.begin(115200);
  addr = WiFi.macAddress();
  Serial.println(addr);
  BLEMidiServer.begin("BT Hat");
  BLEMidiServer.setOnConnectCallback(connected);
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

  left.begin();
  left.setBrightness(100);
  prevTime = millis();
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


  uint8_t  i;
  switch (anim) {
    default: // Rotation + BD + SD
      for(i=0; i<OUTERRING; i++) {
        uint32_t c = 0;
        fade = (float) colorCount / 3;
        fade *= fade;
        if(colorCount > 0) {
          c = dimColor(drumColor, fade);
        if(i==offset || i==offset+OUTERRING/2 || i==offset-OUTERRING/2)
          c = dimColor(highlightColor, fade);
        } 
        else if(i==offset || i==offset+OUTERRING/2 || i==offset-OUTERRING/2)
          c = baseColor;
        left.setPixelColor (   i, c); // First eye
      }
      break;
  }
  if(isRunning) { 
    left.show();
  } else {
      uint32_t c = 0;
      for(i=0; i<OUTERRING; i++) {
        left.setPixelColor (   i, c); // First eye
      }
    left.show();
  }
  offset++;
  if(offset>=OUTERRING) offset = 0;
  if(colorCount>0) colorCount--;
  delay(dly);

}

void startAnim(uint32_t color) {
  uint32_t c;
  for(int offset=0; offset<OUTERRING; offset++) {
      for(uint8_t i=0; i<OUTERRING; i++) {
        if(i==offset || i==offset+OUTERRING/2 || i==offset-OUTERRING/2)
          c = color;
        else
          c = 0x000000;
        left.setPixelColor (   i, c); // First eye
    }
    left.show();
    delay(dly);
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