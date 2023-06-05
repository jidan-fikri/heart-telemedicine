#include <ArduinoBLE.h>
BLEService HaTeService("19B10000-E8F2-537E-4F6C-D104768A1214");
BLEIntCharacteristic ecgCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify);
BLEIntCharacteristic oxyCharacteristic("19B10002-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify);
#include <Wire.h>
#include "MAX30105.h"

MAX30105 particleSensor;
#define ARRAY_SIZE 60
const int numSamples = 10;
int32_t redBaseline = 0;
int32_t irBaseline = 0;

#define debug Serial
const int ledPin = 2;

void setup() {
	Serial.begin(115200);
  Serial1.begin(115200);

  digitalWrite(ledPin, HIGH);

  if (!BLE.begin()) {
    Serial.println("Gagal memulai BLE!");
    while (1);
  }
  if (particleSensor.begin() == false)
  {
    debug.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }
  particleSensor.setup();
	BLE.setLocalName("HaTe");
	BLE.setDeviceName("HaTe");
	BLE.setAdvertisedService(HaTeService);
	HaTeService.addCharacteristic(ecgCharacteristic);
  HaTeService.addCharacteristic(oxyCharacteristic);
  // ecgCharacteristic.writeValue(0);
  // ecgCharacteristic.writeValue(1);
  BLE.addService(HaTeService);
  BLE.advertise();
  
  Serial.println("Bluetooth device active, waiting for connections...");
  for (int i = 0; i < numSamples; i++) {
   
    redBaseline += particleSensor.getRed();
    irBaseline += particleSensor.getIR();
    
  }
  redBaseline /= numSamples;
  irBaseline /= numSamples;
}

void loop() {

  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

  while (central.connected()) {
    digitalWrite(ledPin, LOW);

    while(Serial1.available() > 0) {

      char value = Serial1.read();
      int data = int(value) / 1;
      Serial.println(data);

      ecgCharacteristic.writeValue(data);

    }

    int32_t red = particleSensor.getRed();
    int32_t ir = particleSensor.getIR();
    int32_t redDC = red - redBaseline;
    int32_t irDC = ir - irBaseline;
    float ratio = ((float)red / float (redDC)) / ((float) ir / float (irDC));
    float spo2 = (110-(25 * ratio));
    int SPO2 = spo2;
    if (SPO2 > 100 || SPO2 < 0 || ir < 10000) {
      Serial.print("\tSpO2: ");
      Serial.print("0");
      Serial.println(" %");
      int null = 0;
      oxyCharacteristic.writeValue(null);
    }
    else { 
      Serial.print("\tSpO2: ");
      Serial.print(SPO2);
      Serial.println(" %");
      oxyCharacteristic.writeValue(SPO2);
    }
    
  }
  // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
} 
}