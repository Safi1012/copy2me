export class Push {
  public endpoint: string;
  public auth: string;
  public p256dh: string;

  constructor(endpoint: string, auth: string, p256dh: string) {
    this.endpoint = endpoint;
    this.auth = auth;
    this.p256dh = p256dh;
  }
}
