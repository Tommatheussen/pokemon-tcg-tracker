import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from '@angular-mdl/core';

import { UpdateInfo } from '../models/update-info.interface';
import { UPDATE_INFO } from '../models/update-info.token';

@Component({
  selector: 'update-available-dialog-component',
  templateUrl: './update-available-dialog.component.html',
  styleUrls: ['./update-available-dialog.component.css']
})
export class UpdateAvailableDialogComponent {
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