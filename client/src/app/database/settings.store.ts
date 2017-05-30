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

  private defaultValues: { [key: string]: any } = {
    "auto-update": true
  }

  public getSetting(key: string): Observable<Setting> {
    const settingsSubject: Subject<Setting> = new Subject();

    this.db.findOne<Setting>({ key: key }, ((err, setting: Setting) => {
      // Setting doesn't exist, insert default
      if (setting === null) {
        console.log(`setting doesn't exist, inserting: ${key}`);
        this.db.insert(new Setting(key, this.defaultValues[key]), (err, setting) => {
          settingsSubject.next(setting);
        });
      } else {
        settingsSubject.next(setting);
      }
    }));

    return settingsSubject;
  }
}
