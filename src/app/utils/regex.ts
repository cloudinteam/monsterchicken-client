export class RegexPattern {

  // For Name, Username
  static username: RegExp = /^[a-zA-Z\s]+$/;

  // for email
  // static email: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  static email: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,5}$/i;

  //For phone number
  static phone: RegExp = /^[6-9]\d{9}$/;


  // For only numbers without space
  static onlyNumbers: RegExp = /^[0-9]*$/;

}
