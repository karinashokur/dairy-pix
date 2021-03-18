import CryptoJS from 'crypto-js';
import { CryptoError } from '../types/errors';
export default abstract class CryptoService {
  private static passphrase: string | false = 'myPassword'; 
  static encrypt(value: string): string {
    if (!this.passphrase) return value;
    try {
      return JSON.stringify({
        hash: CryptoJS.HmacSHA256(value, this.passphrase).toString(),
        cipher: CryptoJS.AES.encrypt(value, this.passphrase).toString(),
      });
    } catch (e) {
      console.error('Encryption failed: ', value, e);
      throw new CryptoError();
    }
  }
  static decrypt(value: string): string {
    if (!this.passphrase) return value;
    try {
      const tuple = JSON.parse(value);
      if (!tuple.hash || !tuple.cipher) return value; 
      const plain = CryptoJS.AES.decrypt(tuple.cipher, this.passphrase).toString(CryptoJS.enc.Utf8);
      const hash = CryptoJS.HmacSHA256(plain, this.passphrase).toString();
      if (tuple.hash !== hash) throw new Error('Hash Mismatch');
      return plain;
    } catch (e) {
      console.error('Decryption failed: ', e);
      throw new CryptoError();
    }
  }
}
