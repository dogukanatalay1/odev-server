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

function encryptWithAES(filePath, secretKey) {
    try {
        const fileContent = fs.readFileSync(filePath);

        // Convert the hexadecimal string key to a Buffer
        const keyBuffer = Buffer.from(secretKey, 'hex');
        if (keyBuffer.length !== 32) {
            throw new Error("Invalid key length for AES encryption. Key must be 32 bytes long.");
        }

        const cipher = crypto.createCipheriv('aes-256-ecb', keyBuffer, null);
        let encrypted = cipher.update(fileContent);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted;
    } catch (error) {
        console.error("Encryption failed:", error.message);
        return null; 
    }
}

function decryptWithAES(encryptedFilePath, secretKeyHex) {
    try {
        const encryptedContent = fs.readFileSync(encryptedFilePath);

        const keyBuffer = Buffer.from(secretKeyHex, 'hex');
        if (keyBuffer.length !== 32) {
            throw new Error("Invalid key length for AES decryption. Key must be 32 bytes long.");
        }

        const decipher = crypto.createDecipheriv('aes-256-ecb', keyBuffer, null);
        let decrypted = decipher.update(encryptedContent);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error.message);
        return null; 
    }
}


const hashAndSave = ({ filePath, algo, secretKey }) => {
    if(!hashAlgos.includes(algo)) return;

    if(algo === "DES") {
        let encrypted = encryptWithDES(file, secretKey);
        console.log('encrypted: ', encrypted);
    }

    if(algo === "AES") {
        let encrypted = encryptWithAES(filePath, secretKey);
        console.log('encrypted: ', encrypted);
    }
};

module.exports = { hashAndSave, decryptWithAES };
