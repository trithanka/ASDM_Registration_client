const crypto = require('crypto');

const encryptionSecret = "3ncryp7i0n";
const algorithm = 'aes256';

exports.encrypt = function encrypt(data) {
    const cipher = crypto.createCipher(algorithm, encryptionSecret);
    const encrypted = cipher.update("" + data, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}; 