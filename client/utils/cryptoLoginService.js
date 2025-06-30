
// var configHelper = require('./../JOS/configHelper');
var crypto = require('crypto');

var encryptionSecret = "3ncryp7i0n";
var algorithm = 'aes256';

exports.encrypt = function encrypt(data) {
    var cipher = crypto.createCipher(algorithm, encryptionSecret);
    var encrypted = cipher.update("" + data, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
};

exports.decrypt = function decrypt(data) {
    var decipher = crypto.createDecipher(algorithm, encryptionSecret);
    try {
    var decrypted = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
    }catch (ex) {
        console.log('failed');
        return;
    }
}; 