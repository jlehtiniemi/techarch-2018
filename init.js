load('api_config.js');
load('api_sys.js')
load('api_gpio.js');
load('api_shadow.js');
load('api_i2c.js')
load('bmp180.js')

let led = Cfg.get('pins.led');  // Built-in LED GPIO number
let state = {on: false};        // Device state - LED on/off status
let bus = I2C.get();            // I2C Bus handle

if (!led) led = 14;  // Make sure the LED pin is defined. Pin 14 is free in default ESP32 config

// Set up Shadow handler to synchronise device state with the shadow state
Shadow.addHandler(function(event, obj) {
  if (event === 'CONNECTED') {
    // Connected to shadow - report our current state.
    Shadow.update(0, state);
  } else if (event === 'UPDATE_DELTA') {
    // Got delta. Iterate over the delta keys, handle those we know about.
    print('Got delta:', JSON.stringify(obj));
    for (let key in obj) {
      if (key === 'on') {
        print('Key ON found...');
        print('LED Pin: ', led);
        // Shadow wants us to change local state - do it.
        state.on = obj.on;
        GPIO.set_mode(led, GPIO.MODE_OUTPUT);
        GPIO.write(led, state.on ? 1 : 0);
        print('LED on ->', state.on);
        // Using the led state as trigger to read temp sensor
        print('Read I2C');
        let calData = BMP180.readCalData(bus);
        print(JSON.stringify(calData));
        print('Reading temperature:');
        let temp = BMP180.readTemp(bus);
        print('Temperature:', temp);
        // Push data to IOT topic
        // TODO: Excercise
      }
    }
    // Once we've done synchronising with the shadow, report our state.
    Shadow.update(0, state);
  }
});