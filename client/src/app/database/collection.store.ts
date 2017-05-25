import { Observable } from 'rxjs';

import { Collection } from '../models/collection.interface';

import { Subject, BehaviorSubject } from 'rxjs';

import * as Datastore from 'nedb';

/**
 * Performs CRUD on the NEDB data store that is passed to it in the constructor.
 */
export class CollectionStore {
  private countCollectedSubject: codeToObservable = {};

  constructor(
    private db: Datastore) { }

  public countCollectedSet(setCode): Observable<number> {
    this.countCollectedSubject[setCode] = new BehaviorSubject(0);

    this.countSetCollection(setCode);

    return this.countCollectedSubject[setCode];
  }

  public getCollection(setCode): Observable<Collection[]> {
    let collectionSubject = new Subject();

    this.db.find<Collection>({ setCode: setCode }).exec((err, collection) => {
      collectionSubject.next(collection);
    });

    return collectionSubject;
  }

  public collectCard(card): Observable<Collection> {
    let cardCollectedSubject = new Subject();
    this.db.insert(new Collection(card.id, card.setCode), (err, collection) => {
      cardCollectedSubject.next(Collection);

      this.countSetCollection(card.setCode);
    });

    return cardCollectedSubject;
  }

  private countSetCollection(setCode: string): void {
    this.db.count({ setCode: setCode }).exec((err, count) => {
      this.countCollectedSubject[setCode].next(count);
    });
  }
}

interface codeToObservable {
  [setCode: string]: BehaviorSubject<number>;
}