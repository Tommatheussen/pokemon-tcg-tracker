import { Injectable } from '@angular/core';

import * as Datastore from 'nedb';

import { Observable } from 'rxjs';

@Injectable()
export class DatabaseService {
	public cards: Datastore;

	constructor() {
		this.cards = new Datastore({ filename: 'cards.db', autoload: true });
	}
}