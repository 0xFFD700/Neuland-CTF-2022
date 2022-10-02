// Pins
const int ledPin = D4;

// long 2000
// short 1000
//s ...
//a .-
//m --
 
void setup()
{
  pinMode(ledPin, OUTPUT);
}
 
void loop()
{
  //s
  digitalWrite(ledPin,HIGH);
  delay(200);
 
  digitalWrite(ledPin,LOW);
  delay(500);

  digitalWrite(ledPin,HIGH);
  delay(200);
 
  digitalWrite(ledPin,LOW);
  delay(500);

  digitalWrite(ledPin,HIGH);
  delay(200);
 
  digitalWrite(ledPin,LOW);
  delay(5000);

  //a
  digitalWrite(ledPin,HIGH);
  delay(200);
 
  digitalWrite(ledPin,LOW);
  delay(500);

  digitalWrite(ledPin,HIGH);
  delay(2000);
 
  digitalWrite(ledPin,LOW);
  delay(5000);

  //m
  digitalWrite(ledPin,HIGH);
  delay(2000);
 
  digitalWrite(ledPin,LOW);
  delay(500);

  digitalWrite(ledPin,HIGH);
  delay(2000);
 
  digitalWrite(ledPin,LOW);
  delay(10000);
  
}
