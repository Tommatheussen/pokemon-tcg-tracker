import { Injectable } from '@angular/core';

import * as Datastore from 'nedb';

import { Observable } from 'rxjs';

@Injectable()
export class DatabaseService {
	public done: Observable<Boolean> = Observable.of(false);
	public sets: Datastore;
	public cards: Datastore;
	public collection: Datastore;

	constructor() {
		this.sets = new Datastore({ filename: 'sets.db', autoload: true });
		this.cards = new Datastore({ filename: 'cards.db', autoload: true });
		this.collection = new Datastore({ filename: 'collection.db', autoload: true });
	}
}