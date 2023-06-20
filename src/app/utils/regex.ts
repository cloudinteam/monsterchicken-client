export class RegexPattern {

  // For Name, Username
  static username: RegExp = /^[a-zA-Z\s]+$/;

  // for email
  static email: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  //For phone number
  static phone: RegExp = /^[6-9]\d{9}$/;


}
