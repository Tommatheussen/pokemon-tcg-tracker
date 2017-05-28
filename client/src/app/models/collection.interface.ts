export class Collection {
  collected: Date;
  card: string;
  setCode: string

  constructor(card: string, set: string) {
    this.card = card;
    this.setCode = set;
    this.collected = new Date();
  }
}
