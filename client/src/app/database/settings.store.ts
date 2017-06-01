import { Settings } from '../models/setting.interface';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as Datastore from 'nedb';

/**
 * Performs CRUD on the NEDB data store that is passed to it in the constructor.
 */
export class SettingsStore {
  private db: Datastore;
  private settings: Settings;

  constructor() {
    this.db = new Datastore({ filename: 'settings.db', autoload: true });
  }

  private defaultValues: Settings = {
    auto_update: false
  };

  public getSetting(key): any{
    return this.settings[key];
  }

  public getAllSettings(): Settings {
    return this.settings;
  }

  public saveSettings(settings: Settings): void {
    this.db.update(this.settings, settings, {}, (err, numReplaced) => {
      this.settings = settings;
    });
  }

  public initSettings(): Promise<Settings> {
    return new Promise((resolve, reject) => {
      this.db.findOne<Settings>({}, (err, settings) => {
        if (settings !== null) {
          this.settings = settings;
          resolve(this.settings);
        } else {
          this.db.insert(this.defaultValues, (err, settings) => {
            this.settings = settings;
            resolve(this.settings);
          });
        }
      });
    });
  }
}
