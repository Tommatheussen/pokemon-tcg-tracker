import { Injectable, NgZone } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as Datastore from 'nedb';
import { Setting } from './models/setting.interface';

import { SettingStore } from './database/settings.store';

@Injectable()
export class SettingsService {
  private settingStore: SettingStore;
  private settings: Setting[];

  constructor() {
    const db: Datastore = new Datastore({ filename: 'settings.db', autoload: true });
    this.settingStore = new SettingStore(db);
  }

  public getSetting(key): Observable<Setting> {
    return this.settingStore.getSetting(key);
  }

  public init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.settingStore.init()
        .subscribe(() => {
          resolve(true);
        })
    });
  }
}
