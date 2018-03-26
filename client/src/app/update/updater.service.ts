import { Injectable, isDevMode, NgZone } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';

import { UpdateInfo } from '../models/update-info.interface';
import { UpdateAvailableDialogComponent } from './update-available/update-available-dialog.component';
import { UpdateDownloadedDialogComponent } from './update-downloaded/update-downloaded-dialog.component';

@Injectable()
export class UpdaterService {
  constructor(
    // private settingsService: SettingsService,
    private _electronService: ElectronService,
    private _snackbar: MatSnackBar,
    private _dialog: MatDialog,
    private _zone: NgZone
  ) {}

  public setupHandlers(): void {
    this.setupUpToDateHandler();
    this.setupNewVersionHandler();
    this.setupDownloadStartedHandler();
    this.setupDownloadFinishedHandler();
    // this.setupDownloadProgressHandler();

    // this.settingsService.getSetting('auto_update').subscribe(setting => {
    //   if (setting !== null && setting) {
    //     this.electronService.ipcRenderer.send('check-update');
    //   }
    // });

    this._electronService.ipcRenderer.send('check-update');
  }

  private setupNewVersionHandler(): void {
    this._electronService.ipcRenderer.on(
      'update-available',
      (ev, info: UpdateInfo) => {
        this._zone.run(() => {
          this._dialog
            .open(UpdateAvailableDialogComponent, {
              data: info,
              width: '500px'
            })
            .afterClosed()
            .subscribe(result => {
              if (result) {
                this._electronService.ipcRenderer.send('download-update');
              }
            });
        });
      }
    );
  }

  private setupUpToDateHandler(): void {
    this._electronService.ipcRenderer.on('up-to-date', event => {
      this._zone.run(() => {
        this._openSnackbar("Hooray, you're using the latest version!");
      });
    });
  }

  private setupDownloadStartedHandler(): void {
    this._electronService.ipcRenderer.on('update-download-started', () => {
      this._zone.run(() => {
        this._openSnackbar(
          'Update downloading, you will be prompted when it is ready to be installed.'
        );
      });
    });
  }

  private setupDownloadFinishedHandler(): void {
    this._electronService.ipcRenderer.on('update-download-finished', () => {
      this._zone.run(() => {
        this._dialog
          .open(UpdateDownloadedDialogComponent, {
            width: '500px',
            disableClose: true
          })
          .afterClosed()
          .subscribe(result => {
            if (!isDevMode()) {
              this._electronService.ipcRenderer.send('install-update');
            }
          });
      });
    });
  }

  private setupDownloadProgressHandler(): void {
    this._electronService.ipcRenderer.on(
      'update-download-progress',
      (event, progress) => {
        console.log(progress);
      }
    );
  }

  private _openSnackbar(text: string): void {
    this._snackbar.open(text, undefined, {
      duration: 3000
    });
  }
}
