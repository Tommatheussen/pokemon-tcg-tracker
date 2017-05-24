import { Set } from '../models/set.interface';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import * as Rx from 'rxjs';

import * as Datastore from 'nedb';
/**
 * Performs CRUD on the NEDB data store that is passed to it in the constructor.
 */
export class SetStore {
    constructor(private db: Datastore, private http: Http) {
        let count = db.count({}).exec((err, count) => {
            if (count === 0) {
                http.get('https://api.pokemontcg.io/v1/sets')
                    .map((res: Response) => <Set[]>res.json().sets)
					.subscribe(sets => db.insert(sets));

                //TODO: Seed
                console.log('need to seed sets');
            }
        });
    }

    /**
     * List Pads
     */
    public getSets(): Observable<Set[]> {
        return Rx.Observable.create(observer => {
            this.db.find({}).exec((err, sets) => {
                observer.next(sets);
                observer.complete();
            });
        });
    }

    /*

    public createPad(item: Pad): Observable<Pad> {
        return Rx.Observable.create(observer => {
            this.db.insert(item, () => {
                observer.onNext(item);
                observer.onCompleted();
            });
        });
    }

    public getPad(uuid: string): Observable<Pad> {
        return Rx.Observable.create(observer => {
            this.db.findOne({uuid: uuid}, (err, item) => {
                observer.onNext(item);
                observer.onCompleted();
            });
        });
    }

    public updatePad(pad: Pad): Observable<Pad> {
        return Rx.Observable.create(observer => {
            let updateObject = {};
            for (let prop in pad) {
                updateObject[prop] = pad[prop];
            }
            this.db.update({uuid: pad.uuid}, { $set: updateObject }, () => {
                observer.onNext(true);
                observer.onCompleted();
            });
        });
    }

    public deletePad(uuid: string): Observable<string> {
        return Rx.Observable.create(observer => {
            this.db.remove({uuid: uuid}, () => {
                observer.onNext(uuid);
                observer.onCompleted();
            });
        });
    }

    public addActionToPad(padUuid: string, action: Action): Observable<string> {
        return Rx.Observable.create(observer => {
            this.db.update({uuid: padUuid},
                {
                    $push: { history: action },
                    $inc: { historyPointer: 1 }
                }, () => {
                    observer.onNext(padUuid);
                    observer.onCompleted();
                });
        });
    }*/
}