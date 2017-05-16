import { Injectable } from '@angular/core';

import * as Datastore from 'nedb';

@Injectable()
export class DatabaseService {
	public sets: Datastore;
	public cards: Datastore;

	constructor() {
		this.sets = new Datastore({ filename: 'sets.db', autoload: true });
		this.cards = new Datastore({ filename: 'cards.db', autoload: true });
	}
}