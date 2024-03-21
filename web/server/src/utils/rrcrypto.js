const crypto = require("crypto-js");
const process = require("node:process");

exports.encrypt = (data) => {
    const encrypted = crypto.AES.encrypt(data, process.env.SECRET);
    return encrypted.toString();
}

exports.decrypt = (encryptedData, secret) => {
    const decrypted = crypto.AES.decrypt(encryptedData, secret);
    return decrypted.toString(crypto.enc.Utf8);
}

exports.decryptHost = (encryptedData) => {
    return this.decrypt(encryptedData, process.env.SECRET);
}