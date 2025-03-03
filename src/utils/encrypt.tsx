import CryptoJS from 'crypto-js';

/**
 * Decrypts a base64 encoded string encrypted with the PHP function encryptText.
 *
 * @param {string} encryptedBase64 - Base64 encoded string containing IV, HMAC, and ciphertext.
 * @param {string} passphrase      - Passphrase used to derive the decryption key.
 * @returns {string|null}          - Decrypted plain text or null if HMAC verification fails.
 */
export function decryptText(encryptedBase64: string, passphrase: string): string | null {
    // Decode the Base64 string to a WordArray
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedBase64);
    const ivSize = 16;  // IV is 16 bytes for AES-256-CBC
    const hmacSize = 32; // HMAC-SHA256 is 32 bytes
    const totalBytes = encryptedData.sigBytes;
    
    // Extract IV (first 16 bytes)
    const iv = CryptoJS.lib.WordArray.create(
        encryptedData.words.slice(0, ivSize / 4),
        ivSize
    );
    
    // Extract HMAC (next 32 bytes)
    const hmac = CryptoJS.lib.WordArray.create(
        encryptedData.words.slice(ivSize / 4, (ivSize + hmacSize) / 4),
        hmacSize
    );
    
    // Extract the remaining encrypted bytes
    const encrypted = CryptoJS.lib.WordArray.create(
        encryptedData.words.slice((ivSize + hmacSize) / 4),
        totalBytes - ivSize - hmacSize
    );
    
    // Derive the key from passphrase using SHA-256
    const key = CryptoJS.SHA256(passphrase);
    
    // Verify HMAC for integrity
    const calculatedHmac = CryptoJS.HmacSHA256(encrypted, key);
    if (hmac.toString() !== calculatedHmac.toString()) {
        // La verificación de integridad falló
        return null;
    }
    
    // Decrypt the ciphertext
    const decrypted = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({ ciphertext: encrypted }),
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    
    return decrypted.toString(CryptoJS.enc.Utf8);
}


/**
 * Encrypts plain text using AES-256-CBC.
 *
 * @param {string} plainText - Text to be encrypted.
 * @param {string} passphrase - Passphrase used to derive the encryption key.
 * @returns {string}         - Base64 encoded string containing IV, HMAC, and ciphertext.
 */
export function encryptText(plainText: string, passphrase: string) : string | null {
    // Derive the key using SHA-256
    const key = CryptoJS.SHA256(passphrase);
    
    // Generate a random Initialization Vector (IV) of 16 bytes
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Encrypt the plaintext using AES-256-CBC
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    
    // Compute HMAC over the ciphertext for integrity using HMAC-SHA256
    const hmac = CryptoJS.HmacSHA256(encrypted.ciphertext, key);
    
    // Concatenate IV + HMAC + ciphertext
    const combined = iv.clone().concat(hmac).concat(encrypted.ciphertext);
    
    // Encode the combined data in Base64 for easy transport
    return CryptoJS.enc.Base64.stringify(combined);
}