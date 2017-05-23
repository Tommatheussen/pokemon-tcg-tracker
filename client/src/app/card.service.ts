import { Injectable, NgZone,  } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';

import { DatabaseService } from './database.service';

import * as Datastore from 'nedb';
import { Card } from './card.interface';
import { Set } from './set.interface';

@Injectable()
export class CardService {
	private _cards: Datastore;

	constructor(private db: DatabaseService, private http: Http, private ngZone: NgZone) {
    this._cards = db.cards;
	}

  public get(set: Set): Observable<Card[]> {
    return Observable.create(observer => {
      this._cards.find<Card>({ setCode: set.code }, (err, cards) => {
        if (!err || cards.length > set.totalCards) {
          if (cards.length == 0 || cards.length !== set.totalCards) {
            this.getCards(set).subscribe(cards => {
              this._cards.insert(cards);

              this.ngZone.run(() => {
                observer.next(cards);
                observer.complete();
              });
            });
          } else {
            this.ngZone.run(() => {
              observer.next(cards);
              observer.complete();
            });
          }
        }
      });
		});
  }

  private getCards(set: Set): Observable<Card[]> {
    let params = new URLSearchParams();
    params.append('setCode', set.code);
    params.append('pageSize', String(set.totalCards));
    return this.http.get('https://api.pokemontcg.io/v1/cards', { search: params }).map((res: Response) => <Card[]>res.json().cards);
  }
}