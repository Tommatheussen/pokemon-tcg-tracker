import { Injectable, NgZone } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/of';

import * as Datastore from 'nedb';
import { Settings } from '../models/setting.interface';

import { SettingsStore } from '../database/settings.store';

import { ElectronService } from 'ngx-electron';

import { MdlDialogReference, MdlDialogService } from '@angular-mdl/core';

import { SettingsDialogComponent } from './settings-dialog.component';

import { SETTINGS } from '../models/settings.token';

@Injectable()
export class SettingsService {
  constructor(
    private electronService: ElectronService,
    private ngZone: NgZone,
    private mdlDialogService: MdlDialogService,
    private settingsStore: SettingsStore
  ) {
    this.setupSettingsHandler();
  }

  public getSetting(key): Observable<any> {
    return Observable.of(this.settingsStore.getSetting(key));
  }

  public getAllSettings(): Observable<Settings> {
    return Observable.of(this.settingsStore.getAllSettings());
  }

  private setupSettingsHandler(): void {
    this.electronService.ipcRenderer.on('open-settings', (ev) => {
      this.getAllSettings()
        .subscribe(settings => {
          this.ngZone.run(() => {
            const updateAvailableDialog: Observable<MdlDialogReference> = this.mdlDialogService.showCustomDialog({
              component: SettingsDialogComponent,
              providers: [
                {
                  provide: SETTINGS,
                  useValue: { ...settings }
                }],
              isModal: true,
              styles: { 'width': '400px' },
              clickOutsideToClose: false,
              enterTransitionDuration: 400,
              leaveTransitionDuration: 400
            });

            updateAvailableDialog.subscribe((dialogRef: MdlDialogReference) => {
              dialogRef.onHide().subscribe((data) => {
                if (data && data !== settings) {
                  this.settingsStore.saveSettings(data);
                }
              });
            });
          });
        });
    });
  }
}
