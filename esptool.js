var serialPort = require("serialport");
var SerialPort = require("serialport").SerialPort;
var Packer = require('pypacker');
var os = require('os');

function ESPROM() {
    //These are the currently known commands supported by the ROM
    this.ESP_FLASH_BEGIN = 0x02;
    this.ESP_FLASH_DATA = 0x03;
    this.ESP_FLASH_END = 0x04;
    this.ESP_MEM_BEGIN = 0x05;
    this.ESP_MEM_END = 0x06;
    this.ESP_MEM_DATA = 0x07;
    this.ESP_SYNC = 0x08;
    this.ESP_WRITE_REG = 0x09;
    this.ESP_READ_REG = 0x0a;

    //Maximum block sized for RAM and Flash writes, respectively.
    this.ESP_RAM_BLOCK = 0x1800;
    this.ESP_FLASH_BLOCK = 0x400;

    //Default baudrate. The ROM auto-bauds, so we can use more or less whatever we want.
    this.ESP_ROM_BAUD = 115200;

    //First byte of the application image
    this.ESP_IMAGE_MAGIC = 0xe9;

    //Initial state for the checksum routine
    this.ESP_CHECKSUM_MAGIC = 0xef;

    //OTP ROM addresses
    this.ESP_OTP_MAC0 = 0x3ff00050;
    this.ESP_OTP_MAC1 = 0x3ff00054;

    var portNum = "/dev/tty.SLAB_USBtoUART";
    if ("win32" == os.platform() || "win64" == os.platform()) {
        portNum = "com2";
    }
    console.log("opening " + portNum);
    this.port = new SerialPort(portNum, {
        parser: serialPort.parsers.byteLength(1)
    }, true);
}

ESPROM.prototype.read = function () {

};

ESPROM.prototype.write = function (packet) {
    var buffer = '\xc0', b;
    for (b in packet) {
        if (b === '\xc0') {
            buffer += '\xdb\xdc';
        } else if (b === '\xdb') {
            buffer += '\xdb\xdb';
        } else {
            buffer += b;
        }
    }
    buffer += '\xc0';
    var that = this;
    this.port.on('open', function (error) {
        console.log("write buffer:", buffer);
        that.port.write(buffer, function (err) {
            if (err) {
                console.log(err);
            }
            //process.exit(-1);
        });
    })
};

ESPROM.prototype.read_reg = function () {

};


ESPROM.prototype.write_reg = function () {

};
ESPROM.prototype.checksum = function () {

};
ESPROM.prototype.connect = function () {
    var i;
    var port = this.port, that = this;

    function done() {
        port.on("open", function () {
            port.on('data', function (result) {
                console.log(result.toString());
            });
        });
        for (i = 0; i < 4; i++) {
            try {
                port.flush(function (err) {
                    if (err !== undefined) {
                        console.log(err);
                    }
                })
            } catch (e) {
                throw new Error('Failed to connect');
            }
        }
        that.sync();
        //process.exit(-1);
    }

    function setDTRFalse() {
        port.set({dtr: false}, function () {
            setTimeout(done, 100);
        });
    }

    function clear() {
        console.log('clear');
        port.set({rts: false}, function (err, something) {
            setTimeout(setDTRFalse, 100);
        });
    }

    port.set({rts: true, dtr: true}, function (err, something) {
        setTimeout(clear, 100);
    });
};

ESPROM.prototype.command = function (op, data) {
    console.log("command");
    var self = this;

    console.log(op);
    if(op !== undefined) {
        self.port.open(function () {
            self.port.write('\x00\n\x00\x00\x00\x00\x00\x000x3ff00050', function (err, results) {
                console.log("results " + results);
                self.port.close();
            });
        });
    }

    self.port.open(function () {
        self.port.on("data", function (data) {
            process.stdout.write(data.toString());
            if(data !== '\xc0'){
                throw new Error('Invalid head of packet');
            }
            self.port.close();
        });
    });
    return [];
};

ESPROM.prototype.sync = function () {
    var U32 = '\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55\x55';
    var that = this, i;
    that.command(that.ESP_SYNC, '\x07\x07\x12\x20' + U32);
    for (i = 0; i < 7; i++) {
        that.command()
    }
};
ESPROM.prototype.flash_begin = function () {

};

ESPROM.prototype.flash_finish = function () {

};

ESPROM.prototype.flash_block = function () {

};

ESPROM.prototype.read_reg = function (addr) {
    var message = new Packer('<I').pack(addr);
    var res = this.command(this.ESP_READ_REG, message);
    if (res[1] !== "\0\0") {
        console.log('Failed to read target memory')
    }
    return res[0]
};

ESPROM.prototype.write_reg = function (addr, value, mask) {
    var delay_us = 0;
    var packet = new Packer('<IIII').pack(addr, value, mask, delay_us);
    if (this.command(this.ESP_WRITE_REG, packet)[1] !== "\0\0") {
        console.log('Failed to write target memory');
    }
};

ESPROM.prototype.read_mac = function () {

};

ESPROM.prototype.run = function () {

};

var esprom = new ESPROM();
esprom.connect();
esprom.command(esprom.ESP_OTP_MAC0);
