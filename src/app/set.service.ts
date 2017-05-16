import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';

import { DatabaseService } from './database.service';

import * as Datastore from 'nedb';
import { Set } from './set.interface';

@Injectable()
export class SetService {
	private _sets: Datastore;

	constructor(private db: DatabaseService, private http: Http) {
		this._sets = db.sets;
	}

	public seed(): void {
		this.http.get('https://api.pokemontcg.io/v1/sets')
			.map((res: Response) => <Set[]>res.json().sets)
			.subscribe(sets => this._sets.insert(sets));
	}

	public get(): Observable<Set[]> {
		return Observable.create((observer) => {
			this._sets.find({}, (err, sets) => {
				console.log(err, sets);
				observer.next(sets);
				observer.complete();
			});
		});
	}
}