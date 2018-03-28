import { Set } from '../models/set.interface';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as Datastore from 'nedb';
/**
 * Performs CRUD on the NEDB data store that is passed to it in the constructor.
 */
export class SetStore {
  private setListSubject = new Subject();

  constructor(
    private db: Datastore,
    private http: Http) { }

  /**
   * List Sets
   */
  public getSets(): Observable<Set[]> {
    this.db.find({}).exec((err, dbsets) => {
      if (dbsets.length === 0) {
        this.http.get('https://api.pokemontcg.io/v1/sets')
          .map((res: Response) => <Set[]>res.json().sets)
          .subscribe(sets => {
            this.db.insert(sets)
            this.setListSubject.next(sets)
          });
      } else {
        this.setListSubject.next(dbsets);
      }
    });

    return this.setListSubject;
  }
}
