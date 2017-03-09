export class HistoryEntry {
  public timestamp: number;
  public text: string;
  public isOptimistic: boolean;

  constructor(timestamp: number, text: string, isOptimistic: boolean) {
    this.timestamp = timestamp;
    this.text = text;
    this.isOptimistic = isOptimistic;
  }
}
