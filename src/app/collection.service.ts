import { Injectable, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';

import { DatabaseService } from './database.service';

import * as Datastore from 'nedb';
import { Collection } from './collection.interface';
import { Card } from './card.interface';

@Injectable()
export class CollectionService {
	private _collection: Datastore;

	constructor(
		private db: DatabaseService,
		private ngZone: NgZone) {
		this._collection = db.collection;
	}

  public get(setCode: string): Observable<Collection[]> {
    return Observable.create(observer => {
      this._collection.find<Collection>({ setCode: setCode }, (err, collection) => {
        this.ngZone.run(() => {
          observer.next(collection);
          observer.complete();
        });
      });
		});
  }

  public collectCard(card: Card): Observable<Card[]> {
    return Observable.create(observer => {
      this._collection.insert<Collection>(new Collection(card.id, card.setCode), (err, collection) => {
        this.ngZone.run(() => {
          observer.next(collection);
          observer.complete();
        });
      });
    });
  }

  public countCollected(setCode: string): Observable<number> {
    return Observable.create(observer => {
      this.db.collection.count({ setCode: setCode }, (err, count) => {
        this.ngZone.run(() => {
          observer.next(count);
          observer.complete();
        });
      });
    });
  }
}