import { Injectable, isDevMode } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { IpcService } from '../ipc.service';
import { UpdateInfo } from '../models/update-info.interface';
import { UpdateAvailableDialogComponent } from './update-available/update-available-dialog.component';
import { UpdateDownloadedDialogComponent } from './update-downloaded/update-downloaded-dialog.component';

@Injectable()
export class UpdaterService {
  constructor(
    private _ipcService: IpcService,
    private _snackbar: MatSnackBar,
    private _dialog: MatDialog
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

    if (!isDevMode()) {
      this._ipcService.sendMessage('check-update');
    }
  }

  private setupNewVersionHandler(): void {
    this._ipcService.setupIpcListener(
      'update-available',
      (ev, info: UpdateInfo) => {
        this._dialog
          .open(UpdateAvailableDialogComponent, {
            data: info,
            width: '500px'
          })
          .afterClosed()
          .subscribe(result => {
            if (result) {
              this._ipcService.sendMessage('download-update');
            }
          });
      }
    );
  }

  private setupUpToDateHandler(): void {
    this._ipcService.setupIpcListener('up-to-date', event => {
      this._openSnackbar("Hooray, you're using the latest version!");
    });
  }

  private setupDownloadStartedHandler(): void {
    this._ipcService.setupIpcListener('update-download-started', () => {
      this._openSnackbar(
        'Update downloading, you will be prompted when it is ready to be installed.'
      );
    });
  }

  private setupDownloadFinishedHandler(): void {
    this._ipcService.setupIpcListener('update-download-finished', () => {
      this._dialog
        .open(UpdateDownloadedDialogComponent, {
          width: '500px',
          disableClose: true
        })
        .afterClosed()
        .subscribe(result => {
          this._ipcService.sendMessage('install-update');
        });
    });
  }

  private setupDownloadProgressHandler(): void {
    this._ipcService.setupIpcListener(
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
