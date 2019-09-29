'use strict'

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const Encryption = {
    async encryptionTechniques(){
        console.log(crypto.getCiphers())
        console.log(crypto.getHashes())
    },

    async encrypt(plainText){
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(plainText);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    },

    async decrypt(cipherText){
        let iv = Buffer.from(cipherText.iv, 'hex');
        let encryptedText = Buffer.from(cipherText.encryptedData, 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}

module.exports = Encryption