import { Setting } from '../models/setting.interface';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as Datastore from 'nedb';
/**
 * Performs CRUD on the NEDB data store that is passed to it in the constructor.
 */
export class SettingStore {
  constructor(private db: Datastore) { }

  /**
   * List Sets
   */
  public init(): Observable<Setting[]> {
    const settingsSubject: Subject<Setting[]> = new Subject();

    this.db.find<Setting>({}).exec((err, settings) => {
      if(settings.length === 0) {
        this.db.insert({
          key: 'auto-update',
          value: true
        });
      }
      settingsSubject.next(settings);
    });

    return settingsSubject;
  }

  public getSetting(key: string): Observable<Setting> {
    const settingsSubject: Subject<Setting> = new Subject();

    this.db.findOne<Setting>({ key: key }, ((err, setting: Setting) => {
      console.log(err, setting);
      settingsSubject.next(setting);
    }));

    return settingsSubject;
  }
}
