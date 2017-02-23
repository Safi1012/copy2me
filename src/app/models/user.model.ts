import { Push } from './push.model';

export class User {
  public uid: string;
  public token: string;
  public push: Push;

  constructor(uid: string, token: string, push: Push) {
    this.uid = uid;
    this.token = token;
    this.push = push;
  }
}
