import { Injectable, NgZone } from '@angular/core';
import { MdlSnackbarService, MdlDialogService, MdlDialogReference } from '@angular-mdl/core';

import * as Datastore from 'nedb';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ElectronService } from 'ngx-electron';
import { UpdateAvailableDialogComponent } from './dialog/update-available-dialog.component';

import { UpdateInfo } from './models/update-info.interface';
import { UPDATE_INFO } from './models/update-info.token';

@Injectable()
export class UpdaterService {
  private dialogObservable: Subject<string>;

  constructor(
    private electronService: ElectronService,
    private mdlSnackbarService: MdlSnackbarService,
    private mdlDialogService: MdlDialogService,
    private ngZone: NgZone
  ) {
    this.setupUpToDateHandler();
    this.setupNewVersionHandler();
    this.setupDownloadStartedHandler();
    this.setupDownloadFinishedHandler();
    // this.setupDownloadProgressHandler();

    electronService.ipcRenderer.send('check-update');
  }

  private setupNewVersionHandler(): void {
    this.electronService.ipcRenderer.on('update-available', (ev, info: UpdateInfo) => {
      this.ngZone.run(() => {
        const updateAvailableDialog: Observable<MdlDialogReference> = this.mdlDialogService.showCustomDialog({
          component: UpdateAvailableDialogComponent,
          providers: [
            {
              provide: UPDATE_INFO,
              useValue: info
            }
          ],
          isModal: true,
          styles: { 'width': '650px' },
          clickOutsideToClose: false,
          enterTransitionDuration: 400,
          leaveTransitionDuration: 400
        });

        updateAvailableDialog.subscribe((dialogRef: MdlDialogReference) => {
          dialogRef.onHide().subscribe((data) => {
            if (data) {
              this.electronService.ipcRenderer.send('download-update');
            }
          });
        });
      });
    });
  }

  private setupUpToDateHandler(): void {
    this.electronService.ipcRenderer.on('up-to-date', (event) => {
      this.ngZone.run(() => {
        this.mdlSnackbarService.showToast('Hooray, you\'re using the latest version!');
      });
    });
  }

  private setupDownloadStartedHandler(): void {
    this.electronService.ipcRenderer.on('update-download-started', () => {
      this.ngZone.run(() => {
        this.mdlSnackbarService.showToast('Update downloading, you will be prompted when this is finished');
      });
    });
  }

  private setupDownloadFinishedHandler(): void {
    this.electronService.ipcRenderer.on('update-download-finished', () => {
      this.ngZone.run(() => {
        const updateDownloadedDialog: Observable<void> =
          this.mdlDialogService.alert('Update downloaded, application will close to install now', 'Ok', 'Update downloaded');
        updateDownloadedDialog.subscribe(() => {
          this.electronService.ipcRenderer.send('install-update');
        });
      });
    });
  }

  private setupDownloadProgressHandler(): void {
    this.electronService.ipcRenderer.on('update-download-progress', (event, progress) => {
      console.log(progress);
    });
  }
}
