# TechArch Academy - Embedded Systems

Target of the excercise is to set up the ESP32 DevKitC device with Mongoose OS and connect it to AWS IOT gateway. 
We will also connect a BMP180 temperature and barometric pressure sensor module.

## Pre-requisites

Install the MongooseOS [MOS tool](https://mongoose-os.com/docs/userguide/quickstart.md) and the [AWS CLI](https://aws.amazon.com/cli/).

You will also need to install the Silabs USB to UART [drivers](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers)
to be able to work with the Espressif ESP32 DevKitC board.

## Excercise 1 - Set up the device as Internet Button

The [MongooseOS](https://mongoose-os.com/) makes it really easy and fast to set the ESP32 and other supported devices up as
IoT-connected device. Mongoose supports AWS, Google and Azure IoT gateways out-of-the-box.

To set up the ESP32 with AWS IoT, follow the instructions at [https://mongoose-os.com/docs/cloud/aws.md](https://mongoose-os.com/docs/cloud/aws.md)

  * AWS CLI access keys will be provided separately
  * For **AWS Region** please use `eu-west-1` as needed
  * Create a separate project directory for the ESP32 project
  * When setting up the device, please note the **unique ID** of your ESP32 device. It will look like `esp32_1C95D0`

### Internet Button

 * Follow the steps to set up the device as internet button, controlled by the Thing Shadow
 * Create the `init.js` file as instructed. Please note that our ESP32-DevKitC board doesn't have the on-board LED. **Use Pin 14** for the LED
 * Use the AWS IoT gateway and the Thing Shadow to control the device and turn the LED on / off
 * **NOTE!** The mjs Javascript library for the MongooseOS is a very reduced subset of Javascript. Only limited subset of functions are usable, and
 for example variables can be declared only with `let`. See the MJS specification for more info.
 * Be careful to use semicolons (`;`) in your code. Even as these are not strictly required, the code seems to behave strangely if semicolons are missing
 * To test your code, just push the files to the device flash using `mos push <filename>` and reboot the device. You can use either the SW reboot command
 or hardware reset.

### Useful links

  * [MJS specification](https://github.com/cesanta/mjs)
  * [Blog post with some info on MJS](https://mongoose-os.com/blog/mjs-a-new-approach-to-embedded-scripting/)
  * [General info on ESP32](https://components101.com/microcontrollers/esp32-devkitc)


### Useful commands with the MOS tool

You can use the `mos` tool to interact with the ESP32 device. Below are some useful commands:

  * `mos help` - Help on the different mos tool commands
  * `mos ls` - List all files in the device flash memory
  * `mos put <filename>` - Transfer file to the flash memory
  * `mos get <filename>` - Read file from the device flash
  * `mos call Sys.Reboot`- Reboot the device. This is a sw reset only.
  * `mos call RPC.List` - List all available RPC commands

## Excercise 2 - Reading the temperature sensor

The ESP32 device has versatile peripheral devices (hardware / software components that can be used through the SDK). 
In this excercise we will use the I2C bus to connect to the BMP180 temperature and barometric pressure sensor.

### Tasks

  * Fiqure out how to connect the BMP180 module to the ESP32. Some tips below:
    * Check the `config0.json` file found in the device flash memory. Look for I2C configuration
    * Be extra careful when connecting supply voltage **3.3V and GND** pins. Corresponding pins in the BMP180 module are **VIN and GND**
    * Don't look at the pinout diagrams found online! The device configuration is slightly different from what is generally available.
  * Clone the git repository to a separate folder
  * Write code to read the temperature sensor data. Use the provided `bmp180.js` library to interface with the device.
  * Update the read sensor data to the AWS Thing Shadow
  * If you get stuck, look in the provided `init.js` file for examples, but do try to resolve this yourself :)

### Optional tasks

  * Publish the temperature sensor data to a MQTT topic. Create a unique topic for yourself.
  * Use the provided `api_mqtt.js` library. This is part of the mjs API.
  * More info from the links below.

### Useful links

  * [MongooseOS API reference](https://mongoose-os.com/docs/api/core/i2c.md)

## Excercise 3 - Read and publish barometric pressure sensor data

There are no helpers for this excercise. See if you can implement the algorithm to read the barometric pressure sensor on the BMP180 device.
Modify the existing `bmp180.js` file to add the necessary function to read the data. Use the BMP180 module datasheet to find more info on
the device itself, and the necessary algorithm to read the compensated sensor data. Look at the `readTemp` function for some guidance.

Once you get the pressure read correctly, publish that to the IoT topic as well.

If you still have time, you can try to implement data streams to put the IoT data in AWS DynamoDB. That already requires some Kinesis streams and Lambda
functions (for example).

### Links

  * [BMP180 Datasheet](https://cdn-shop.adafruit.com/datasheets/BST-BMP180-DS000-09.pdf)