export class Consts {
  static Version = '0.0.2';
  static Production = true;
  static SERVER_URL_TEST = 'https://api.monsterchicken.cloudinworks.com';
  static SERVER_URL_PROD = 'https://api.monsterchicken.cloudinworks.com';

  static URL(): string {
    if (this.Production) return this.SERVER_URL_PROD;
    else return this.SERVER_URL_TEST;
  }
}
