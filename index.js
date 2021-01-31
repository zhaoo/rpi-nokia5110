const rpio = require('rpio');
const font = require('./lib/font');

class RpiNokia {
  constructor(config) {
    const { PINS, ADDRESS } = config;
    const { RST, CE, DC, DIN, CLK } = PINS;
    const { COL, ROW } = ADDRESS;

    this.PINS = {
      RST: RST || 40,
      CE: CE || 24,
      DC: DC || 38,
      DIN: DIN || 19,
      CLK: CLK || 23
    }
    this.ADDRESS = {
      COL: COL || 0x80,
      ROW: ROW || 0x40
    }
    this.currentRow = 0;
    this.initLCD();
  }

  lcdWriteByte(wbyte, datCmd) {
    const wb = Buffer.from([wbyte]);
    if (datCmd == 1) {
      rpio.write(this.PINS.DC, rpio.HIGH);
    } else {
      rpio.write(this.PINS.DC, rpio.LOW);
    }
    rpio.spiWrite(wb, wb.length);
  }

  lcdClear() {
    this.lcdWriteByte(this.ADDRESS.COL, 0);
    this.lcdWriteByte(this.ADDRESS.ROW, 0);
    for (let i = 0; i < 504; i++) {
      this.lcdWriteByte(0, 1);
    }
  }

  lcdPosByte(x, y) {
    x |= this.ADDRESS.COL;
    y |= this.ADDRESS.ROW;
    this.lcdWriteByte(x, 0);
    this.lcdWriteByte(y, 0);
  }

  lcdShowChar(x, y, str = '') {
    try {
      x = x * 6;
      this.lcdPosByte(x, y);
      const fontData = font[str];
      for (let i = 0; i < 6; i++) {
        this.lcdWriteByte(fontData[i], 1);
      }
    } catch (error) {
      console.error(error);
    }
  }

  lcdShowString(x, y, str = '') {
    for (let i = 0; i < str.length; i++) {
      this.lcdShowChar(x++, y, str.charAt(i));
      if (x == 14) { x = 0; y++; }
      if (y == 6) { y = 0; }
    }
  }

  initGPIO() {
    rpio.init({ gpiomem: false });
    rpio.open(this.PINS.RST, rpio.OUTPUT);
    rpio.open(this.PINS.CE, rpio.OUTPUT);
    rpio.open(this.PINS.DC, rpio.OUTPUT);
  }

  initSPI() {
    this.initGPIO();
    rpio.spiBegin();
    rpio.spiChipSelect(0);
    // rpio.spiSetCSPolarity(0, rpio.HIGH);
    rpio.spiSetClockDivider(128);
    rpio.spiSetDataMode(0);
  }

  initLCD() {
    this.initGPIO();
    this.initSPI();
    rpio.write(this.PINS.RST, rpio.LOW);
    rpio.msleep(500);
    rpio.write(this.PINS.RST, rpio.HIGH);
    this.lcdWriteByte(0x21, 0);
    this.lcdWriteByte(0x06, 0);
    this.lcdWriteByte(0x13, 0);
    this.lcdWriteByte(0xc8, 0);
    this.lcdWriteByte(0x20, 0);
    this.lcdWriteByte(0x0c, 0);
    this.lcdClear();
  }

  // 输出
  print(string, row, col = 0) {
    if (!string) return;
    if (row) {
      this.lcdShowString(col, row, string);
    } else {
      if (this.currentRow >= 5) {
        this.lcdClear();
        this.currentRow = 0;
      }
      this.lcdShowString(col, this.currentRow, string);
      this.currentRow++;
    }
  }

  // 输出单次
  printOnce(string) {
    if (!string) return;
    this.lcdClear();
    this.lcdShowString(0, 0, string);
  }

  // 清除
  clear() {
    this.lcdClear();
  }
}

module.exports = RpiNokia