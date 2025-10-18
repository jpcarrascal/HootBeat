/*
 * Based on this example: https://github.com/max22-/ESP32-BLE-MIDI/blob/master/examples/03-Receiving-Data/03-Receiving-Data.ino
 * and Adafruit Neopixel goggles: https://learn.adafruit.com/kaleidoscope-eyes-neopixel-led-goggles-trinket-gemma/overview
 */

#include <Arduino.h>
#include <BLEMidi.h>
#include <Adafruit_NeoPixel.h>
#include <HootBeat.h>

#ifdef ESP32
  #include <WiFi.h>
#else
  #include <ESP8266WiFi.h>
#endif

#define PINL 16
#define PINR 17
#define NUMLEDS 12
#define NAME "Claire's Goggles"

String addr;

bool isAwake = true;
uint8_t disconnectAnim = 4;
uint8_t anim = disconnectAnim;
uint8_t r1=0, g1=0, b1=0;
uint8_t r2=0, g2=0, b2=0;
uint32_t connColor      = 0x080808,
         disconnColor   = 0x040000,
         bdColor        = 0x0044FF,
         sdColor        = 0xFF0000;

HootBeat hb = HootBeat(NUMLEDS, PINL, PINR);

void setup() {
  pinMode(GPIO_NUM_33, INPUT_PULLUP); 
  Serial.begin(115200);
  addr = WiFi.macAddress();
  Serial.println(addr);
  BLEMidiServer.begin(NAME);
  BLEMidiServer.setOnConnectCallback([](){
    Serial.println("Connected");
    hb.setColor(connColor);
    anim = disconnectAnim;
  });
  BLEMidiServer.setOnDisconnectCallback([](){ // callback with a lambda function
    Serial.println("Disconnected");
    hb.setColor(disconnColor);
    hb.isRunning = true;
    anim = disconnectAnim;
  });
  BLEMidiServer.setNoteOnCallback(onNoteOn);
  BLEMidiServer.setNoteOffCallback(onNoteOff);
  BLEMidiServer.setControlChangeCallback(onControlChange);
  BLEMidiServer.setProgramChangeCallback(onProgramChange);
  //BLEMidiServer.enableDebugging();

  esp_sleep_enable_ext0_wakeup(GPIO_NUM_33,1);
  shouldISleepOrShouldIGo();
}

void loop() {
  if (BLEMidiServer.isConnected()) {

  }
  hb.step(anim);
  
  shouldISleepOrShouldIGo();
}

void shouldISleepOrShouldIGo() {
  isAwake = digitalRead(GPIO_NUM_33);
  if(!isAwake) {
    hb.step(0);
    hb.isRunning = false;
    Serial.println("Going to sleep now");
    esp_deep_sleep_start();
  }
}

// MIDI Callbacks:

void onNoteOn(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  hb.isRunning = true;
  if(velocity > 0) {// && hb.drums) {
    if(note == 36 && bdColor > 0) {
      hb.setColor(bdColor);
      hb.triggerFlash();  
    }
    else if(note == 38 && sdColor > 0) {
      hb.setColor(sdColor);
      hb.triggerFlash();
    } else if(note == 49) {
      hb.setColor(bdColor);
      hb.triggerFlash(24);
    }
  }
  Serial.printf("Received note on : channel %d, note %d, velocity %d (timestamp %dms)\n", channel, note, velocity, timestamp);
}

void onNoteOff(uint8_t channel, uint8_t note, uint8_t velocity, uint16_t timestamp)
{
  //Serial.printf("Received note off : channel %d, note %d, velocity %d (timestamp %dms)\n", channel, note, velocity, timestamp);
}

void onControlChange(uint8_t channel, uint8_t controller, uint8_t value, uint16_t timestamp)
{
  if(controller == 102)
    r1 = value*2;
  if(controller == 103)
    g1 = value*2;
  if(controller == 104)
    b1 = value*2;
  bdColor = hb.rgb2color(r1, g1, b1);
  hb.setColor(r1, g1, b1);
  if(controller == 105)
    r2 = value*2;
  if(controller == 106)
    g2 = value*2;
  if(controller == 107)
    b2 = value*2;
  sdColor = hb.rgb2color(r2, g2, b2);
  //Serial.printf("Received control change : channel %d, controller %d, value %d (timestamp %dms)\n", channel, controller, value, timestamp);
  if(controller == 102) {
    Serial.print("BD color: #");
    Serial.println(bdColor, HEX);
  }
  if(controller == 105) {
    Serial.print("SD color: #");
    Serial.println(sdColor, HEX);
  }
  if(controller == 111) {
    hb.isRunning = true;
    float fade = (float) value / 127;
    hb.dim(fade);
  }
}

void onProgramChange(uint8_t channel, uint8_t value, uint16_t timestamp)
{
    hb.isRunning = false;
    anim = value;
    Serial.print("Anim: ");
    Serial.println(anim);
}

void print_wakeup_reason(){
  esp_sleep_wakeup_cause_t wakeup_reason;

  wakeup_reason = esp_sleep_get_wakeup_cause();

  switch(wakeup_reason)
  {
    case ESP_SLEEP_WAKEUP_EXT0 : Serial.println("Wakeup caused by external signal using RTC_IO"); break;
    case ESP_SLEEP_WAKEUP_EXT1 : Serial.println("Wakeup caused by external signal using RTC_CNTL"); break;
    case ESP_SLEEP_WAKEUP_TIMER : Serial.println("Wakeup caused by timer"); break;
    case ESP_SLEEP_WAKEUP_TOUCHPAD : Serial.println("Wakeup caused by touchpad"); break;
    case ESP_SLEEP_WAKEUP_ULP : Serial.println("Wakeup caused by ULP program"); break;
    default : Serial.printf("Wakeup was not caused by deep sleep: %d\n",wakeup_reason); break;
  }
}

/*
 Index	Animation Name
0	All LEDs Off
1	All LEDs On
2	Pulsating
3	Pulsating + Rotating
4	Rotating (no drums)
5	Drums Only
6	Alternating Colors
7	Strobe
8	Rotating And Drums
9	Some On
10	Bounce
 */