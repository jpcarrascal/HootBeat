#include "hootbeat.h"

/*
HootBeat::HootBeat() {
  // Constructor
}

void animOff() {
  for(uint8_t i=0; i<NUMLEDS; i++) {
    left.setPixelColor (   i, 0x000000); // First eye
    right.setPixelColor(11-i, 0x000000); // Second eye (flipped)
  }
}

void animAllOn(uint8_t offset, uint32_t color) {
  drums = false;
  for(uint8_t i=0; i<NUMLEDS; i++) {
    left.setPixelColor (   i, color); // First eye
    right.setPixelColor(11-i, color); // Second eye
  }
}

void animPulsating(uint8_t offset, uint32_t color) {
  drums = false;
  float fade = sin( ((float) millis())/1200 );
  fade *= fade;
  for(uint8_t i=0; i<NUMLEDS; i++) {
    uint32_t c = dimColor(color, fade);
    left.setPixelColor (   i, c); // First eye
    right.setPixelColor(11-i, c); // Second eye
  }
}

void animRotating(uint8_t offset, uint32_t color) {
  drums = false;
  for(uint8_t i=0; i<NUMLEDS; i++) {
    uint32_t c = 0;
    if(i==offset || i==offset+(NUMLEDS/2) || i==offset-(NUMLEDS/2))
      c = color;
    left.setPixelColor (   i, c); // First eye
    right.setPixelColor(11-i, c); // Second eye (flipped)
  }
}

void animPulsatingRotating(uint8_t offset, uint32_t color) {
  drums = false;
  for(uint8_t i=0; i<NUMLEDS; i++) {
    float fade = sin( (float)(i+offset)/4 );
    fade *= fade;
    uint32_t c = dimColor(color, fade);
    left.setPixelColor (11-i, c); // First eye
    right.setPixelColor(   i, c); // Second eye
  }
}

void animAlternatingColors(uint8_t offset, uint32_t color) {
  drums = false;
  float fade =  sin( ((float) millis())/1200 );
  float fade2 = cos( ((float) millis())/1200 );
  fade  *= fade;
  fade2 *= fade2;
  for(uint8_t i=0; i<NUMLEDS; i++) {
    uint32_t c = dimColor(color, fade, 0, fade2);
    left.setPixelColor (   i, c); // First eye
    right.setPixelColor(11-i, c); // Second eye
  }
}

void animDrums(uint8_t offset, uint32_t color, uint8_t colorCount) {
  drums = true;
  for(uint8_t i=0; i<NUMLEDS; i++) {
    uint32_t c = 0;
    fade = (float) colorCount / maxCount;
    fade *= fade;
    if(colorCount > 0)
      c = dimColor(color, fade);
    left.setPixelColor (   i, c); // First eye
    right.setPixelColor(11-i, c); // Second eye (flipped)
  }
}

void animRotatingAndDrums(uint8_t offset, uint32_t color, uint8_t colorCount) {
  drums = true;
  for(uint8_t i=0; i<NUMLEDS; i++) {
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
    left.setPixelColor (   i, c); // First eye
    right.setPixelColor(11-i, c); // Second eye (flipped)
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
  for(uint8_t i=0; i<NUMLEDS; i++) {
    left.setPixelColor (   i, c); // First eye
    right.setPixelColor(11-i, c); // Second eye
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
*/