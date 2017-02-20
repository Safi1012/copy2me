export class User {
  public uid: string;
  public token: string;

  constructor(uid: string, token: string) {
    this.uid = uid;
    this.token = token;
  }
}
