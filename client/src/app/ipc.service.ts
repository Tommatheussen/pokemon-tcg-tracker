import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class IpcService {
  constructor(
    private _electronService: ElectronService,
    private _zone: NgZone
  ) {}

  public setupIpcListener(event: string, func: Function) {
    this._electronService.ipcRenderer.on(event, (event, args) => {
      this._zone.run(() => {
        func(event, args);
      });
    });
  }

  public setupIpcListenerOnce(event: string, func: Function) {
    this._electronService.ipcRenderer.once(event, (event, args) => {
      this._zone.run(() => {
        func(event, args);
      });
    });
  }

  public sendMessage(event: string, data?: {}) {
    this._electronService.ipcRenderer.send(event, data);
  }
}
