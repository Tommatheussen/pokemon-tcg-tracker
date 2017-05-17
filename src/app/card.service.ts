import { Injectable, NgZone,  } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';

import { DatabaseService } from './database.service';

import * as Datastore from 'nedb';
import { Card } from './card.interface';

@Injectable()
export class CardService {
	private _cards: Datastore;

	constructor(private db: DatabaseService, private http: Http, private ngZone: NgZone) {
    this._cards = db.cards;
	}

  public get(setCode: string): Observable<Card[]> {
    return Observable.create(observer => {
      this._cards.find<Card>({ setCode: setCode }, (err, cards) => {
        console.log(err);
        if (!err) {
          console.log(cards);
          if (cards.length == 0) {
            this.getCards(setCode).subscribe(cards => {
              console.log(cards);
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

  public countCollected(setCode: string): Observable<number> {
    return Observable.create(observer => {
      this.db.collection.count({ setCode: setCode, collected: true }, (err, count) => {
        this.ngZone.run(() => {
          observer.next(count);
          observer.complete();
        });
      });
    });
  }

  private getCards(setCode: string): Observable<Card[]> {
    let params = new URLSearchParams();
    params.append('setCode', setCode);
    return this.http.get('https://api.pokemontcg.io/v1/cards', { search: params }).map((res: Response) => <Card[]>res.json().cards);
  }
}