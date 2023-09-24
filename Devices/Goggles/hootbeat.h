/*
  HootBeat.h - Nepixel BLE MIDI animations.
  Created by JP Carrascal (https://github.com/jpcarrascal).
  Released into the public domain.
*/
#ifndef HoootBeat_h
#define HootBeat_h

#include "Arduino.h"
#include <Adafruit_NeoPixel.h>

#define LEFT 0
#define RIGHT 1

extern Adafruit_NeoPixel strips[];
extern uint8_t directions[];

extern uint8_t  anim, offset, dly;
extern float fade, fade2, fade3; // Color intensities
extern uint8_t r1, g1, b1;
extern uint8_t r2, g2, b2;
extern uint32_t connColor, disconnColor, bdColor, sdColor;
extern bool drums, strobeOn;

class HootBeat {
  public:
    HootBeat(uint8_t numStrips, uint16_t numLeds);
    void step();
    void setColorCount();
    void setColor1(uint32_t color);
    void setColor1(uint8_t r, uint8_t g, uint8_t b);
    void setPixelAllStrips(uint8_t pixel, uint32_t color);
    void animOff();
    void animAllOn();
    void animPulsating();
    void animRotating();
    void animPulsatingRotating();
    void animAlternatingColors();
    void animDrums();
    void animRotatingAndDrums();
    void animStrobe();
    uint32_t rgb2color(uint8_t r, uint8_t g, uint8_t b);
    bool isRunning;
  private:
    uint32_t color1;
    uint8_t offset = 0;
    uint8_t dly = 41;
    uint8_t colorCount = 4;
    uint8_t maxCount = 4;
    uint8_t numStrips;
    uint16_t numLeds;
    uint32_t dimColor(uint32_t color, float fade);
    uint32_t dimColor(uint32_t color, float fade1, float fade2, float fade3);
};

#endif