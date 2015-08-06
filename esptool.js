var serialPort = require("serialport");
var SerialPort = require("serialport").SerialPort;
var fs = require('fs');

function ESPROM() {
    //These are the currently known commands supported by the ROM
    this.ESP_FLASH_BEGIN = 0x02;
    this.ESP_FLASH_DATA  = 0x03;
    this.ESP_FLASH_END   = 0x04;
    this.ESP_MEM_BEGIN   = 0x05;
    this.ESP_MEM_END     = 0x06;
    this.ESP_MEM_DATA    = 0x07;
    this.ESP_SYNC        = 0x08;
    this.ESP_WRITE_REG   = 0x09;
    this.ESP_READ_REG    = 0x0a;

    //Maximum block sized for RAM and Flash writes, respectively.
        this.ESP_RAM_BLOCK   = 0x1800;
    this.ESP_FLASH_BLOCK = 0x100;

    //Default baudrate. The ROM auto-bauds, so we can use more or less whatever we want.
        this.ESP_ROM_BAUD    = 115200;

    //First byte of the application image
    this.ESP_IMAGE_MAGIC = 0xe9;

    //Initial state for the checksum routine
    this.ESP_CHECKSUM_MAGIC = 0xef;

    //OTP ROM addresses
    this.ESP_OTP_MAC0    = 0x3ff00050;
    this.ESP_OTP_MAC1    = 0x3ff00054;
    //
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

ESPROM.prototype.read_reg = function () {

};


ESPROM.prototype.write_reg = function () {

};
ESPROM.prototype.checksum = function () {

};
ESPROM.prototype.connect = function () {
    var that = this;
    var i;
    var port = this._port;

    function done(){
        console.log('done');
        for(i=0; i<10; i++){
            try {

            } catch (e) {
                console.log('Failed to connect');
            }
        }
    }

    function setDTRFalse() {
        port.set({dtr: false}, function () {
            setTimeout(done, 100);
        });
    }

    function clear() {
        console.log('clear');
        port.set({rts:false}, function(err, something) {
            setTimeout(setDTRFalse, 100);
        });
    }

    port.set({rts:true, dtr:true}, function(err, something) {
        console.log('asserted');
        setTimeout(clear, 100);
    });
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

fs.readFile('test/nodemcu.bin', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var esprom = new ESPROM();
    esprom.connect();
    console.log(data);
});
