const Nokia = require('./index');

const config = {
  PINS: { RST: 40, CE: 24, DC: 38, DIN: 19, CLK: 23 },
  ADDRESS: { COL: 0x80, ROW: 0x40 }
}

const nokia = new Nokia(config);
nokia.clear();
nokia.print('Hello, World!', 0);
nokia.print('Raspberry', 1, 2);
nokia.print('Nokia 5110', 2, 2);
setTimeout(nokia.printOnce('I am zhaoo'), 3000);