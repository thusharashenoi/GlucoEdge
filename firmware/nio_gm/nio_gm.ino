/*
 * GlucoEdge NIO-GM — dual optical front-end firmware
 *
 * Secondary PPG:  MAX30102 (660 nm / 880 nm) on I2C
 * Primary NIR:    Dual NIR LEDs (MOSFET pulsed) + InGaAs PD via ADS1115
 * Thermal:         DS18B20 on 1-Wire
 *
 * Pin map (ESP32-S3, matches GlucoEdge POC):
 *   GPIO 8  — I2C SDA  (MAX30102, ADS1115, OLED)
 *   GPIO 9  — I2C SCL
 *   GPIO 4  — 1-Wire   (DS18B20, 4.7 kΩ pull-up to 3.3 V)
 *   GPIO 5  — NIR LED 1 MOSFET gate (220 Ω series)
 *   GPIO 6  — NIR LED 2 MOSFET gate (220 Ω series)
 *
 * Serial CSV @ 115200:
 *   millis,max_red,max_ir,nir1,nir2,skin_temp_c
 */

#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include <Adafruit_MAX30105.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ── Pin definitions ──────────────────────────────────────────────────────────
static const int PIN_I2C_SDA = 8;
static const int PIN_I2C_SCL = 9;
static const int PIN_ONE_WIRE = 4;
static const int PIN_NIR_LED1 = 5;
static const int PIN_NIR_LED2 = 6;

// ── Timing ───────────────────────────────────────────────────────────────────
static const uint32_t LED_SETTLE_US = 500;   // photodiode settle after LED on
static const uint32_t SAMPLE_PERIOD_MS = 10;   // ~100 Hz aggregate loop
static const uint32_t TEMP_READ_INTERVAL_MS = 1000;

// ── ADS1115 ──────────────────────────────────────────────────────────────────
// AIN0 = TIA output. ±4.096 V gain → 0.125 mV/LSB
static const uint8_t ADS_CHANNEL = 0;
static const adsGain_t ADS_GAIN = GAIN_ONE;

// ── Hardware objects ─────────────────────────────────────────────────────────
Adafruit_ADS1X15 ads;
Adafruit_MAX30105 max30102;
OneWire oneWire(PIN_ONE_WIRE);
DallasTemperature ds18b20(&oneWire);

// ── State ────────────────────────────────────────────────────────────────────
float skinTempC = NAN;
uint32_t lastTempReadMs = 0;
bool contactPresent = false;

// ── Helpers ──────────────────────────────────────────────────────────────────
static inline void nirLed1(bool on) { digitalWrite(PIN_NIR_LED1, on ? HIGH : LOW); }
static inline void nirLed2(bool on) { digitalWrite(PIN_NIR_LED2, on ? HIGH : LOW); }
static inline void allNirOff() {
  nirLed1(false);
  nirLed2(false);
}

int16_t readAdsRaw() {
  return ads.readADC_SingleEnded(ADS_CHANNEL);
}

// Convert ADS1115 raw counts to millivolts at the selected gain.
float adsRawToMillivolts(int16_t raw) {
  return raw * ads.computeVolts(1) * 1000.0f;
}

// Pulse one NIR LED, sample ADS1115, subtract dark baseline.
int16_t pulseAndSample(int ledPin, int16_t darkBaseline) {
  digitalWrite(ledPin, HIGH);
  delayMicroseconds(LED_SETTLE_US);
  int16_t raw = readAdsRaw();
  digitalWrite(ledPin, LOW);
  return raw - darkBaseline;
}

bool initMax30102() {
  if (!max30102.begin(Wire, I2C_SPEED_FAST)) {
    return false;
  }
  // Moderate LED drive — tune for your finger fixture
  max30102.setup(0x1F, 4, 2, 100, 411, 4096);
  max30102.setPulseAmplitudeRed(0x24);
  max30102.setPulseAmplitudeIR(0x24);
  max30102.setMultiLEDEnable(MAX30102_MODE_REDIRONLY);
  return true;
}

void readMax30102(uint32_t &red, uint32_t &ir) {
  red = max30102.getRed();
  ir = max30102.getIR();
  // Drain FIFO so samples stay fresh
  while (max30102.available()) {
    red = max30102.getRed();
    ir = max30102.getIR();
    max30102.nextSample();
  }
  contactPresent = ir > 50000; // tune threshold for your optics
}

void readTemperatureIfDue() {
  uint32_t now = millis();
  if (now - lastTempReadMs < TEMP_READ_INTERVAL_MS) {
    return;
  }
  lastTempReadMs = now;
  ds18b20.requestTemperatures();
  float t = ds18b20.getTempCByIndex(0);
  if (t != DEVICE_DISCONNECTED_C) {
    skinTempC = t;
  }
}

void printCsvRow(uint32_t tMs, uint32_t red, uint32_t ir,
                 int16_t nir1, int16_t nir2) {
  Serial.print(tMs);
  Serial.print(',');
  Serial.print(red);
  Serial.print(',');
  Serial.print(ir);
  Serial.print(',');
  Serial.print(nir1);
  Serial.print(',');
  Serial.print(nir2);
  Serial.print(',');
  if (isnan(skinTempC)) {
    Serial.println("nan");
  } else {
    Serial.println(skinTempC, 2);
  }
}

// ── Setup ────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(PIN_NIR_LED1, OUTPUT);
  pinMode(PIN_NIR_LED2, OUTPUT);
  allNirOff();

  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
  Wire.setClock(400000);

  if (!ads.begin(0x48, &Wire)) {
    Serial.println("# ERROR: ADS1115 not found at 0x48");
  } else {
    ads.setGain(ADS_GAIN);
    ads.setDataRate(RATE_ADS1115_860SPS);
  }

  if (!initMax30102()) {
    Serial.println("# ERROR: MAX30102 init failed");
  }

  ds18b20.begin();
  ds18b20.setWaitForConversion(false);

  Serial.println("# GlucoEdge NIO-GM ready");
  Serial.println("# CSV: millis,max_red,max_ir,nir1_raw,nir2_raw,skin_temp_c");
}

// ── Main sampling loop ───────────────────────────────────────────────────────
void loop() {
  uint32_t loopStart = millis();

  // 1. Dark baseline (both NIR LEDs off, ambient only)
  allNirOff();
  delayMicroseconds(LED_SETTLE_US);
  int16_t dark = readAdsRaw();

  // 2. Pulse NIR λ1 and λ2 sequentially
  int16_t nir1 = pulseAndSample(PIN_NIR_LED1, dark);
  delayMicroseconds(50); // brief off-time between channels
  int16_t nir2 = pulseAndSample(PIN_NIR_LED2, dark);

  // 3. MAX30102 PPG
  uint32_t red = 0, ir = 0;
  readMax30102(red, ir);

  // 4. DS18B20 (rate-limited)
  readTemperatureIfDue();

  // 5. Stream CSV (skip if no finger contact — optional gate)
  if (contactPresent) {
    printCsvRow(loopStart, red, ir, nir1, nir2);
  }

  // Maintain ~100 Hz
  uint32_t elapsed = millis() - loopStart;
  if (elapsed < SAMPLE_PERIOD_MS) {
    delay(SAMPLE_PERIOD_MS - elapsed);
  }
}
