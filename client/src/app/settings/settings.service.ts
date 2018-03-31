import 'rxjs/add/Observable/of';

import { Injectable, NgZone } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';

import { SettingsDialogComponent } from './settings-dialog.component';

@Injectable()
export class SettingsService {
  constructor(
    private _electronService: ElectronService,
    private _zone: NgZone,
    private _dialog: MatDialog,
    private _snackbar: MatSnackBar
  ) {}

  public setupHandlers(): void {
    this.setupSettingsHandler();
  }

  private setupSettingsHandler(): void {
    this._electronService.ipcRenderer.on('settings:open', (event, settings) => {
      this._zone.run(() => {
        this._dialog.open(SettingsDialogComponent, {
          data: settings,
          width: '500px'
        });
      });
    });
  }
}
