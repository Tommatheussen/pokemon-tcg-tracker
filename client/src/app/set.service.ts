import { Injectable, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';

import * as Datastore from 'nedb';
import { Set } from './models/set.interface';

import { SetStore } from './database/set.store';

@Injectable()
export class SetService {
	private setStore: SetStore;

	constructor(private http: Http,	private ngZone: NgZone) {
		let db = new Datastore({ filename: 'sets.db', autoload: true });
		this.setStore = new SetStore(db, http);

		//TODO: Seed
		//this.seedSets();
	}

	/*

	private seedSets(): void {
		this._sets.count({}, (err: Error, count: number) => {
			if (count === 0) {
				this.http.get('https://api.pokemontcg.io/v1/sets')
					.map((res: Response) => <Set[]>res.json().sets)
					.subscribe(sets => this._sets.insert(sets));
			}
		})
	}*/

	public getSetList(): Observable<Set[]> {
		return this.setStore.getSets();
	}

	/*

  public get(): Observable<Set[]> {
    return Observable.create(observer => {
      this._sets.find<Set>({}, (err, sets) => {
        this.ngZone.run(() => {
          observer.next(sets);
          observer.complete();
        });
      });
		});
	}*/
}