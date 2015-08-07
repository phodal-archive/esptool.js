var serialPort = require("serialport");
var SerialPort = require("serialport").SerialPort;
var fs = require('fs');
var Packer = require('pypacker');

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
    //
    this._port = new SerialPort("/dev/tty.SLAB_USBtoUART", {
        baudrate: 9200,
        bufferSize: 1,
        databits: 8,
        parser: serialPort.parsers.byteLength(1)
    });
}

ESPROM.prototype.read = function () {
    //var b = '';
    //var self = this;
    //var length = 1;
    //
    ////while(b.length < length) {
    //self._port.on('open', function () {
    //    console.log('Node.js: Open Port');
    //});
    //self._port.on('data', function (data) {
    //    console.log(data[0]);
    //});
    //return b;
};

// Write bytes to the serial port while performing SLIP escaping
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
    this._port.on('open', function (error) {
        console.log("write buffer:", buffer);
        that._port.write(buffer, function (err) {
            if (err) {
                console.log(err);
            }
            process.exit(-1);
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
    var port = this._port, that = this;

    function done() {
        console.log('done');
        for (i = 0; i < 10; i++) {
            try {
                port.flush(function (err) {
                    if (err !== undefined) {
                        console.log(err);
                    }
                })
            } catch (e) {
                console.log('Failed to connect');
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
ESPROM.prototype.command = function () {
    //if self._port.read(1) != '\xc0':
    //raise Exception('Invalid head of packet')
    //hdr = self.read(8)
    //(resp, op_ret, len_ret, val) = struct.unpack('<BBHI', hdr)
    //if resp != 0x01 or (op and op_ret != op):
    //raise Exception('Invalid response')
    //
    //    # The variable-length body
    //body = self.read(len_ret)
    //
    //    # Terminating byte
    //if self._port.read(1) != chr(0xc0):
    //raise Exception('Invalid end of packet')
    //
    //return val, body
    console.log("command");
    var port = new SerialPort("/dev/tty.SLAB_USBtoUART", {}, true);

    setTimeout(null, 100);
    port.on("open", function () {
        port.write("\r");
        port.on('data', function(data) {
            console.log(data.toString());
        });

        port.write("print '19'");
        port.on('data', function(data) {
            console.log(data.toString());
        });
    });

    return [];
};

ESPROM.prototype.sync = function () {
    var that = this, i;
    that.command(that.ESP_SYNC, '\x07\x07\x12\x20' + 32 * '\x55');
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
    console.log(message.toString());
    var res = this.command(this.ESP_READ_REG, message);
    if(res[1] !== "\0\0") {
        console.log('Failed to read target memory')
    }
    return res[0]
};

ESPROM.prototype.read_mac = function () {

};

ESPROM.prototype.run = function () {

};

fs.readFile('test/nodemcu_float_0.9.6-dev_20150704.bin', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var esprom = new ESPROM();
    esprom.read_reg(esprom.ESP_OTP_MAC0);
});
