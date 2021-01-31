# Rpi Nokia 5110

Nokia 5110 Library for Raspberry PI

### Install

```bash
$ git clone https://github.com/zhaoo/rpi-nokia5110.git
$ cd rpi-nokia5110
$ npm i
```

### Use

```javascript
const Nokia = require('./index');
const nokia = new Nokia();

nokia.clear();
nokia.print('Hello, World!', 0);
nokia.print('Raspberry', 1, 2);
nokia.print('Nokia 5110', 2, 2);
setTimeout(nokia.printOnce('I am zhaoo'), 3000);
```

### Config

```javascript
const config = {  // default config
  PINS: { RST: 40, CE: 24, DC: 38, DIN: 19, CLK: 23 },
  ADDRESS: { COL: 0x80, ROW: 0x40 }
}
const nokia = new Nokia();
```
