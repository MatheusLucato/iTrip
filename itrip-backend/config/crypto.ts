import crypto from 'crypto';
import env from 'env';


const cryptoAux = require('crypto');

// Chave e IV fixos para exemplos (não seguro para produção!)
const key = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'); // 64 caracteres hexadecimais -> 32 bytes
const iv = Buffer.from('abcdef9876543210abcdef9876543210', 'hex'); // 32 caracteres hexadecimais -> 16 bytes

function encrypt(text) {
  let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText) {
  let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted.toString();
}

export { encrypt, decrypt }
