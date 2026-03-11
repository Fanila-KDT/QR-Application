import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = 'P3Rq8o90N81VRV6VVzwtamGwRhUAQ6Es';

  constructor() {}

  decryptTag(encryptedBase64: string): string {
    const encryptedBytes = CryptoJS.enc.Base64.parse(decodeURIComponent(encryptedBase64));

    const iv = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(0, 4), 16);
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(4), encryptedBytes.sigBytes - 16);
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);

    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
