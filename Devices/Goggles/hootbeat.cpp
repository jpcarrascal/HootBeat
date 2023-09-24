#include "hootbeat.h"

uint8_t anim = 100;
float fade = 0, fade2 = 0, fade3 = 0; // Color intensities
uint8_t r1=0, g1=0, b1=0;
uint8_t r2=0, g2=0, b2=0;
uint32_t connColor      = 0x080808,
         disconnColor   = 0x080000,
         color1         = 0x080000,
         bdColor        = 0x0044FF,
         sdColor        = 0xFF0000;
bool drums = false, strobeOn = true;

HootBeat::HootBeat(uint8_t numStrips, uint16_t numLeds) {
  // Constructor
  this->numStrips = numStrips;
  this->numLeds = numLeds;
  setColor1(disconnColor);
  isRunning = true;
}

void HootBeat::setColor1(uint32_t color) {
  this->color1 = color;
}

void HootBeat::step() {
  if(!this->isRunning) {
    animOff();
  }
  this->offset++;
  if(this->offset >= this->numLeds) this->offset = 0;
  if(this->colorCount>0) this->colorCount--;
  delay(this->dly);
}

void HootBeat::setColorCount() {
  this->colorCount = this->maxCount;
}

void HootBeat::setColor1(uint8_t r, uint8_t g, uint8_t b) {
  this->color1 = rgb2color(r, g, b);
}

void HootBeat::setPixelAllStrips(uint8_t pixel, uint32_t color) {
  for(int j=0; j<this->numStrips; j++) {
    strips[j].setPixelColor( directions[j] == LEFT? pixel : (this->numLeds-(pixel+1)) , color);
  }
}

void HootBeat::animOff() {
  for(int i=0; i<this->numLeds; i++) {
    setPixelAllStrips(i, 0x000000);
  }
}

void HootBeat::animAllOn() {
  drums = false;
  for(int i=0; i<this->numLeds; i++) {
    setPixelAllStrips(i, this->color1);
  }
}

void HootBeat::animPulsating() {
  drums = false;
  float fade = sin( ((float) millis())/1200 );
  fade *= fade;
  for(int i=0; i<this->numLeds; i++) {
    uint32_t c = dimColor(this->color1, fade);
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animRotating() {
  drums = false;
  for(int i=0; i<this->numLeds; i++) {
    uint32_t c = 0;
    if(i==this->offset || i==this->offset+(this->numLeds/2) || i==this->offset-(this->numLeds/2))
      c = this->color1;
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animPulsatingRotating() {
  drums = false;
  for(int i=0; i<this->numLeds; i++) {
    float fade = sin( (float)(i+this->offset)/4 );
    fade *= fade;
    uint32_t c = dimColor(this->color1, fade);
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animAlternatingColors() {
  drums = false;
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
  drums = true;
  for(int i=0; i<this->numLeds; i++) {
    uint32_t c = 0;
    fade = (float) this->colorCount / this->maxCount;
    fade *= fade;
    if(this->colorCount > 0)
      c = dimColor(this->color1, fade);
    setPixelAllStrips(i, c);
  }
}

void HootBeat::animRotatingAndDrums() {
  drums = true;
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
  drums = false;
  uint32_t c;
  if(!strobeOn) {
    c = this->color1;
    strobeOn = true;
  } else {
    c = 0x000000;
    strobeOn = false;
  }
  for(int i=0; i<this->numLeds; i++) {
    setPixelAllStrips(i, c);
  }
}

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
