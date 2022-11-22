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
#define NUMLEDS 23


Adafruit_NeoPixel hat  = Adafruit_NeoPixel(NUMLEDS, PINL);

uint8_t  anim       = 100,  // Current animation
         offset     = 0,  // Position of spinny eyes
         dly        = 41, // Time delay
         maxCount   = 4;

uint8_t colorCount[NUMLEDS];
uint32_t colors[NUMLEDS] = {
                            0xFF00FF, //0
                            0x0000FF,
                            0x00DDFF,
                            0x0000FF,
                            0xFF00FF, //4
                            0x0000FF,
                            0x00DDFF,
                            0x0000FF,
                            0xFF00FF, //8
                            0x0000FF,
                            0x00DDFF,
                            0x0000FF,
                            0xFF00FF, //12
                            0x0000FF,
                            0x00DDFF,
                            0x0000FF,
                            0x111111, //16
                            0x111111,
                            0x111111,
                            0x111111,
                            0x111111,
                            0x111111,
                            0xFFFFFF //center
                           };

float fade = 0, fade2 = 0, fade3 = 0; // Color intensities
uint32_t connColor      = 0x080808,
         disconnColor   = 0x040008,
         stepColor      = 0x0F00FF;

uint32_t prevTime;
bool isRunning = true,
     bdOn      = true,
     sdOn      = true;

String addr;

void connected();

void onNoteOn(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  isRunning = true;
  uint8_t index;
  if(velocity > 0) {
    if(note >= 36 && note < 36+NUMLEDS) {
      if(note < 36+12)
        index = note-32;
      else
        index = note - 48;
      colorCount[index] = maxCount;   
    }
    index = note - 36;
    if(index==0) {
      colorCount[22] = maxCount; 
    }
    if(index==0 || index == 8) {
      colorCount[21] = maxCount, colorCount[16] = maxCount, colorCount[17] = maxCount;
    }
    if(index==4 || index == 12) {
      colorCount[18] = maxCount, colorCount[19] = maxCount, colorCount[20] = maxCount;
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
        break;
    }
    //Serial.printf("Received program change : channel %d, value %d (timestamp %dms)\n", channel, value, timestamp);
}

void connected()
{
  Serial.println("Connected");
  stepColor = connColor;
}

void setup() {
  Serial.begin(115200);
  addr = WiFi.macAddress();
  Serial.println(addr);
  BLEMidiServer.begin("BT Hat");
  BLEMidiServer.setOnConnectCallback(connected);
  BLEMidiServer.setOnDisconnectCallback([](){     // To show how to make a callback with a lambda function
    Serial.println("Disconnected");
    stepColor = disconnColor;
    isRunning = true;
    anim = 100;
  });
  BLEMidiServer.setNoteOnCallback(onNoteOn);
  BLEMidiServer.setNoteOffCallback(onNoteOff);
  BLEMidiServer.setControlChangeCallback(onControlChange);
  BLEMidiServer.setProgramChangeCallback(onProgramChange);
  //BLEMidiServer.enableDebugging();

  hat.begin();
  hat.setBrightness(100);
  prevTime = millis();
}

void loop() {
  uint8_t  i;
  if (BLEMidiServer.isConnected()) {
    for(i=0; i<NUMLEDS; i++) {
      stepColor = colors[i];
      uint32_t c = 0;
      fade = (float) colorCount[i] / maxCount;
      fade *= fade;
      if(colorCount[i] > 0)
        c = dimColor(stepColor, fade);
      hat.setPixelColor (i, c);
    }
    if(isRunning) { 
      
    } else {
        uint32_t c = 0;
        for(i=0; i<NUMLEDS; i++) {
          hat.setPixelColor (i, c);
        }
    }
    for(i=0; i<NUMLEDS; i++) {
       if(colorCount[i]>0) colorCount[i]--; 
    }
  } else { // Not connected
    for(i=0; i<NUMLEDS; i++) {
        uint32_t c = 0;
        float phase = 0;
        if (i>=16 && i<22) {
          phase = 1;
        } else if(i==22) {
          phase = 2;
        }
        //fade /= 2;
        //1+sin(((float) millis())/300+phase)
        fade = 1 - abs( sin(((float) millis())/500+phase) );
        c = dimColor(0x0000D0, fade);
        hat.setPixelColor (i, c);
     }
  }
  hat.show();
  delay(dly);

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
