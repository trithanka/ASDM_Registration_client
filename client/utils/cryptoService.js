const NodeRSA = require('node-rsa');
const CryptoJS = require('crypto-js');

/********************************************************************************/
const PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\n' +
    'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA1qdhGUVWXTiF+UbEX/mq\n' +
    'zH1n34LuhJhZmdIJpSLIN5y8WgXwPXL6URnvNwqTIlKDACtGalD00HNDjCCcsJ7x\n' +
    'mpX9Uyv4QvCbKwT0sQyettQSSZoNsJArpgGznrV3cYRQ5lW4/39oFLJK/onuntXj\n' +
    'ZPcSuk+unWX4BiQgmTh6UA1Ov181AkDlizHWndJFZD5oG72qEByiIcZNabbcMIlR\n' +
    'eg7vgAHmwOrtqTefvIwzRO/nJjZyKheKXDo6nFbt5TFnQ9lpHoUBTtESDu1AhpSA\n' +
    'vY6dBSQMPWr6pfrwMgnube9nfnBtqyWrlqCLVe3EBwlWK/Tv5PLhAlFdpuOAakmz\n' +
    'mmfR1qCxm0c7Fj9SEyupLwe7I7V3TP0tp0B5EWrWaUBd+8qPyaTQ05OjVRjW/2cd\n' +
    '+Ai5xYKj5WhGbFdX/si7jSVLn0Nv4Gyf7P5/NMZchUC8bkU3O6kRyYXjHBGHBPsa\n' +
    'UwpMJyl5D5mOkajuXHU9VmSIqu89mNizxaEsIqdAZ2mFbDSong0nbGurqSqBKy6V\n' +
    'CPK7WinsGZkKjkQZMXdEMAG3Ey5QIGrlES67sZ+rPqWmLVZ01tSddFXl8EP5hTNZ\n' +
    'LTeJXeRQGHZqNULsC9Alc2dPgcMBAFZ66zB7yR4S18rABkdpeBLwEdrbNBhHERl3\n' +
    'fbLgdyyIAHo9qBk/wuulk30CAwEAAQ==\n' +
    '-----END PUBLIC KEY-----';
/********************************************************************************/
const PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\n' +
    '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\n' +
    '-----END RSA PRIVATE KEY-----';
/*********************************************************************************/
exports.cryptoService = async (ciphertext) => {
    try {
        const NEW_PRIVATE_KEY = new NodeRSA(PRIVATE_KEY);
        await NEW_PRIVATE_KEY.setOptions({ encryptionScheme: 'pkcs1' });
        const DECRYPTED_KEY = await NEW_PRIVATE_KEY.decrypt(ciphertext.secret, 'utf8');
        var bytes = await CryptoJS.AES.decrypt(ciphertext.data, DECRYPTED_KEY);
        var plainText = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return plainText;
    } catch (e) {
        console.error("error in : " + e.stack);
    }
};
/*********************************************************************************/