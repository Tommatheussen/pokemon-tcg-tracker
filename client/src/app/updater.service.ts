import { Injectable } from '@angular/core';
import { MdlSnackbarService, MdlDialogService } from '@angular-mdl/core';

import { InjectionToken } from '@angular/core';

export let NOTES = new InjectionToken<string>("NOTE");

import * as Datastore from 'nedb';

import { Observable } from 'rxjs';

import { ElectronService } from 'ngx-electron';
import { DialogComponent } from './dialog.component';

@Injectable()
export class UpdaterService {
  constructor(
    private electronService: ElectronService,
    private mdlSnackbarService: MdlSnackbarService,
    private mdlDialogService: MdlDialogService
  ) {
    this.setupUpToDateHandler();
    this.setupNewVersionHandler();

    electronService.ipcRenderer.send("check-update");

    this.mdlDialogService.showCustomDialog({
      component: DialogComponent,
      providers: [
        {
          provide: NOTES,
          useValue: 'Note'
        }
      ],
      isModal: true,
      styles: {'width': '350px'},
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    })
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