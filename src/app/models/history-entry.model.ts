export class HistoryEntry {
  public timestamp: number;
  public text: string;

  constructor(timestamp: number, text: string) {
    this.timestamp = timestamp;
    this.text = text;
  }
}
