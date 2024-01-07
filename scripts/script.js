const crypto = require('crypto');
const fs = require('fs');

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
};

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
};

function encryptWithBlowfish(filePath, secretKey) {
    try {
        const fileContent = fs.readFileSync(filePath);

        const keyBuffer = Buffer.from(secretKey, 'hex');
        if (keyBuffer.length < 4 || keyBuffer.length > 56) {
            throw new Error("Invalid key length for Blowfish encryption. Key must be between 4 and 56 bytes long.");
        }

        const cipher = crypto.createCipheriv('bf-ecb', keyBuffer, null); // Using ECB mode for Blowfish
        let encrypted = cipher.update(fileContent);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted;
    } catch (error) {
        console.error("Encryption failed:", error.message);
        return null;
    }
};

// decrypts
function decryptWithAES(encryptedFilePath, secretKeyHex) {
    try {
        const encryptedContent = fs.readFileSync(encryptedFilePath);

        console.log('file', encryptedContent);

        const keyBuffer = Buffer.from(secretKeyHex, 'hex');
        if (keyBuffer.length !== 32) {
            throw new Error("Invalid key length for AES decryption. Key must be 32 bytes long.");
        }

        const decipher = crypto.createDecipheriv('aes-256-ecb', keyBuffer, null);
        let decrypted = decipher.update(encryptedContent);

        console.log('decrypted: ', decrypted);
        // decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error.message);
        return null; 
    }
};

const hashAlgos = {
    "DES": encryptWithDES,
    "AES": encryptWithAES,
    "Blowfish": encryptWithBlowfish
};

const hashAndSave = ({ filePath, algo, secretKey }) => {
    let algos = Object.keys(hashAlgos);
    if(!algos.includes(algo)) return null;

    let encrypted = hashAlgos[algo](filePath, secretKey);

    return encrypted;
};

module.exports = { hashAndSave, decryptWithAES };
