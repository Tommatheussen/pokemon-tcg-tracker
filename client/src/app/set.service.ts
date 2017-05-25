import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';

import * as Datastore from 'nedb';
import { Set } from './models/set.interface';

import { SetStore } from './database/set.store';

@Injectable()
export class SetService {
	private setStore: SetStore;

	constructor(private http: Http) {
		let db = new Datastore({ filename: 'sets.db', autoload: true });
		this.setStore = new SetStore(db, http);
	}

	public getSetList(): Observable<Set[]> {
		return this.setStore.getSets();
	}
}