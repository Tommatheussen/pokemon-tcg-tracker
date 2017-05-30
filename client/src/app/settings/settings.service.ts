import { Injectable, NgZone } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as Datastore from 'nedb';
import { Setting } from '../models/setting.interface';

import { SettingStore } from '../database/settings.store';

import { ElectronService } from 'ngx-electron';

import { MdlDialogReference, MdlDialogService } from '@angular-mdl/core';

import { SettingsDialogComponent } from './settings-dialog.component';

@Injectable()
export class SettingsService {
  private settingStore: SettingStore;
  private settings: Setting[];

  constructor(
    private electronService: ElectronService,
    private ngZone: NgZone,
    private mdlDialogService: MdlDialogService
  ) {
    const db: Datastore = new Datastore({ filename: 'settings.db', autoload: true });
    this.settingStore = new SettingStore(db);

    this.setupSettingsHandler();
  }

  public getSetting(key): Observable<Setting> {
    return this.settingStore.getSetting(key);
  }

  private setupSettingsHandler(): void {
    this.electronService.ipcRenderer.on('open-settings', (ev) => {
      this.ngZone.run(() => {
        const updateAvailableDialog: Observable<MdlDialogReference> = this.mdlDialogService.showCustomDialog({
          component: SettingsDialogComponent,
          isModal: true,
          styles: { 'width': '650px' },
          clickOutsideToClose: false,
          enterTransitionDuration: 400,
          leaveTransitionDuration: 400
        });

        updateAvailableDialog.subscribe((dialogRef: MdlDialogReference) => {
          dialogRef.onHide().subscribe((data) => {
            if (data) {
              //this.electronService.ipcRenderer.send('download-update');
            }
          });
        });
      });
    });
  }
}
