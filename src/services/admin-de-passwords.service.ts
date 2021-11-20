import { /* inject, */ BindingScope, injectable} from '@loopback/core';
const generatePassword = require('password-generator');
const CryptoJS = require("crypto-js");

@injectable({scope: BindingScope.TRANSIENT})
export class AdminDePasswordsService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  generateRandomPassword() {
    const randomPassword = generatePassword(8, false)
    return randomPassword
  }

  cryptngText(text: string) {
    const cryptedText = CryptoJS.MD5(text).toString()
    return cryptedText
  }
}
