var serialPort = require("serialport");
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
        baudrate: 115200,
        bufferSize: 1
    });
}

ESPROM.prototype.read = function () {
    //var b = '';
    //var that = this;
    //var length = 1;
    //
    ////while(b.length < length) {
    //that._port.on('open', function () {
    //    console.log('Node.js: Open Port');
    //});
    //that._port.on('data', function (data) {
    //    console.log(data[0]);
    //});
    //return b;
};

ESPROM.prototype.write = function () {

}
//
//fs.readFile('test/nodemcu.bin', 'utf8', function (err, data) {
//    if (err) {
//        return console.log(err);
//    }
//    var esprom = new ESPROM();
//    esprom.read();
//    console.log(data);
//});


ESPROM.prototype.read_reg = function () {

};


ESPROM.prototype.write_reg = function () {

};
ESPROM.prototype.checksum = function () {

};
ESPROM.prototype.connect = function () {

};
ESPROM.prototype.command = function () {

};
ESPROM.prototype.sync = function () {

};
ESPROM.prototype.flash_begin = function () {

};

ESPROM.prototype.flash_finish = function () {

};

ESPROM.prototype.flash_block = function () {

};

ESPROM.prototype.run = function () {

};
