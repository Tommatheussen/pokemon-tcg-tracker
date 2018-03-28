import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { UpdateInfo } from '../../models/update-info.interface';

@Component({
  selector: 'pokemon-update-available-dialog-component',
  templateUrl: './update-available-dialog.component.html',
  styleUrls: ['./update-available-dialog.component.scss']
})
export class UpdateAvailableDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public updateInfo: UpdateInfo) {}
}
