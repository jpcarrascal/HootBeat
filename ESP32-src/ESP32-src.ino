/*
 * Based on this example: https://github.com/max22-/ESP32-BLE-MIDI/blob/master/examples/03-Receiving-Data/03-Receiving-Data.ino
 * and Adafruit Neopixel goggles: https://learn.adafruit.com/kaleidoscope-eyes-neopixel-led-goggles-trinket-gemma/overview
 */

#include <Arduino.h>
#include <BLEMidi.h>
#include <Adafruit_NeoPixel.h>

#define PINL 16
#define PINR 17

Adafruit_NeoPixel left  = Adafruit_NeoPixel(12, PINL);
Adafruit_NeoPixel right = Adafruit_NeoPixel(12, PINR);

uint8_t  anim       = 100,  // Current animation
         offset     = 0,  // Position of spinny eyes
         dly        = 41, // Time delay
         colorCount = 3,  // For color fade
         maxCount   = 3;
float fade = 0;
uint32_t baseColor      = 0x080808,
         highlightColor = 0x777777,
         drumColor      = 0x000000,
         bdColor        = 0x0044FF,
         sdColor        = 0xFF0000;
uint32_t prevTime;
bool isRunning = true;

//uint32_t levels[] = {0x333333, 0x777777, 0xFFFFFF}; 

void connected();

void onNoteOn(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  isRunning = true;
  if(velocity > 0) {
    if(note == 36) {
      drumColor = bdColor;
      colorCount = maxCount;   
    }
    else if(note == 38) {
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
      case 9: // This body
        anim = 1;
        baseColor = 0x0000FF;
        break;
      case 3: // Lullaby
        baseColor = 0x0F0500, highlightColor = 0xFF5500, bdColor = 0xFF7700, sdColor = 0xFF1100;
        anim = 4;
        break;
      case 11: // No place for us
        anim = 1;
        baseColor = 0xFF5500;
        break;
      case 6: // Tantra
        anim = 2;
        baseColor = 0x00FFFF;
        break;
      case 0: // Clone
        anim = 2;
        baseColor = 0x000099;
        break;
      case 7: // Sex Tape
        baseColor = 0x03000B, highlightColor = 0x370097, bdColor = 0x4600FF, sdColor = 0x505050;
        anim = 100;
        break;
      case 1:
        baseColor = 0x080808, highlightColor = 0x777777, bdColor = 0xFF0000, sdColor = 0x0000FF;
        anim = 100;
        break;   
      default:
        baseColor = 0x080808, highlightColor = 0x777777, bdColor = 0x0044FF, sdColor = 0xFF0000;
        anim = 100;
        break;
    }
    Serial.printf("Received program change : channel %d, value %d (timestamp %dms)\n", channel, value, timestamp);
}

void connected()
{
  Serial.println("Connected");
}

void setup() {
  Serial.begin(115200);
  BLEMidiServer.begin("BT Goggle 1");
  BLEMidiServer.setOnConnectCallback(connected);
  BLEMidiServer.setOnDisconnectCallback([](){     // To show how to make a callback with a lambda function
    Serial.println("Disconnected");
  });
  BLEMidiServer.setNoteOnCallback(onNoteOn);
  BLEMidiServer.setNoteOffCallback(onNoteOff);
  BLEMidiServer.setControlChangeCallback(onControlChange);
  BLEMidiServer.setProgramChangeCallback(onProgramChange);
  //BLEMidiServer.enableDebugging();

  left.begin();
  right.begin();
  left.setBrightness(100);
  right.setBrightness(100);
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
    case 0: // All leds on
      for(i=0; i<12; i++) {
        uint32_t c = baseColor;
        left.setPixelColor (   i, c); // First eye
        right.setPixelColor(11-i, c); // Second eye
      }
      break;
    case 1: // Pulsating
      fade = sin( ((float) millis())/1200 );
      fade *= fade;
      for(i=0; i<12; i++) {
        uint32_t c = dimColor(baseColor, fade);
        left.setPixelColor (   i, c); // First eye
        right.setPixelColor(11-i, c); // Second eye
      }
      break;
    case 2: // Pulsating+rotating
      for(i=0; i<12; i++) {
        fade = sin( (float)(i+offset)/4 );
        fade *= fade;
        uint32_t c = dimColor(baseColor, fade);
        left.setPixelColor (11-i, c); // First eye
        right.setPixelColor(   i, c); // Second eye
        Serial.println(fade);
      }
      break;
    case 3: // Rotation, no drums
      for(i=0; i<12; i++) {
        uint32_t c = 0;
        if(i==offset || i==offset+6 || i==offset-6)
          c = baseColor;
        left.setPixelColor (   i, c); // First eye
        right.setPixelColor(11-i, c); // Second eye (flipped)
      }
      break;
    case 4: // Drums only
      maxCount = 5;
      for(i=0; i<12; i++) {
        uint32_t c = 0;
        fade = (float) colorCount / 3;
        fade *= fade;
        if(colorCount > 0)
          c = dimColor(drumColor, fade);
        left.setPixelColor (   i, c); // First eye
        right.setPixelColor(11-i, c); // Second eye (flipped)
      }
      break;
    case 100:
    default: // Rotation + BD + SD
      maxCount = 3;
      for(i=0; i<12; i++) {
        uint32_t c = 0;
        fade = (float) colorCount / 3;
        fade *= fade;
        if(colorCount > 0) {
          c = dimColor(drumColor, fade);
        if(i==offset || i==offset+6 || i==offset-6)
          c = dimColor(highlightColor, fade);
        } 
        else if(i==offset || i==offset+6 || i==offset-6)
          c = baseColor;
        left.setPixelColor (   i, c); // First eye
        right.setPixelColor(11-i, c); // Second eye (flipped)
      }
      break;
  }
  if(isRunning) { 
    left.show();
    right.show();
  } else {
      uint32_t c = 0;
      for(i=0; i<12; i++) {
        left.setPixelColor (   i, c); // First eye
        right.setPixelColor(11-i, c); // Second eye (flipped)
      }
    left.show();
    right.show();
  }
  offset++;
  if(offset>=12) offset = 0;
  if(colorCount>0) colorCount--;
  delay(dly);

}

uint32_t dimColor(uint32_t color, float fade) {
    uint8_t r = fade * (float) ((color >> 16) & 0x0000FF);
    uint8_t g = fade * (float) ((color >> 8) & 0x0000FF);
    uint8_t b = fade * (float) (color & 0x0000FF);
    uint32_t dimmedColor = (r<<16) + (g<<8) + (b);
    return (dimmedColor);
}
