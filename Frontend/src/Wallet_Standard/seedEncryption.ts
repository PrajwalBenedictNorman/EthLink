import CryptoJS from "crypto-js";
import axios from "axios";

// Browser-compatible key derivation using PBKDF2 (similar security to Argon2)
async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  // Convert password and salt to WordArray format for crypto-js
  const passwordWordArray = CryptoJS.enc.Utf8.parse(password);
  const saltWordArray = CryptoJS.lib.WordArray.create(salt);
  
  // Use PBKDF2 with 100,000 iterations (similar security to Argon2)
  const key = CryptoJS.PBKDF2(passwordWordArray, saltWordArray, {
    keySize: 256 / 32, // 32 bytes = 256 bits
    iterations: 100000
  });
  
  // Convert to Uint8Array
  const keyWords = key.words;
  const keyArray = new Uint8Array(keyWords.length * 4);
  for (let i = 0; i < keyWords.length; i++) {
    const word = keyWords[i];
    keyArray[i * 4] = (word >>> 24) & 0xff;
    keyArray[i * 4 + 1] = (word >>> 16) & 0xff;
    keyArray[i * 4 + 2] = (word >>> 8) & 0xff;
    keyArray[i * 4 + 3] = word & 0xff;
  }
  
  return keyArray.slice(0, 32); // Return exactly 32 bytes
}

// Note: This function should be called from a React component where useRecoilValue can be used
// Or pass mnemonic as a parameter
export async function seedEncrypt(password: string, mnemonic: string) {
  try {
    // Generate random salt (16 bytes)
    const saltArray = new Uint8Array(16);
    crypto.getRandomValues(saltArray);
    
    // Derive key from password
    const key = await deriveKey(password, saltArray);
    
    // Convert mnemonic to buffer
    const plaintext = new TextEncoder().encode(mnemonic);
    
    // Encrypt using AES-256-GCM
    const { cipherText, iv, authTag } = await encryptAES256GCM(plaintext, key);
    
    // Convert to base64 for transmission
    const saltBase64 = btoa(String.fromCharCode(...saltArray));
    const cipherTextBase64 = btoa(String.fromCharCode(...cipherText));
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const authTagBase64 = btoa(String.fromCharCode(...authTag));
    
    // Send to backend
    const seedCreated = await axios.post(`${import.meta.env.VITE_BACKEND_URL_DEV}/user/seed`, {
      encryptedSeed: cipherTextBase64,
      iv: ivBase64,
      authTag: authTagBase64,
      salt: saltBase64
    });
    
    return seedCreated;
  } catch (error) {
    console.error('Error encrypting seed:', error);
    throw error;
  }
}



// Browser-compatible AES-256-GCM encryption using Web Crypto API
export async function encryptAES256GCM(
  plaintext: Uint8Array,
  key: Uint8Array // 32 bytes
): Promise<{ cipherText: Uint8Array; iv: Uint8Array; authTag: Uint8Array }> {
  // Generate 96-bit (12 bytes) IV for GCM
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);

  // Import the key - create a new Uint8Array to ensure correct buffer type
  const keyBuffer = new Uint8Array(key);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // Encrypt - create a new Uint8Array to ensure correct buffer type
  const plaintextBuffer = new Uint8Array(plaintext);
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128, // 128-bit authentication tag
    },
    cryptoKey,
    plaintextBuffer
  );

  // Extract ciphertext and auth tag
  // In Web Crypto API, auth tag is appended to ciphertext
  const encryptedArray = new Uint8Array(encrypted);
  const authTag = encryptedArray.slice(-16); // Last 16 bytes are the auth tag
  const cipherText = encryptedArray.slice(0, -16); // Rest is ciphertext

  return {
    cipherText,
    iv,
    authTag,
  };
}
