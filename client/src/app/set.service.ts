import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import * as Datastore from 'nedb';
import { Set } from './models/set.interface';

import { SetStore } from './database/set.store';

@Injectable()
export class SetService {
  private setStore: SetStore;

  constructor(private http: Http) {
    const db: Datastore = new Datastore({ filename: 'sets.db', autoload: true });
    this.setStore = new SetStore(db, http);
  }

  public getSetList(): Observable<Set[]> {
    return this.setStore.getSets();
  }
}
