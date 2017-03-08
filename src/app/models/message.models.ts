import { User } from './user.model';

export class Message {
  public timestamp: string;
  public user: User;
  public text: string;

  constructor(timestamp: string, user: User, text: string) {
    this.timestamp = timestamp;
    this.user = user;
    this.text = text;
  }
}
