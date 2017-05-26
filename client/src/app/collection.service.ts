import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/observable';

import * as Datastore from 'nedb';
import { Collection } from './models/collection.interface';
import { Card } from './models/card.interface';

import { CollectionStore } from './database/collection.store';

@Injectable()
export class CollectionService {
  private collectionStore: CollectionStore;

  constructor() {
    const db: Datastore = new Datastore({ filename: 'collection.db', autoload: true });
    this.collectionStore = new CollectionStore(db);
  }

  public get(setCode: string): Observable<Collection[]> {
    return this.collectionStore.getCollection(setCode);
  }

  public collectCard(card: Card): Observable<Collection> {
    return this.collectionStore.collectCard(card);
  }

  public countCollected(setCode: string): Observable<number> {
    return this.collectionStore.countCollectedSet(setCode);
  }
}
