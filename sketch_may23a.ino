#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define TRIGGER_PIN_1 D6
#define ECHO_PIN_1 D7
#define TRIGGER_PIN_2 D4
#define ECHO_PIN_2 D3
#define BUZZER_PIN D2
#define BLUE_PIN D1
#define RED_PIN D8

const char* ssid = "Ambot";
const char* password = "neil5412";
const char* serverUrl = "http://192.168.69.117:3000/api/distances";

WiFiClient wifiClient;

void setup() {
  pinMode(TRIGGER_PIN_1, OUTPUT);
  pinMode(ECHO_PIN_1, INPUT);
  pinMode(TRIGGER_PIN_2, OUTPUT);
  pinMode(ECHO_PIN_2, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  pinMode(RED_PIN, OUTPUT);
  Serial.begin(9600);
  delay(50);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

long readDistance(int triggerPin, int echoPin) {
  long total = 0;
  const int numReadings = 5;

  for (int i = 0; i < numReadings; i++) {
    digitalWrite(triggerPin, LOW);
    delayMicroseconds(2);
    digitalWrite(triggerPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(triggerPin, LOW);

    long duration = pulseIn(echoPin, HIGH);
    long distance = duration * 0.034 / 2;
    total += distance;
    delay(10);  // small delay between readings
  }
  
  return total / numReadings;
}

void loop() {
  unsigned int distance1 = readDistance(TRIGGER_PIN_1, ECHO_PIN_1);
  unsigned int distance2 = readDistance(TRIGGER_PIN_2, ECHO_PIN_2);

  bool shouldBeep = (distance1 <= 100 || distance2 <= 100);

  if (shouldBeep) {
    int buzzerDelay1 = map(distance1, 50, 60, 80, 100); // Map distance to delay (1-20 cm maps to 50-100 ms)
    int buzzerDelay2 = map(distance2, 50, 60, 80, 100);

    // Produce an alternating sound on the buzzer
    for (int i = 0; i < 2; i++) {
      digitalWrite(BUZZER_PIN, HIGH); // Turn on the buzzer
      delay(buzzerDelay1 / 2); // Wait for half the buzzer delay
      digitalWrite(BUZZER_PIN, LOW); // Turn off the buzzer
      delay(buzzerDelay1 / 2); // Wait for half the buzzer delay
    }

    for (int i = 0; i < 2; i++) {
      digitalWrite(BUZZER_PIN, HIGH); // Turn on the buzzer
      delay(buzzerDelay2 / 2); // Wait for half the buzzer delay
      digitalWrite(BUZZER_PIN, LOW); // Turn off the buzzer
      delay(buzzerDelay2 / 2); // Wait for half the buzzer delay
    }

    digitalWrite(RED_PIN, HIGH);
    digitalWrite(BLUE_PIN, LOW);

    Serial.print("Distance Front: ");
    Serial.print(distance1);
    Serial.println(" cm");
    
    Serial.print("Distance Back: ");
    Serial.print(distance2);
    Serial.println(" cm");

    // Send distance data to server only when buzzer beeps
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(wifiClient, serverUrl);
      http.addHeader("Content-Type", "application/json");

      String jsonPayload = "{\"distance1\":" + String(distance1) + ",\"distance2\":" + String(distance2) + "}";
      int httpResponseCode = http.POST(jsonPayload);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
      } else {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    }
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(RED_PIN, LOW);
    digitalWrite(BLUE_PIN, HIGH);
  }

  delay(5); // Adjust the delay as needed
}
