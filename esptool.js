var SerialPort = require("serialport").SerialPort;
var fs = require('fs');

function ESPROM() {
    this.ESP_FLASH_BEGIN = 0x02;
    this.ESP_FLASH_DATA = 0x03;
    this.ESP_FLASH_END = 0x04;
    this.ESP_MEM_BEGIN = 0x05;
    this.ESP_MEM_END = 0x06;
    this.ESP_MEM_DATA = 0x07;
    this.ESP_SYNC = 0x08;
    this.ESP_WRITE_REG = 0x09;
    this.ESP_READ_REG = 0x0a;
    this._port = new SerialPort("/dev/tty.SLAB_USBtoUART", {
        baudrate: 115200
    });
};

ESPROM.prototype.read = function () {
    var b = '';
    var that = this;
    var length = 1;

    while(b.length < length) {
        //var c = that._port.read();
    }
    return b;
};


fs.readFile('test/nodemcu.bin', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
});
