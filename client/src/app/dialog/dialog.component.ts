import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from '@angular-mdl/core';

import { UpdateInfo } from '../models/update-info.interface';
import { UPDATE_INFO } from '../models/update-info.token';

@Component({
  selector: 'dialog-component',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  public updateInfo: UpdateInfo;

  constructor(
    @Inject(UPDATE_INFO) updateInfo: UpdateInfo,
    private dialog: MdlDialogReference) {
    this.updateInfo = updateInfo;
  }

  public dismissUpdate(): void {
    this.dialog.hide(false);
  }

  public doUpdate(): void {
    this.dialog.hide(true);
  }
}