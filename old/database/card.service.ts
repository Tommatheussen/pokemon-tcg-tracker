import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/observable';

import * as Datastore from 'nedb';
import { Card } from '../models/card.interface';
import { Set } from '../models/set.interface';

import { CardStore } from './card.store';

@Injectable()
export class CardService {
  private cardStore: CardStore;

  constructor(private http: Http) {
    const db: Datastore = new Datastore({ filename: 'cards.db', autoload: true });
    this.cardStore = new CardStore(db, http);
  }

  public get(set: Set): Observable<Card[]> {
    return this.cardStore.getCards(set);
  }
}
