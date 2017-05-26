import { Injectable, NgZone } from '@angular/core';
import { MdlSnackbarService, MdlDialogService, MdlDialogReference } from '@angular-mdl/core';

import * as Datastore from 'nedb';

import { Subject, Observable } from 'rxjs';

import { ElectronService } from 'ngx-electron';
import { DialogComponent } from './dialog/dialog.component';

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

    electronService.ipcRenderer.send("check-update");
  }

  private setupNewVersionHandler(): void {  
    this.electronService.ipcRenderer.on("update-available", (ev, info: UpdateInfo) => {
      this.ngZone.run(() => {
        let updaterDialog: Observable<MdlDialogReference> = this.mdlDialogService.showCustomDialog({
          component: DialogComponent,
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

        updaterDialog.subscribe((dialogRef: MdlDialogReference) => {
          dialogRef.onHide().subscribe((data) => {
            if (data) {
              this.electronService.ipcRenderer.send("download-update");
            }
          });
        });
      });
    });
  }

  private setupUpToDateHandler(): void {
    this.electronService.ipcRenderer.on("up-to-date", (event) => {
      this.ngZone.run(() => {
        this.mdlSnackbarService.showToast('Hooray, you\'re using the latest version!');
      });  
    });
  }
}