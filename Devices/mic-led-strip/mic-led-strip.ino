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
#define LED_PIN 2
#define NUMLEDS 60


Adafruit_NeoPixel strip  = Adafruit_NeoPixel(NUMLEDS, PINL);

uint8_t r = 0, g = 0, b = 0;
uint8_t inValue;
uint32_t led[NUMLEDS], firstLedValue;
int dly = 20;
int count = 0;
bool ledStatus = false;

uint32_t color        = 0xFFFFFF,
         disconnColor = 0x000000;

void connected();

void onNoteOn(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  /*
  uint8_t index;
  if(velocity > 0) {
    if(note == 0) ccColor = 0xFF0000;
    if(note == 1) ccColor = 0x00FF00;
    if(note == 2) ccColor = 0x0000FF;
  } else {
    ccColor = 0x000000;
  }
  for(int i=0; i<NUMLEDS;i++) {
    colorCount[i] = maxCount;
  }
  saveColor = 0x000000;
  */
  //Serial.printf("Received note on : channel %d, note %d, velocity %d (timestamp %dms)\n", channel, note, velocity, timestamp);
  inValue = velocity;
}

void onNoteOff(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  //Serial.printf("Received note off : channel %d, note %d, velocity %d (timestamp %dms)\n", channel, note, velocity, timestamp);
}

void onControlChange(uint8_t channel, uint8_t controller, uint8_t value, uint16_t timestamp)
{
    if(controller == 102) {
      r = value*2;
      //color = rgb2color(r,g,b);
      Serial.println("r");
    }
    if(controller == 103) {
      g = value*2;
      //color = rgb2color(r,g,b);
      Serial.println("g");
    }
    if(controller == 104) {
      b = value*2;
      //color = rgb2color(r,g,b);
      Serial.println("b");
    }
    /*
    Serial.print(r);
    Serial.print("\t");
    Serial.print(g);
    Serial.print("\t");
    Serial.print(b);
    Serial.println();
    */
    //Serial.printf("Received control change : channel %d, controller %d, value %d (timestamp %dms)\n", channel, controller, value, timestamp);
    if(controller == 127) {
      firstLedValue = colorLevel(color, value);
    }
}

void onProgramChange(uint8_t channel, uint8_t value, uint16_t timestamp)
{
    switch(value) {
      default:
        break;
    }
    //Serial.printf("Received program change : channel %d, value %d (timestamp %dms)\n", channel, value, timestamp);
}

void connected()
{
  digitalWrite(LED_PIN, HIGH);
  Serial.println("Connected");
}

void setup() {
  pinMode (LED_PIN, OUTPUT);
  Serial.begin(115200);
  BLEMidiServer.begin("mic-led-strip");
  BLEMidiServer.setOnConnectCallback(connected);
  BLEMidiServer.setOnDisconnectCallback([](){     // To show how to make a callback with a lambda function
    Serial.println("Disconnected");
  });
  BLEMidiServer.setNoteOnCallback(onNoteOn);
  BLEMidiServer.setNoteOffCallback(onNoteOff);
  BLEMidiServer.setControlChangeCallback(onControlChange);
  BLEMidiServer.setProgramChangeCallback(onProgramChange);
  //BLEMidiServer.enableDebugging();

  strip.begin();
  strip.setBrightness(100);

  for(uint8_t i=0; i<NUMLEDS; i++) {
     led[i] == disconnColor;
  }
  strip.show();
}

void loop() {
  if (BLEMidiServer.isConnected()) {
     
  } else {
    if(count >= 30) {
      ledStatus = !ledStatus;
      digitalWrite(LED_PIN, ledStatus);
      count = 0;
    }
    count++;  
  }

  for(uint8_t j=0; j<NUMLEDS; j++) {
    strip.setPixelColor (j, led[j]);
  }

  led[NUMLEDS-1] = firstLedValue;
  for(uint8_t i=0; i<NUMLEDS-1; i++) { // FIFO
      led[i] = led[i+1];
  }
  firstLedValue = 0;
  strip.show();
  delay(dly);
}

uint32_t colorLevel(uint32_t color, uint8_t input) {
    float fade = ( (float) input ) / 127.0;
    uint8_t cr = fade * (float) ((color >> 16) & 0x0000FF);
    uint8_t cg = fade * (float) ((color >> 8) & 0x0000FF);
    uint8_t cb = fade * (float) (color & 0x0000FF);
    uint32_t dimmedColor = (cr<<16) + (cg<<8) + (cb);
    return (dimmedColor);
}

uint32_t rgb2color(uint8_t cr, uint8_t cg, uint8_t cb) {
    uint32_t outColor = (cr<<16) + (cg<<8) + (cb);
    return (outColor);
}
