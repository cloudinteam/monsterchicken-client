import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  private key = environment.enKey;
  private iv = environment.enIv;
  cfg: any = {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    cipher: CryptoJS.AES,
    iv: this.iv,
  };
  constructor() {}
  //AES256 Encryption
  encrypt(req: any) {
    let data = CryptoJS.enc.Utf8.parse(JSON.stringify(req));
    var encryptedMessage = CryptoJS.AES.encrypt(data, this.key, this.cfg);
    return encryptedMessage.toString();
  }

  //AES256 Decryption
  decrypt(req: any) {
    var decrypt = CryptoJS.AES.decrypt(req, this.key, this.cfg);
    var decryptedMessage2 = CryptoJS.enc.Utf8.stringify(decrypt);
    return JSON.parse(decryptedMessage2);
  }

  //to mask input JSON body
  dataIn(data: any): any {
    // console.log(data);
    let output = {
      input: this.encrypt(data),
    };
    return output;
  }

  //unmask encryption to JSON
  unmaskData(data: any): any {
    let output = this.decrypt(data.data);
    // console.log(output);
    return output;
  }

}
