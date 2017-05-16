import { Injectable } from '@angular/core';

import * as Datastore from 'nedb';

import { ElectronService } from 'ngx-electron';

@Injectable()
export class DatabaseService {
	public sets: Datastore;
	public cards: Datastore;

	constructor(private electronService: ElectronService) {
		let db = this.electronService.remote.getGlobal('db');
		this.sets = db.sets;
		this.cards = db.cards;
	}
}