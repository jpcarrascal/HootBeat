
#include <Wire.h>
#include "SparkFun_VCNL4040_Arduino_Library.h"
#include <Adafruit_NeoPixel.h>

#define PINL 12
#define NUMLEDS 35
VCNL4040 proximitySensor;
Adafruit_NeoPixel strip  = Adafruit_NeoPixel(NUMLEDS, PINL);

int dly = 20,
    offset = 0,
    animCounter = 0;
uint32_t led[NUMLEDS], firstLedValue, color = 0xCC00FF;;
long startingProxValue = 0;
long deltaNeeded = 0;
boolean nothingThere = false;

void setup()
{
  Serial.begin(9600);
  Serial.println("SparkFun VCNL4040 Example");
  Wire.begin(23, 19); //Join i2c bus
  if (proximitySensor.begin() == false)
  {
    Serial.println("Device not found. Please check wiring.");
    while (1); //Freeze!
  }
  //Set the current used to drive the IR LED - 50mA to 200mA is allowed.
  proximitySensor.setLEDCurrent(200); //For this example, let's do max.
  //The sensor will average readings together by default 8 times.
  //Reduce this to one so we can take readings as fast as possible
  proximitySensor.setProxIntegrationTime(8); //1 to 8 is valid
  //proximitySensor.disableSmartPersistance();
  //Take 8 readings and average them
  for(byte x = 0 ; x < 8 ; x++)
  {
    startingProxValue += proximitySensor.getProximity();
  }
  startingProxValue /= 8;
  startingProxValue = 2;
  Serial.print("THRSLD: ");
  Serial.println(startingProxValue);
  deltaNeeded = (float)startingProxValue * 0.04; //Look for 5% change
  if(deltaNeeded < 4) deltaNeeded = 4; //Set a minimum
  /* -------- NEOPIXEL ----------*/

  strip.begin();
  strip.setBrightness(100);
  strip.show();
}

void loop()
{
  unsigned int proxValue = proximitySensor.getProximity(); 

  //Serial.print("Prox: ");
  //Serial.println(proxValue);

  //Let's only trigger if we detect a 5% change from the starting value
  //Otherwise, values at the edge of the read range can cause false triggers

    if((proxValue > (startingProxValue + deltaNeeded) || animCounter > 0) && proxValue < 5000 ) {
      Serial.println("Something is there!");
      nothingThere = false;
      animPulsationRotation(&strip, offset, color);
      if(animCounter == 0) {
        animCounter = NUMLEDS;
      }
    } else if(animCounter == 0) {
      //if(nothingThere == false) Serial.print("I don't see anything");
      color = 0xCC00FF;
      if(millis()%3 == 1) color = 0x00CCFF;
      if(millis()%3 == 2) color = 0xCCFF00;
      nothingThere = true;
      animRotation(&strip, offset, 0x000022);
    }
  offset++;
  if(offset>NUMLEDS) offset = 0;
  if(animCounter > 0) animCounter--;
  delay(dly);
}

void animPulsationRotation(Adafruit_NeoPixel *strip, int offset, uint32_t color) {
  for(uint8_t j=0; j<NUMLEDS; j++) {
    strip->setPixelColor (j, led[j]);
  }
  if(offset<=NUMLEDS) {
    float fade = sin( (float)(offset)/4 ); fade *= fade;
    firstLedValue = dimColor(color, fade);
  }
  led[NUMLEDS-1] = firstLedValue;
  for(uint8_t i=0; i<NUMLEDS-1; i++) { // FIFO
      led[i] = led[i+1];
  }
  firstLedValue = 0;
  strip->show();
}

void animRotation(Adafruit_NeoPixel *strip, int offset, uint32_t color) {
  for(uint8_t j=0; j<NUMLEDS; j++) {
    strip->setPixelColor (j, led[j]);
  }
  if(offset<=NUMLEDS) {
    if(offset == 0)// || offset == NUMLEDS / 2)
      firstLedValue = color;
    else
      firstLedValue = 0;
  }
  led[NUMLEDS-1] = firstLedValue;
  for(uint8_t i=0; i<NUMLEDS-1; i++) { // FIFO
      led[i] = led[i+1];
  }
  firstLedValue = 0;
  strip->show();
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
