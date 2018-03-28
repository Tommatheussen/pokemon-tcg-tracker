import { Card } from '../models/card.interface';
import { Set } from '../models/set.interface';

import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as Datastore from 'nedb';

/**
 * Performs CRUD on the NEDB data store that is passed to it in the constructor.
 */
export class CardStore {
  private cardListSubject = new Subject();

  constructor(
    private db: Datastore,
    private http: Http) { }

  /**
   * List Sets
   */
  public getCards(set: Set): Observable<Card[]> {
    this.db.find({ setCode: set.code }).exec((err, dbcards) => {
      if (dbcards.length === 0 || dbcards.length !== set.totalCards) {
        const params: URLSearchParams = new URLSearchParams();
        params.append('setCode', set.code);
        params.append('pageSize', String(set.totalCards));
        this.http.get('https://api.pokemontcg.io/v1/cards', { search: params })
          .map((res: Response) => <Card[]>res.json().cards)
          .subscribe(cards => {
            this.db.insert(cards);
            this.cardListSubject.next(cards);
          });
      } else {
        this.cardListSubject.next(dbcards);
      }
    });

    return this.cardListSubject;
  }
}
