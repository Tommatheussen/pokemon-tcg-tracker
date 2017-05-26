import { Collection } from '../models/collection.interface';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as Datastore from 'nedb';

/**
 * Performs CRUD on the NEDB data store that is passed to it in the constructor.
 */
export class CollectionStore {
  private countCollectedSubject: CodeToObservable = {};

  constructor(
    private db: Datastore) { }

  public countCollectedSet(setCode): Observable<number> {
    this.countCollectedSubject[setCode] = new BehaviorSubject(0);

    this.countSetCollection(setCode);

    return this.countCollectedSubject[setCode];
  }

  public getCollection(setCode): Observable<Collection[]> {
    const collectionSubject: Subject<Collection[]> = new Subject();

    this.db.find<Collection>({ setCode: setCode }).exec((err, collection) => {
      collectionSubject.next(collection);
    });

    return collectionSubject;
  }

  public collectCard(card): Observable<Collection> {
    const cardCollectedSubject: Subject<Collection> = new Subject();

    this.db.insert(new Collection(card.id, card.setCode), (err, collection) => {
      cardCollectedSubject.next(collection);

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

interface CodeToObservable {
  [setCode: string]: BehaviorSubject<number>;
}
