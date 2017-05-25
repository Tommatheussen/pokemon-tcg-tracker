import { Injectable } from '@angular/core';
import { MdlSnackbarService } from '@angular-mdl/core';

import * as Datastore from 'nedb';

import { Observable } from 'rxjs';

import { ElectronService } from 'ngx-electron';

@Injectable()
export class UpdaterService {
  constructor(
    private electronService: ElectronService,
    private mdlSnackbarService: MdlSnackbarService
  ) {
    this.setupUpToDateHandler();
    this.setupNewVersionHandler();

    electronService.ipcRenderer.send("check-update");
  }

  private setupNewVersionHandler(): void {
    this.electronService.ipcRenderer.on("update-available", (ev, info) => {
      this.mdlSnackbarService.showSnackbar({
        message: `New version avialable: ${info.version}`,
        
      });
    });
  }

  private setupUpToDateHandler(): void {
    this.electronService.ipcRenderer.on("up-to-date", (event) => {
      this.mdlSnackbarService.showToast('Hooray, you\'re using the latest version!');
    });
  }
}