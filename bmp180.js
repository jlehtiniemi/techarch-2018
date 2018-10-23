let addr = {
  // Device address without r/w bit
  ADDR: 0x77,
  // Calibration data:
  AC1_MSB: 0xAA,
  AC2_MSB: 0xAC,
  AC3_MSB: 0xAE,
  AC4_MSB: 0xB0,
  AC5_MSB: 0xB2,
  AC6_MSB: 0xB4,
  B1_MSB: 0xB6,
  B2_MSB: 0xB8,
  MB_MSB: 0xBA,
  MC_MSB: 0xBC,
  MD_MSB: 0xBE,
};

let getSigned = function(raw) {
  let val = raw;
  let sign = raw >>> 15;
  if (sign === 1) {
    // Convert the negative two's complement. Use bit mask to take only 16 LSB 
    // since Javascript uses 64-bit signed integers for the calculation
    val = ((~val + 1) & 0xFFFF) * -1;
  }
  return val;
};

let BMP180 = {
  readCalData: function(handle) {
    return {
      AC1: getSigned(I2C.readRegW(handle, addr.ADDR, addr.AC1_MSB)),  // short
      AC2: getSigned(I2C.readRegW(handle, addr.ADDR, addr.AC2_MSB)),  // short
      AC3: getSigned(I2C.readRegW(handle, addr.ADDR, addr.AC3_MSB)),  // short
      AC4: I2C.readRegW(handle, addr.ADDR, addr.AC4_MSB),   // unsigned short
      AC5: I2C.readRegW(handle, addr.ADDR, addr.AC5_MSB),   // unsigned short
      AC6: I2C.readRegW(handle, addr.ADDR, addr.AC6_MSB),   // unsigned short
      B1: getSigned(I2C.readRegW(handle, addr.ADDR, addr.B1_MSB)),    // short
      B2: getSigned(I2C.readRegW(handle, addr.ADDR, addr.B2_MSB)),    // short
      MB: getSigned(I2C.readRegW(handle, addr.ADDR, addr.MB_MSB)),    // short
      MC: getSigned(I2C.readRegW(handle, addr.ADDR, addr.MC_MSB)),    // short
      MD: getSigned(I2C.readRegW(handle, addr.ADDR, addr.MD_MSB))     // short
    } ;
  },

  readTemp: function(handle) {
    // TODO: Can you make this function more efficient? :)
    // Read calibration data
    let ac5 = I2C.readRegW(handle, addr.ADDR, addr.AC5_MSB);
    let ac6 = I2C.readRegW(handle, addr.ADDR, addr.AC6_MSB);
    let mc = getSigned(I2C.readRegW(handle, addr.ADDR, addr.MC_MSB));
    let md = getSigned(I2C.readRegW(handle, addr.ADDR, addr.MD_MSB));
    // Measure temperature
    I2C.writeRegB(handle, addr.ADDR, 0xF4, 0x2E);
    Sys.usleep(4500); // Wait for the measurement
    let ut = I2C.readRegW(handle, addr.ADDR, 0xF6);
    // Calculate compensated temperature
    let x1 = (ut - ac6) * ac5 / (1 << 15);
    let x2 = mc * (1 << 11) / (x1 + md);
    let b5 = x1 + x2;
    let result = (b5 + 8) / (1 << 4);
    // result is given as integer with unit as 0.1 C. 
    return result / 10;
  },

  readPressure: function(handle, cal) {
    // TODO: Implemented as excercise
  }
};