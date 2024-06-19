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
#define NUM_LEDS 59
#define HALF_NUM_LEDS 30
#define LEFT_TUBE_ADDR "7C:9E:BD:4B:07:A4"

Adafruit_NeoPixel tube  = Adafruit_NeoPixel(NUM_LEDS, PINL);

uint16_t t          = 0; // time
uint8_t  anim       = 100,  // Current animation
         offset     = 0,  // Position of spinny eyes
         dly        = 41, // Time delay
         colorCount = 3,  // For color envelope
         maxCount   = 3;
uint8_t r, g, b;
float fade = 0, fade2 = 0, fade3 = 0; // Color intensities
uint32_t connColor      = 0x000008,
         disconnColor   = 0x080808,
         baseColor      = disconnColor,
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
  if(controller >= 100 && controller <= 102) {
    if(controller == 100)
      r = value*2;
    if(controller == 101)
      g = value*2;
    if(controller == 102)
      b = value*2;
    uint32_t computedColor = rgb2color(r,g,b);
    bdColor = computedColor;
    sdColor = computedColor;
    baseColor = computedColor;
    Serial.println("Color change");
  } else if(controller = 103) {
    anim = value;
    Serial.println("Anim change");
  }
  Serial.printf("Received control change: channel %d, controller %d, value %d (timestamp %dms)\n", channel, controller, value, timestamp);
}

void onProgramChange(uint8_t channel, uint8_t value, uint16_t timestamp)
{
    isRunning = false;
    switch(value) {
      case 3: // Lullaby
        baseColor = 0x0F0500, bdColor = 0xFF7700, sdColor = 0xFF1100;
        bdOn = true, sdOn = true;
        anim = 2;
        maxCount = 3;
        break;
      case 11: // No place for us
        anim = 1;
        baseColor = 0xFF5500;
        break;
      case 6: // Tantra
        baseColor = 0x00FFFF, bdColor = 0x00FFFF, sdColor = 0x00FFFF;
        anim = 4;
        break;
      case 0: // Clone
        baseColor = 0x220099, bdColor = 0x220099, sdColor = 0x220099;
        bdOn = true, sdOn = true;
        anim = 2;
        break;
      case 7: // Sex Tape
        baseColor = 0x4600FF, bdColor = 0x4600FF, sdColor = 0x4600FF;
        bdOn = true, sdOn = true;
        maxCount = 3;
        anim = 2;
        break;
      case 2: // One with the machine
        baseColor = 0x00FFFF, bdColor = 0x00FF00, sdColor = 0x00FF00;
        bdOn = false, sdOn = true;
        maxCount = 3;
        anim = 4;
        break;
      case 9: // This body
        anim = 5;
        baseColor = 0xFF00FF;
        break; 
      case 1: //Si algun dia todo falla
        baseColor = 0xFF0000, bdColor = 0xFF0000, sdColor = 0x0000FF;
        bdOn = true, sdOn = false;
        maxCount = 3;
        anim = 4;
        break;
      case 5: // FOMO
        baseColor = 0x0044FF, bdColor = 0x0044FF, sdColor = 0x6600FF;
        bdOn = true, sdOn = false;
        maxCount = 3;
        anim = 4;
        break;
      case 10: // Lockdown
        baseColor = 0x0044FF, bdColor = 0x0044FF, sdColor = 0x000000;
        bdOn = true, sdOn = false;
        maxCount = 3;
        anim = 4;
        break;
      case 12: // Never let me down
        baseColor = 0xDD8888, bdColor = 0xDD8888, sdColor = 0xDD8888;
        bdOn = true, sdOn = false;
        maxCount = 3;
        anim = 2;
        break;
      case 18: // Si un dia te vas
        baseColor = 0xFF5500, bdColor = 0xFF5500, sdColor = 0x000000;
        bdOn = true, sdOn = false;
        maxCount = 3;
        anim = 2;
        break;
      case 127: // Audience interaction
        baseColor = 0x0044FF, bdColor = 0x0044FF, sdColor = 0xFF0000;
        bdOn = true, sdOn = true;
        maxCount = 3;
        anim = 4;
        break;
      default:
        baseColor = 0x0044FF, bdColor = 0x0044FF, sdColor = 0xFF0000;
        bdOn = true, sdOn = true;
        maxCount = 3;
        anim = 4;
        break;
    }
    Serial.printf("Received program change: channel %d, value %d (timestamp %dms)\n", channel, value, timestamp);
}

