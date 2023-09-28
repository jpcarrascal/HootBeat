/*
  HootBeat.cpp - Neopixel animations to use with BLE MIDI
  Created by JP Carrascal (https://github.com/jpcarrascal).
  Released into the public domain.
*/
#include "hootbeat.h"

HootBeat::HootBeat(uint16_t numLeds, int pin1, int pin2) {
  this->numStrips = 2;
  this->numLeds = numLeds;
  setColor(DISCONNCOLOR);
  this->isRunning = true;
  /*
  // This should work but doesn't... it causes strange cycling
  for(int i=0; i<this->numStrips; i++) {
    this->strips[i] = Adafruit_NeoPixel(this->numLeds, *pins+i);
    this->directions[i] = i%2;
    this->strips[i].begin();
    this->strips[i].setBrightness(100);
  }
  */
  Adafruit_NeoPixel aStrip  = Adafruit_NeoPixel(this->numLeds, pin1);
  this->strips[0] = aStrip;
  this->directions[0] = 0;
  this->strips[0].begin();
  this->strips[0].setBrightness(255);
  Adafruit_NeoPixel aStrip2  = Adafruit_NeoPixel(this->numLeds, pin2);
  this->strips[1] = aStrip2;
  this->directions[1] = 1;
  this->strips[1].begin();
  this->strips[1].setBrightness(255);

}

HootBeat::HootBeat(uint16_t numLeds, int pin) {
  this->numStrips = 1;
  this->numLeds = numLeds;
  setColor(DISCONNCOLOR);
  this->isRunning = true;
  this->strips[0] = Adafruit_NeoPixel(this->numLeds, pin);
  this->directions[0] = 0;
  this->strips[0].begin();
  this->strips[0].setBrightness(100);
}

void HootBeat::setColor(uint32_t color) {
  this->color1 = color;
}

void HootBeat::step(uint8_t anim) {
  switch (anim) {
    case 0: // All leds on
      animAllOff();
      break;
    case 1: // All leds on
      animAllOn();
      break;
    case 2: // Pulsating
      animPulsating();
      break;
    case 3: // Pulsating+rotating
      animPulsatingRotating();
      break;
    case 4: // Rotation, no drums
      animRotating();
      break;
    case 5: // Drums only
      animDrums();
      break;
    case 6: // Alternating colors
      animAlternatingColors();
      break;
    case 7:
      animStrobe();
      break;
    case 8:
      animRotatingAndDrums();
      break;
    default: // Rotation + BD + SD
      animRotatingAndDrums();
      break;
  }
  if(!this->isRunning) {
    animAllOff();
  }
  for(int i=0; i<this->numStrips; i++) {
    this->strips[i].show();
  }
  this->offset++;
  if(this->offset >= this->numLeds) this->offset = 0;
  if(this->colorCount>0) this->colorCount--;
  delay(this->dly);
}

void HootBeat::triggerFlash() {
  if(this->drums) {
    this->maxCount = this->normalMaxCount;
    this->colorCount = this->maxCount;
  }
}

void HootBeat::triggerFlash(uint8_t length) {
  if(this->drums) {
    this->maxCount = length;
    this->colorCount = length;
  }
}

void HootBeat::setColor(uint8_t r, uint8_t g, uint8_t b) {
  this->color1 = rgb2color(r, g, b);
}

void HootBeat::setPixelAllStrips(uint8_t pixel, uint32_t color) {
  for(int j=0; j<this->numStrips; j++) {
    this->strips[j].setPixelColor( this->directions[j] == LEFT? pixel : (this->numLeds-(pixel+1)) , color );
  }
}

void HootBeat::animAllOff() {
  for(int i=0; i<this->numLeds; i++) {
    setPixelAllStrips(i, 0x000000);
  }
}

void HootBeat::animAllOn() {
  this->drums = false;
  for(int i=0; i<this->numLeds; i++) {
    setPixelAllStrips(i, this->color1);
  }
}

void HootBeat::animPulsating() {
  this->drums = false;
  float fade = sin( ((float) millis())/1200 );
  fade *= fade;
  for(int i=0; i<this->numLeds; i++) {
    uint32_t c = dimColor(this->color1, fade);
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animRotating() {
  this->drums = false;
  for(int i=0; i<this->numLeds; i++) {
    uint32_t c = 0;
    if(i==this->offset || i==this->offset+(this->numLeds/2) || i==this->offset-(this->numLeds/2))
      c = this->color1;
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animPulsatingRotating() {
  this->drums = false;
  for(int i=0; i<this->numLeds; i++) {
    float fade = sin( (float)(i+this->offset)/4 );
    fade *= fade;
    uint32_t c = dimColor(this->color1, fade);
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animAlternatingColors() {
  this->drums = false;
  float fade =  sin( ((float) millis())/1200 );
  float fade2 = cos( ((float) millis())/1200 );
  fade  *= fade;
  fade2 *= fade2;
  for(int i=0; i<this->numLeds; i++) {
    uint32_t c = dimColor(this->color1, fade, 0, fade2);
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animDrums() {
  this->drums = true;
  for(int i=0; i<this->numLeds; i++) {
    uint32_t c = 0;
    float fade = (float) this->colorCount / this->maxCount;
    fade *= fade;
    if(this->colorCount > 0)
      c = dimColor(this->color1, fade);
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animRotatingAndDrums() {
  this->drums = true;
  for(int i=0; i<this->numLeds; i++) {
    uint32_t c = 0;
    float fade = (float) this->colorCount / this->maxCount;
    fade *= fade;
    if(this->colorCount > 0) {
        c = dimColor(this->color1, fade);
      if(i==this->offset || i==this->offset+(this->numLeds/2) || i==this->offset-(this->numLeds/2))
        c = dimColor(this->color1, fade);
    } else if(i==this->offset || i==this->offset+(this->numLeds/2) || i==this->offset-(this->numLeds/2)) {
      c = this->color1;
    }
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animStrobe() {
  this->drums = false;
  uint32_t c;
  if(!this->strobeOn) {
    c = this->color1;
    this->strobeOn = true;
  } else {
    c = 0x000000;
    this->strobeOn = false;
  }
  for(int i=0; i<this->numLeds; i++) {
    setPixelAllStrips(i, c);
  }
}
/*
uint8_t HootBeat::animIndex(String anim) {
  for(int i=0; i<this->numAnimations; i++) {
    if( this->animations[i] == anim )
      return i;
  }
  return -1;
}
*/
uint32_t HootBeat::dimColor(uint32_t color, float fade) {
    uint8_t r = fade * (float) ((color >> 16) & 0x0000FF);
    uint8_t g = fade * (float) ((color >> 8) & 0x0000FF);
    uint8_t b = fade * (float) (color & 0x0000FF);
    uint32_t dimmedColor = (r<<16) + (g<<8) + (b);
    return (dimmedColor);
}

uint32_t HootBeat::dimColor(uint32_t color, float fade1, float fade2, float fade3) {
    uint8_t r = fade1 * (float) ((color >> 16) & 0x0000FF);
    uint8_t g = fade2 * (float) ((color >> 8) & 0x0000FF);
    uint8_t b = fade3 * (float) (color & 0x0000FF);
    uint32_t dimmedColor = (r<<16) + (g<<8) + (b);
    return (dimmedColor);
}

uint32_t HootBeat::rgb2color(uint8_t r, uint8_t g, uint8_t b) {
    uint32_t color = (r<<16) + (g<<8) + (b);
    return (color);
}
