const crypto = require('crypto');
const fs = require('fs');

const hashAlgos = [
    "DES",
    "AES",
    "Blowfish"
];

function encryptWithDES(fileContent, secretKey) {
    try {
        // const keyBuffer = Buffer.from(secretKey, 'utf8');
        // console.log('keyBuffer: ', keyBuffer);
        // if (keyBuffer.length !== 8) {
        //     throw new Error("Invalid key length for DES encryption.");
        // }
        // const cipher = crypto.createCipheriv('des-ecb', keyBuffer, null);

        const cipher = crypto.createCipheriv('des-ecb', secretKey, null);
        let encrypted = cipher.update(fileContent, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error("Encryption failed:", error.message);
        return null; 
    }
}

const hashAndSave = ({ file, algo, secretKey }) => {
    if(!hashAlgos.includes(algo)) return;

    if(algo === "DES") {
        let encrypted = encryptWithDES(file, secretKey);
        console.log('encrypted: ', encrypted);
    }
};

module.exports = { hashAndSave };
