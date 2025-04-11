/*
  HootBeat.cpp - Neopixel animations to use with BLE MIDI
  Created by JP Carrascal (https://github.com/jpcarrascal).
  Released into the public domain.
*/
#ifndef HoootBeat_h
#define HootBeat_h

#include "Arduino.h"
#include <Adafruit_NeoPixel.h>

#define LEFT 0
#define RIGHT 1
#define DISCONNCOLOR 0x080000

/*
  Animations:
  0: "allOff", all leds off, no animation
  1: "allOn", all leds on, no animation
  2: "pulsating", al LEDs light slowly dims to zero and back to max
  3: "pulsatingRotating", wave of light going along the srip
  4: "rotating", a par of lights move along the strip
  5: "drums", all LED react to drum hits
  6: "alternatingColors", cycling between two colors
  7: "strobe", stroboscopic light
  8: "rotatingAndDrums", 2 lights move along the strip + drum reaction 
*/

class HootBeat {
  public:
    HootBeat(uint16_t numLeds, int pin1, int pin2);
    HootBeat(uint16_t numLeds, int pin);
    void step(uint8_t anim);
    void triggerFlash();
    void triggerFlash(uint8_t length);
    void setColor(uint32_t color);
    void setColor(uint8_t r, uint8_t g, uint8_t b);
    void setDelay(uint8_t dly);
    void setSomeOn(uint16_t onLeds);
    void dim(float fade);
    void setPixelAllStrips(uint8_t pixel, uint32_t color);
    void animAllOff();
    void animAllOn();
    void animSomeOn();
    void animPulsating();
    void animRotating();
    void animPulsatingRotating();
    void animAlternatingColors();
    void animDrums();
    void animRotatingAndDrums();
    void animStrobe();
    uint32_t rgb2color(uint8_t r, uint8_t g, uint8_t b);
    bool isRunning;
    bool drums;
  private:
    uint32_t color1;
    uint8_t offset = 0;
    uint8_t dly = 41;
    uint8_t colorCount = 4;
    uint8_t maxCount = 4;
    uint8_t normalMaxCount = 4;
    uint8_t numStrips;
    uint16_t numLeds;
    uint16_t onLeds;
    uint16_t wereOnLeds;
    Adafruit_NeoPixel strips[2]; // Max 2 for now
    uint8_t directions[2]; // Max 2 for now
    bool strobeOn = true;
    //uint8_t numAnimations = 10;
    //String animations[10] = {"allOff", "allOn", "pulsating", "pulsatingRotating", "rotating", "drums", "alternatingColors", "strobe", "rotatingAndDrums", ""};
    //uint8_t animIndex(String anim);
    uint32_t dimColor(uint32_t color, float fade);
    uint32_t dimColor(uint32_t color, float fade1, float fade2, float fade3);
};

#endif