void connected()
{
  Serial.println("Connected");
  baseColor = connColor;
}

void setup() {
  Serial.begin(115200);
  delay(1000);
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
  //BLEMidiServer.begin("Left Tube");
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

  tube.begin();
  tube.setBrightness(100);
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
      for(i=0; i<NUM_LEDS; i++) {
        uint32_t c = baseColor;
        tube.setPixelColor (   i, c); // First eye
      }
      break;
    case 1: // Pulsating
      fade = sin( ((float) millis())/1200 );
      fade *= fade;
      for(i=0; i<NUM_LEDS; i++) {
        uint32_t c = dimColor(baseColor, fade);
        tube.setPixelColor (   i, c); // First eye
      }
      break;
    case 3: // Rotation, no drums
      for(i=0; i<NUM_LEDS; i++) {
        uint32_t c = 0;
        if(i==offset || i==offset+HALF_NUM_LEDS || i==offset-HALF_NUM_LEDS)
          c = baseColor;
        tube.setPixelColor (   i, c); // First eye
      }
      break;
    case 4: // Drums only
      for(i=0; i<NUM_LEDS; i++) {
        uint32_t c = 0;
        fade = (float) colorCount / 3;
        fade *= fade;
        if(colorCount > 0)
          c = dimColor(drumColor, fade);
        tube.setPixelColor (   i, c); // First eye
      }
      break;
    case 5: // Alternating colors
      fade =  sin( ((float) millis())/1200 );
      fade2 = cos( ((float) millis())/1200 );
      fade  *= fade;
      fade2 *= fade2;
      for(i=0; i<NUM_LEDS; i++) {
        uint32_t c = dimColor(baseColor, fade, 0, fade2);
        tube.setPixelColor (   i, c); // First eye
      }
      break;
    case 6: // Strobe
      fade = (t%3?0:1);
      fade *= fade;
      for(i=0; i<NUM_LEDS; i++) {
        uint32_t c = dimColor(baseColor, fade);
        tube.setPixelColor (   i, c); // First eye
      }
      break;
    case 100: // when turned on
      for(i=0; i<NUM_LEDS; i++) {
        uint32_t c = 0;
        if(i==offset)   c = baseColor;
        if(i==offset-1) c = dimColor(baseColor, 0.5);
        if(i==offset-2) c = dimColor(baseColor, 0.25);
        tube.setPixelColor (   i, c); // First eye
      }
      break;
    case 2:
    default: // Pulsating + rotating
      for(i=0; i<NUM_LEDS; i++) {
        fade = sin( (float)(i+t)/15 );
        fade *= fade;
        uint32_t c = dimColor(baseColor, fade);
        tube.setPixelColor (NUM_LEDS-1-i, c); // First eye
      }
      break;
  }
  if(isRunning) { 
    tube.show();
  } else {
      uint32_t c = 0;
      for(i=0; i<NUM_LEDS; i++) {
        tube.setPixelColor (   i, c); // First eye
      }
    tube.show();
  }
  t++;
  offset++;
  if(offset>=NUM_LEDS) offset = 0;
  if(colorCount>0) colorCount--;
  delay(dly);

}

void startAnim(uint32_t color) {
  uint32_t c;
  for(int offset=0; offset<NUM_LEDS; offset++) {
      for(uint8_t i=0; i<NUM_LEDS; i++) {
        if(i==offset || i==offset+HALF_NUM_LEDS || i==offset-HALF_NUM_LEDS)
          c = color;
        else
          c = 0x000000;
        tube.setPixelColor (   i, c); // First eye
    }
    tube.show();
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

uint32_t rgb2color(uint8_t r, uint8_t g, uint8_t b) {
    uint32_t color = (r<<16) + (g<<8) + (b);
    return (color);
}
